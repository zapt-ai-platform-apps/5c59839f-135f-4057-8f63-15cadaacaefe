import { getDbClient, handleApiError, authenticateUser } from './_apiUtils.js';
import { emailBroadcasts, emailReceipts } from '../drizzle/schema.js';
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
    const { audienceId, name, subject, htmlContent, fromEmail = 'onboarding@resend.dev' } = req.body;
    
    if (!audienceId || !name || !subject || !htmlContent) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['audienceId', 'name', 'subject', 'htmlContent'] 
      });
    }
    
    console.log(`Creating broadcast: ${name}`);

    // Connect to database
    const db = await getDbClient();
    
    // Save broadcast details
    const [broadcast] = await db.insert(emailBroadcasts)
      .values({
        name,
        subject
      })
      .returning();
    
    console.log(`Created broadcast record with ID: ${broadcast.id}`);
    
    // Send broadcast via Resend
    const broadcastResponse = await resend.emails.send({
      from: fromEmail,
      subject,
      audienceId,
      html: htmlContent
    });
    
    if (broadcastResponse.error) {
      throw new Error(`Failed to send broadcast: ${broadcastResponse.error.message}`);
    }
    
    console.log(`Broadcast sent successfully with ID: ${broadcastResponse.data.id}`);
    
    return res.status(200).json({
      success: true,
      broadcastId: broadcast.id,
      resendBroadcastId: broadcastResponse.data.id
    });
  } catch (error) {
    return handleApiError(res, error, 'Failed to send broadcast via Resend');
  }
}