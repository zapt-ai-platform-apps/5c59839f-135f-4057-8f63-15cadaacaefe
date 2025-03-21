import React, { useState, useEffect } from 'react';
import Button from '../../core/ui/Button';
import Alert from '../../core/ui/Alert';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export default function ImportUsers() {
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastImportDate, setLastImportDate] = useState(null);
  const [importState, setImportState] = useState(null);
  const { session } = useAuth();
  
  // Fetch the last import date when component mounts
  useEffect(() => {
    async function fetchLastImportDate() {
      if (!session?.access_token) return;
      
      try {
        const response = await fetch('/api/import', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.lastImportDate) {
            setLastImportDate(new Date(data.lastImportDate));
          }
          
          setImportState({
            importInProgress: data.importInProgress,
            lastCursor: data.lastCursor
          });
        }
      } catch (err) {
        console.error('Error fetching last import date:', err);
      }
    }
    
    if (session) {
      fetchLastImportDate();
    }
  }, [session]);
  
  const handleImport = async (importAll = false, resumeImport = false) => {
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
          importAll,
          resumeImport
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import users');
      }
      
      const data = await response.json();
      setResult(data);
      
      // Update the last import date if successful
      if (data.importTime) {
        setLastImportDate(new Date(data.importTime));
      }
      
      // Update the import state
      setImportState({
        importInProgress: false,
        lastCursor: null
      });
    } catch (err) {
      console.error('Import error:', err);
      setError(err.message);
    } finally {
      setIsImporting(false);
    }
  };
  
  const formatDate = (date) => {
    if (!date) return 'Never';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Import Users from Intercom</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Import Options</h3>
          <p className="text-gray-600 mb-4">
            Choose how you want to import users from Intercom. You can import only new users since the last import, or import all users again.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <p className="text-sm text-blue-700">
              <strong>Last Import:</strong> {formatDate(lastImportDate)}
            </p>
            
            {importState?.importInProgress && (
              <p className="text-sm text-orange-700 mt-2">
                <strong>Note:</strong> An import appears to be in progress or was interrupted.
                You can resume the previous import.
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          {importState?.importInProgress && (
            <Button 
              onClick={() => handleImport(false, true)} 
              disabled={isImporting}
              className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
            >
              {isImporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resuming...
                </>
              ) : 'Resume Previous Import'}
            </Button>
          )}
          
          <Button 
            onClick={() => handleImport(false)} 
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
            ) : 'Import New Contacts Only'}
          </Button>
          
          <Button 
            onClick={() => handleImport(true)} 
            disabled={isImporting}
            className="bg-gray-600 hover:bg-gray-700 text-white cursor-pointer"
          >
            {isImporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </>
            ) : 'Import All Contacts'}
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Note: Emails containing a plus sign (e.g., david+test@zapt.ai) will be skipped during import.</p>
        </div>
      </div>
      
      {error && (
        <Alert type="error" title="Import Failed">
          {error}
        </Alert>
      )}
      
      {result && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Import Results</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm text-green-700 font-medium">New Contacts</p>
              <p className="text-2xl font-bold text-green-800">{result.results.imported}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700 font-medium">Updated</p>
              <p className="text-2xl font-bold text-blue-800">{result.results.updatedExisting || 0}</p>
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
          
          {result.importTime && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Import completed at: {formatDate(new Date(result.importTime))}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}