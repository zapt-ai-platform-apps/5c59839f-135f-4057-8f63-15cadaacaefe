import React from 'react';

export default function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mr-4`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}