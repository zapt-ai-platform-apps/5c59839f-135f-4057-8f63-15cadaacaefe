import * as Sentry from '@sentry/browser';

export async function fetchStats() {
  try {
    // In a real app, we would fetch this from an API
    // For now, we'll return mock data
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      totalUsers: 2500,
      activeUsers: 2300,
      unsubscribedUsers: 200,
      totalBroadcasts: 12
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    Sentry.captureException(error);
    throw error;
  }
}