import { getDbClient, handleApiError } from './_apiUtils.js';
import { emailManagement } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Validate webhook signature if needed
    const payload = req.body;
    console.log('Webhook received:', JSON.stringify(payload));
    
    if (!payload || !payload.type) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }
    
    // Connect to database
    const db = await getDbClient();
    
    // Process different event types
    if (payload.type === 'email.unsubscribed') {
      // Handle unsubscribe event
      const email = payload.data?.email;
      
      if (email) {
        console.log(`Processing unsubscribe for email: ${email}`);
        
        await db.update(emailManagement)
          .set({ 
            isUnsubscribed: true,
            unsubscribedAt: new Date()
          })
          .where(eq(emailManagement.email, email));
      }
    } else if (payload.type === 'email.bounced') {
      // Handle bounce event
      const email = payload.data?.email;
      
      if (email) {
        console.log(`Processing bounce for email: ${email}`);
        
        await db.update(emailManagement)
          .set({ 
            isUnsubscribed: true,
            unsubscribedAt: new Date()
          })
          .where(eq(emailManagement.email, email));
      }
    }
    // Add handling for other event types as needed
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return handleApiError(res, error, 'Failed to process Resend webhook');
  }
}