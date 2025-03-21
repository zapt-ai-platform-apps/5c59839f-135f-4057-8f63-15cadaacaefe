import React, { useState } from 'react';
import Button from '../../core/ui/Button';
import Alert from '../../core/ui/Alert';
import TextInput from '../../core/ui/TextInput';
import TextArea from '../../core/ui/TextArea';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export default function CreateBroadcast() {
  const [broadcastData, setBroadcastData] = useState({
    audienceId: '',
    name: '',
    subject: '',
    htmlContent: '<p>Hello,</p><p>This is the content of your email.</p><p>Regards,<br>Your Name</p>',
    fromEmail: 'onboarding@resend.dev'
  });
  
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { session } = useAuth();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBroadcastData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!broadcastData.audienceId.trim() || !broadcastData.name.trim() || 
        !broadcastData.subject.trim() || !broadcastData.htmlContent.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSending(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(broadcastData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send broadcast');
      }
      
      const data = await response.json();
      setResult(data);
      
      // Reset form
      setBroadcastData({
        audienceId: '',
        name: '',
        subject: '',
        htmlContent: '<p>Hello,</p><p>This is the content of your email.</p><p>Regards,<br>Your Name</p>',
        fromEmail: 'onboarding@resend.dev'
      });
    } catch (err) {
      console.error('Broadcast error:', err);
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Create Email Broadcast</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSendBroadcast}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Broadcast Name
              </label>
              <TextInput
                id="name"
                name="name"
                value={broadcastData.name}
                onChange={handleChange}
                placeholder="Weekly Newsletter"
                required
                className="box-border"
              />
            </div>
            
            <div>
              <label htmlFor="audienceId" className="block text-sm font-medium text-gray-700 mb-1">
                Audience ID
              </label>
              <TextInput
                id="audienceId"
                name="audienceId"
                value={broadcastData.audienceId}
                onChange={handleChange}
                placeholder="e.g., abc123"
                required
                className="box-border"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject
            </label>
            <TextInput
              id="subject"
              name="subject"
              value={broadcastData.subject}
              onChange={handleChange}
              placeholder="Your Weekly Newsletter"
              required
              className="box-border"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="htmlContent" className="block text-sm font-medium text-gray-700 mb-1">
              Email Content (HTML)
            </label>
            <TextArea
              id="htmlContent"
              name="htmlContent"
              value={broadcastData.htmlContent}
              onChange={handleChange}
              rows={10}
              placeholder="<p>Enter your HTML content here...</p>"
              required
              className="box-border"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 mb-1">
              From Email
            </label>
            <TextInput
              id="fromEmail"
              name="fromEmail"
              value={broadcastData.fromEmail}
              onChange={handleChange}
              placeholder="you@example.com"
              className="box-border"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSending}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {isSending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : 'Send Broadcast'}
          </Button>
        </form>
      </div>
      
      {error && (
        <Alert type="error" title="Error">
          {error}
        </Alert>
      )}
      
      {result && (
        <Alert type="success" title="Broadcast Sent">
          Broadcast has been successfully sent!
        </Alert>
      )}
    </div>
  );
}