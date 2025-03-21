import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './modules/dashboard/ui/Dashboard';
import ImportUsers from './modules/users/ui/ImportUsers';
import ManageAudiences from './modules/audiences/ui/ManageAudiences';
import CreateBroadcast from './modules/broadcasts/ui/CreateBroadcast';
import Navigation from './modules/core/ui/Navigation';
import Header from './modules/core/ui/Header';
import Login from './modules/auth/ui/Login';
import ProtectedRoute from './modules/auth/ui/ProtectedRoute';
import { AuthProvider } from './modules/auth/hooks/useAuth';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="flex flex-col h-full">
                  <Header />
                  <div className="flex flex-1">
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
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}