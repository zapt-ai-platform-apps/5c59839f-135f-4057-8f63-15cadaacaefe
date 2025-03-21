import React from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">ZAPT Email Marketing</h1>
        
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user.email}</span>
            <button 
              onClick={signOut}
              className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}