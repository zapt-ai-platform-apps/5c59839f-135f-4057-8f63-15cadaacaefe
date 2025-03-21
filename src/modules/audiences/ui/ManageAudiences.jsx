import React, { useState } from 'react';
import Button from '../../core/ui/Button';
import Alert from '../../core/ui/Alert';
import TextInput from '../../core/ui/TextInput';

export default function ManageAudiences() {
  const [audienceName, setAudienceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleCreateAudience = async (e) => {
    e.preventDefault();
    
    if (!audienceName.trim()) {
      setError('Please enter an audience name');
      return;
    }
    
    setIsCreating(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/audience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audienceName: audienceName.trim()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create audience');
      }
      
      const data = await response.json();
      setResult(data);
      setAudienceName('');
    } catch (err) {
      console.error('Audience creation error:', err);
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Manage Audiences</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Audience</h3>
        
        <form onSubmit={handleCreateAudience}>
          <div className="mb-4">
            <label htmlFor="audienceName" className="block text-sm font-medium text-gray-700 mb-1">
              Audience Name
            </label>
            <TextInput
              id="audienceName"
              value={audienceName}
              onChange={(e) => setAudienceName(e.target.value)}
              placeholder="e.g., Active Subscribers"
              required
              className="box-border"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {isCreating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : 'Create Audience'}
          </Button>
        </form>
      </div>
      
      {error && (
        <Alert type="error" title="Error">
          {error}
        </Alert>
      )}
      
      {result && (
        <Alert type="success" title="Audience Created">
          Successfully created audience "{result.audienceName}" and added {result.subscribersAdded} subscribers.
        </Alert>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Audiences</h3>
        <p className="text-gray-500 italic">No audiences created yet.</p>
      </div>
    </div>
  );
}