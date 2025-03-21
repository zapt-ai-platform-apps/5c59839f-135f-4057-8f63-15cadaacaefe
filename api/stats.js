import { getDbClient, handleApiError, authenticateUser } from './_apiUtils.js';
import { emailManagement, emailBroadcasts } from '../drizzle/schema.js';
import { count, eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Authenticate user first
    await authenticateUser(req);
    
    console.log('Fetching actual dashboard stats from database');
    
    // Connect to database
    const db = await getDbClient();
    
    // Get total users count
    const [totalUsersResult] = await db.select({ 
      value: count() 
    }).from(emailManagement);
    
    // Get active users count (not unsubscribed)
    const [activeUsersResult] = await db.select({ 
      value: count() 
    }).from(emailManagement)
      .where(eq(emailManagement.isUnsubscribed, false));
    
    // Get unsubscribed users count
    const [unsubscribedUsersResult] = await db.select({ 
      value: count() 
    }).from(emailManagement)
      .where(eq(emailManagement.isUnsubscribed, true));
    
    // Get total broadcasts count
    const [totalBroadcastsResult] = await db.select({ 
      value: count() 
    }).from(emailBroadcasts);
    
    const stats = {
      totalUsers: totalUsersResult.value,
      activeUsers: activeUsersResult.value,
      unsubscribedUsers: unsubscribedUsersResult.value,
      totalBroadcasts: totalBroadcastsResult.value
    };
    
    console.log('Dashboard stats:', stats);
    
    return res.status(200).json(stats);
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch dashboard statistics');
  }
}