import React, { useState } from 'react';
import Button from '../../core/ui/Button';
import Alert from '../../core/ui/Alert';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export default function ImportUsers() {
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { session } = useAuth();
  
  const handleImport = async () => {
    setIsImporting(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          page: 1,
          perPage: 100
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import users');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Import error:', err);
      setError(err.message);
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Import Users from Intercom</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-gray-600 mb-4">
          Click the button below to import users from Intercom. This process will fetch all contacts
          from your Intercom account and add them to your email database. Users who have previously
          unsubscribed or bounced will be imported but marked as unsubscribed.
        </p>
        
        <Button 
          onClick={handleImport} 
          disabled={isImporting}
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          {isImporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Importing...
            </>
          ) : 'Import from Intercom'}
        </Button>
      </div>
      
      {error && (
        <Alert type="error" title="Import Failed">
          {error}
        </Alert>
      )}
      
      {result && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Import Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm text-green-700 font-medium">Imported</p>
              <p className="text-2xl font-bold text-green-800">{result.results.imported}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-sm text-yellow-700 font-medium">Skipped</p>
              <p className="text-2xl font-bold text-yellow-800">{result.results.skipped}</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700 font-medium">Errors</p>
              <p className="text-2xl font-bold text-red-800">{result.results.errors}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}