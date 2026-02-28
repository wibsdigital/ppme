import { useState } from 'react';

export default function InitDbPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const initializeDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
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
        <h1 className="text-2xl font-bold text-white mb-4">Initialize Database</h1>
        <p className="text-gray-400 mb-6 text-sm">
          This will create the database schema and add default admin users.
        </p>
        
        <button
          onClick={initializeDatabase}
          disabled={loading}
          className="w-full py-2 px-4 rounded text-white mb-4"
          style={{ background: loading ? '#666' : '#c8933a' }}
        >
          {loading ? 'Initializing...' : 'Initialize Database'}
        </button>
        
        {result && (
          <div className="mt-4 p-4 rounded text-sm">
            <h3 className="text-white mb-2">Result:</h3>
            <pre className="text-green-400" style={{ whiteSpace: 'pre-wrap' }}>
              {result}
            </pre>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          <p>After initialization, you can:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Login with admin/ppme2024</li>
            <li>Add members and payments</li>
            <li>Data will persist in database</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
