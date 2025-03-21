import { getDbClient, handleApiError, authenticateUser } from './_apiUtils.js';
import { emailManagement } from '../drizzle/schema.js';
import { eq, sql } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Authenticate user first
      await authenticateUser(req);
      
      // Connect to database
      const db = await getDbClient();
      
      // Get the most recent last_imported_at date
      const [lastImport] = await db.select({
        lastImportedAt: sql`MAX(${emailManagement.lastImportedAt})`
      }).from(emailManagement);
      
      return res.status(200).json({
        lastImportDate: lastImport?.lastImportedAt || null
      });
    } catch (error) {
      return handleApiError(res, error, 'Failed to fetch last import date');
    }
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Authenticate user first
    await authenticateUser(req);

    const intercomToken = process.env.INTERCOM_API_TOKEN;
    if (!intercomToken) {
      return res.status(500).json({ error: 'Intercom API token is not configured' });
    }

    // Get request parameters
    const { importAll = false } = req.body;
    
    console.log(`Starting Intercom import (${importAll ? 'all contacts' : 'new contacts only'})`);
    
    // Connect to database
    const db = await getDbClient();
    
    // If importAll is false, get the last import date
    let lastImportTimestamp = null;
    if (!importAll) {
      const [lastImport] = await db.select({
        lastImportedAt: sql`MAX(${emailManagement.lastImportedAt})`
      }).from(emailManagement);
      
      lastImportTimestamp = lastImport?.lastImportedAt;
      console.log(`Last import timestamp: ${lastImportTimestamp ? new Date(lastImportTimestamp).toISOString() : 'None'}`);
    }
    
    // Initialize results counter
    const results = { imported: 0, skipped: 0, errors: 0, updatedExisting: 0 };
    
    // Save the current import time
    const currentImportTime = new Date();
    
    // Process Intercom contacts in batches (pagination)
    let hasMore = true;
    let nextCursor = null;
    
    while (hasMore) {
      // Prepare the URL with pagination
      let url = 'https://api.intercom.io/contacts?per_page=50';
      if (nextCursor) {
        url += `&starting_after=${nextCursor}`;
      }
      
      // Add a filter for updated_at if we're only importing new contacts
      if (!importAll && lastImportTimestamp) {
        const formattedTimestamp = Math.floor(new Date(lastImportTimestamp).getTime() / 1000);
        url += `&updated_since=${formattedTimestamp}`;
      }
      
      console.log(`Fetching Intercom contacts from: ${url}`);

      // Fetch users from Intercom
      const intercomResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${intercomToken}`,
          'Accept': 'application/json'
        }
      });

      if (!intercomResponse.ok) {
        const errorText = await intercomResponse.text();
        throw new Error(`Intercom API error: ${errorText}`);
      }

      const intercomData = await intercomResponse.json();
      const contacts = intercomData.data || [];
      
      console.log(`Retrieved ${contacts.length} contacts from Intercom`);
      
      // Process and save users
      for (const contact of contacts) {
        try {
          if (!contact.email) {
            results.skipped++;
            continue;
          }
          
          // Skip emails containing a plus sign
          if (contact.email.includes('+')) {
            console.log(`Skipping email with '+': ${contact.email}`);
            results.skipped++;
            continue;
          }
          
          // Get name data
          const firstName = contact.name?.split(' ')[0] || null;
          const lastName = contact.name?.split(' ').slice(1).join(' ') || null;
          
          // Check if user already exists
          const existingUsers = await db.select()
            .from(emailManagement)
            .where(eq(emailManagement.email, contact.email))
            .limit(1);
          
          const existingUser = existingUsers.length > 0 ? existingUsers[0] : null;
          
          // Prepare the contact data
          const contactData = {
            email: contact.email,
            firstName,
            lastName,
            intercomId: contact.id,
            lastImportedAt: currentImportTime
          };
          
          if (existingUser) {
            // Update the existing user but preserve their unsubscribed status
            await db.update(emailManagement)
              .set(contactData)
              .where(eq(emailManagement.id, existingUser.id));
            
            results.updatedExisting++;
          } else {
            // Insert new user
            await db.insert(emailManagement).values({
              ...contactData,
              isUnsubscribed: false
            });
            
            results.imported++;
          }
        } catch (error) {
          console.error('Error importing contact:', contact.email, error);
          Sentry.captureException(error);
          results.errors++;
        }
      }
      
      // Check if there are more pages
      if (intercomData.pages && intercomData.pages.next) {
        nextCursor = intercomData.pages.next.starting_after;
      } else {
        hasMore = false;
      }
      
      // Send interim results for long-running imports
      if ((results.imported + results.updatedExisting) % 500 === 0 && 
         (results.imported + results.updatedExisting) > 0) {
        console.log(`Processed ${results.imported + results.updatedExisting} contacts so far...`);
      }
    }
    
    console.log('Import complete with results:', results);
    
    return res.status(200).json({
      success: true,
      results,
      importTime: currentImportTime.toISOString()
    });
  } catch (error) {
    return handleApiError(res, error, 'Failed to import users from Intercom');
  }
}