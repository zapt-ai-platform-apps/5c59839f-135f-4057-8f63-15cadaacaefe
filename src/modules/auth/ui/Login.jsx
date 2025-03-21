import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import * as Sentry from '@sentry/browser';

export default function Login() {
  const { user, loading, isAuthorized } = useAuth();

  useEffect(() => {
    // Track if authorized user tried to sign in
    if (user && !isAuthorized) {
      console.error('Unauthorized login attempt:', user.email);
      Sentry.captureMessage(`Unauthorized login attempt: ${user.email}`, 'warning');
    }
  }, [user, isAuthorized]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in and authorized, redirect to dashboard
  if (user && isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <img
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=120&height=120"
            alt="ZAPT Logo"
            className="mx-auto h-16 w-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">ZAPT Email Marketing</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in with ZAPT
            </a>
          </p>
        </div>
        
        {user && !isAuthorized && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Access denied!</strong>
            <span className="block sm:inline"> Only david@mapt.events can access this app.</span>
          </div>
        )}

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'facebook', 'apple']}
          magicLink={true}
          view="magic_link"
          theme="light"
        />
      </div>
    </div>
  );
}