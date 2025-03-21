import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './modules/dashboard/ui/Dashboard';
import ImportUsers from './modules/users/ui/ImportUsers';
import ManageAudiences from './modules/audiences/ui/ManageAudiences';
import CreateBroadcast from './modules/broadcasts/ui/CreateBroadcast';
import Navigation from './modules/core/ui/Navigation';
import Header from './modules/core/ui/Header';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Header />
        <div className="flex h-full">
          <Navigation />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/import" element={<ImportUsers />} />
              <Route path="/audiences" element={<ManageAudiences />} />
              <Route path="/broadcasts" element={<CreateBroadcast />} />
            </Routes>
          </main>
        </div>
        <div className="text-center py-4 text-sm text-gray-500">
          <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            Made on ZAPT
          </a>
        </div>
      </div>
    </Router>
  );
}