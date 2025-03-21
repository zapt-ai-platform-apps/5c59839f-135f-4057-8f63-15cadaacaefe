import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { fetchStats } from '../services';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    unsubscribedUsers: 0,
    totalBroadcasts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    </div>
  );
}