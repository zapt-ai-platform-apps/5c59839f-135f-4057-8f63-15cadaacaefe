import { getDbClient, handleApiError, authenticateUser } from './_apiUtils.js';
import { emailManagement } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
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
    const { page = 1, perPage = 50 } = req.body;
    
    console.log(`Importing Intercom users - page ${page}, perPage ${perPage}`);

    // Fetch users from Intercom
    const intercomResponse = await fetch('https://api.intercom.io/contacts', {
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
    console.log(`Retrieved ${intercomData.data?.length || 0} contacts from Intercom`);

    // Connect to database
    const db = await getDbClient();
    
    // Process and save users
    const results = { imported: 0, skipped: 0, errors: 0 };
    
    for (const contact of intercomData.data || []) {
      try {
        if (!contact.email) {
          results.skipped++;
          continue;
        }
        
        // Check if user already exists
        const existingUser = await db.select()
          .from(emailManagement)
          .where(eq(emailManagement.email, contact.email))
          .limit(1);
        
        if (existingUser.length > 0) {
          results.skipped++;
          continue;
        }
        
        // Get name data
        const firstName = contact.name?.split(' ')[0] || null;
        const lastName = contact.name?.split(' ').slice(1).join(' ') || null;
        
        // Insert user
        await db.insert(emailManagement).values({
          email: contact.email,
          firstName,
          lastName,
          isUnsubscribed: false
        });
        
        results.imported++;
      } catch (error) {
        console.error('Error importing contact:', contact.email, error);
        Sentry.captureException(error);
        results.errors++;
      }
    }
    
    return res.status(200).json({
      success: true,
      results,
      pagination: {
        page,
        perPage,
        total: intercomData.total_count
      }
    });
  } catch (error) {
    return handleApiError(res, error, 'Failed to import users from Intercom');
  }
}