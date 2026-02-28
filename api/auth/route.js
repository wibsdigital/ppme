import sql from '../../api/db.js';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Simple authentication (in production, use proper password hashing)
    const users = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;
    
    if (users.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const user = users[0];
    
    // For demo purposes, using simple password check
    // In production, use bcrypt.compare()
    if (password === 'ppme2024' && (username === 'admin' || username === 'penningmeester')) {
      return Response.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        }
      });
    }
    
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return Response.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
