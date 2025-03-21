import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { fetchStats } from '../services';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import Alert from '@/modules/core/ui/Alert';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    unsubscribedUsers: 0,
    totalBroadcasts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session } = useAuth();

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats(session);
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [session]);

  const hasNoData = !loading && 
    stats.totalUsers === 0 && 
    stats.activeUsers === 0 && 
    stats.unsubscribedUsers === 0 && 
    stats.totalBroadcasts === 0;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {error && (
            <Alert type="error" title="Error Loading Data">
              {error}
            </Alert>
          )}
          
          {hasNoData && !error ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600">
                You haven't imported any users yet. Go to the <strong>Import Users</strong> page to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Users" 
                value={stats.totalUsers} 
                icon="👥" 
                color="bg-blue-100 text-blue-800"
              />
              <StatCard 
                title="Active Users" 
                value={stats.activeUsers} 
                icon="✅" 
                color="bg-green-100 text-green-800"
              />
              <StatCard 
                title="Unsubscribed" 
                value={stats.unsubscribedUsers} 
                icon="🚫" 
                color="bg-red-100 text-red-800"
              />
              <StatCard 
                title="Broadcasts Sent" 
                value={stats.totalBroadcasts} 
                icon="📨" 
                color="bg-purple-100 text-purple-800"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}