import sql from '../../../api/db.js';

export async function GET() {
  try {
    // Test database connection
    const result = await sql`SELECT NOW() as current_time`;
    
    // Test if tables exist
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `;
    
    // Test if we can query members
    let memberCount = 0;
    try {
      const members = await sql`SELECT COUNT(*) as count FROM members`;
      memberCount = members[0].count;
    } catch (err) {
      console.log('Members table might not exist yet:', err.message);
    }
    
    return Response.json({
      success: true,
      database_time: result[0].current_time,
      tables: tables.map(t => t.table_name),
      member_count: memberCount,
      message: 'Database connection working'
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return Response.json({ 
      error: 'Database connection failed', 
      details: error.message 
    }, { status: 500 });
  }
}
