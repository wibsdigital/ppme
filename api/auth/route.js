import sql from '../../api/db.js';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Check if username and password are provided
    if (!username || !password) {
      return Response.json({ error: 'Username and password required' }, { status: 400 });
    }
    
    // For demo purposes, hardcoded credentials
    // In production, use proper database authentication with bcrypt
    const validCredentials = [
      { username: 'admin', password: 'ppme2024', name: 'Administrator', role: 'Admin' },
      { username: 'penningmeester', password: 'ppme2024', name: 'Penningmeester', role: 'Treasurer' }
    ];
    
    const validUser = validCredentials.find(
      cred => cred.username === username && cred.password === password
    );
    
    if (validUser) {
      return Response.json({
        success: true,
        user: {
          id: `${validUser.username}_1`,
          username: validUser.username,
          name: validUser.name,
          role: validUser.role
        }
      });
    }
    
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Auth error:', error);
    return Response.json({ error: 'Authentication failed', details: error.message }, { status: 500 });
  }
}
