import { useState, useEffect } from 'react';

export default function DatabaseTestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    setResult('Testing database connection...');
    
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      
      if (response.ok) {
        setResult(JSON.stringify(data, null, 2));
      } else {
        setResult(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setResult(`Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testMembersAPI = async () => {
    setLoading(true);
    setResult('Testing members API...');
    
    try {
      const response = await fetch('/api/members');
      const data = await response.json();
      
      if (response.ok) {
        setResult(`Members API Success!\n\nFound ${data.length} members:\n${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`Members API Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setResult(`Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#0d1b2a' }}>
      <div className="max-w-2xl w-full p-6 rounded" style={{ background: '#1a2332' }}>
        <h1 className="text-2xl font-bold text-white mb-4">Database Connection Test</h1>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={testDatabase}
            disabled={loading}
            className="flex-1 py-2 px-4 rounded text-white"
            style={{ background: loading ? '#666' : '#c8933a' }}
          >
            {loading ? 'Testing...' : 'Test Database Connection'}
          </button>
          
          <button
            onClick={testMembersAPI}
            disabled={loading}
            className="flex-1 py-2 px-4 rounded text-white"
            style={{ background: loading ? '#666' : '#2563eb' }}
          >
            {loading ? 'Testing...' : 'Test Members API'}
          </button>
        </div>
        
        {result && (
          <div className="mt-4 p-4 rounded text-sm">
            <h3 className="text-white mb-2">Result:</h3>
            <pre className="text-green-400" style={{ whiteSpace: 'pre-wrap' }}>
              {result}
            </pre>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          <p>This page helps debug database connectivity issues.</p>
          <p>Check if tables exist and if the API endpoints are working.</p>
        </div>
      </div>
    </div>
  );
}
