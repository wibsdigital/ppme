import { useState } from 'react';

export default function TestAuthPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'ppme2024' })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#0d1b2a' }}>
      <div className="max-w-md w-full p-6 rounded" style={{ background: '#1a2332' }}>
        <h1 className="text-2xl font-bold text-white mb-4">Auth Test</h1>
        
        <button
          onClick={testAuth}
          disabled={loading}
          className="w-full py-2 px-4 rounded text-white"
          style={{ background: loading ? '#666' : '#c8933a' }}
        >
          {loading ? 'Testing...' : 'Test Admin Login'}
        </button>
        
        {result && (
          <div className="mt-4 p-4 rounded text-sm">
            <h3 className="text-white mb-2">Result:</h3>
            <pre className="text-green-400" style={{ whiteSpace: 'pre-wrap' }}>
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
