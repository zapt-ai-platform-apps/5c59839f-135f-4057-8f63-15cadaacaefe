import * as Sentry from '@sentry/browser';

export async function fetchStats(session) {
  try {
    if (!session?.access_token) {
      throw new Error('No authenticated session available');
    }
    
    const response = await fetch('/api/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    Sentry.captureException(error);
    // Don't throw the error - return zeros to avoid breaking the UI
    return {
      totalUsers: 0,
      activeUsers: 0,
      unsubscribedUsers: 0,
      totalBroadcasts: 0
    };
  }
}