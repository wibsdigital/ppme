import { neon } from '@neondatabase/serverless';

export async function POST() {
  try {
    if (!process.env.DATABASE_URL) {
      return Response.json({ error: 'DATABASE_URL is not set' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Add nationaliteit column if it doesn't exist
    try {
      await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS nationaliteit VARCHAR(100)`;
      
      await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS geboorteplaats VARCHAR(255)`;
      
      return Response.json({
        success: true,
        message: 'Database schema updated successfully',
        changes: [
          'Added nationaliteit column',
          'Added geboorteplaats column'
        ]
      });
    } catch (error) {
      console.error('Migration error:', error);
      
      // Check if columns already exist
      if (error.message && error.message.includes('already exists')) {
        return Response.json({
          success: true,
          message: 'Database schema already up to date',
          note: 'Columns may already exist'
        });
      }
      
      return Response.json({ 
        error: 'Migration failed', 
        details: error.message 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Migration error:', error);
    return Response.json({ 
      error: 'Migration failed', 
      details: error.message 
    }, { status: 500 });
  }
}
