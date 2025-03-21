import { getDbClient, handleApiError, authenticateUser } from './_apiUtils.js';
import { emailManagement } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Authenticate user first
    await authenticateUser(req);

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return res.status(500).json({ error: 'Resend API key is not configured' });
    }

    const resend = new Resend(resendApiKey);
    const { audienceName } = req.body;
    
    if (!audienceName) {
      return res.status(400).json({ error: 'Audience name is required' });
    }
    
    console.log(`Creating audience: ${audienceName}`);

    // First create the audience in Resend
    const createResponse = await resend.audiences.create({ name: audienceName });
    
    if (createResponse.error) {
      throw new Error(`Failed to create audience: ${createResponse.error.message}`);
    }
    
    const audienceId = createResponse.data.id;
    console.log(`Created audience with ID: ${audienceId}`);
    
    // Connect to database
    const db = await getDbClient();
    
    // Get all active subscribers
    const subscribers = await db.select()
      .from(emailManagement)
      .where(eq(emailManagement.isUnsubscribed, false));
    
    console.log(`Found ${subscribers.length} active subscribers to add to audience`);
    
    // Add subscribers to audience in batches of 1000
    const batchSize = 1000;
    let added = 0;
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const contacts = batch.map(sub => ({
        email: sub.email,
        unsubscribed: false
        // Removed first_name and last_name fields
      }));
      
      const addResponse = await resend.contacts.create({
        audienceId,
        contacts
      });
      
      if (addResponse.error) {
        console.error('Error adding contacts to audience:', addResponse.error);
        Sentry.captureException(new Error(`Failed to add contacts to audience: ${addResponse.error.message}`));
      } else {
        added += batch.length;
      }
    }
    
    return res.status(200).json({
      success: true,
      audienceId,
      audienceName,
      subscribersAdded: added
    });
  } catch (error) {
    return handleApiError(res, error, 'Failed to create audience in Resend');
  }
}