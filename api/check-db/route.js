import sql from '../../../api/db.js';

export async function GET() {
  try {
    // Check if users table exists and has data
    const users = await sql`SELECT COUNT(*) as count FROM users`;
    
    // Check if tables exist
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    return Response.json({
      success: true,
      userCount: users[0].count,
      tables: tables.map(t => t.table_name),
      message: 'Database connection successful'
    });
    
  } catch (error) {
    return Response.json({ 
      error: 'Database connection failed', 
      details: error.message 
    }, { status: 500 });
  }
}
