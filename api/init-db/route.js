import sql from '../../../api/db.js';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // Read and execute the schema
    const schemaPath = path.join(process.cwd(), 'api', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      await sql`${statement}`;
    }
    
    // Add default admin users
    await sql`
      INSERT INTO users (id, username, password_hash, name, role) 
      VALUES 
        ('admin_1', 'admin', 'ppme2024', 'Administrator', 'Admin'),
        ('treasurer_1', 'penningmeester', 'ppme2024', 'Penningmeester', 'Treasurer')
      ON CONFLICT (username) DO NOTHING
    `;
    
    // Add default settings
    await sql`
      INSERT INTO settings (id, organization_name, contribution_married, contribution_single, currency, default_payment_method, language)
      VALUES ('default', 'PPME Al Ikhlash Amsterdam', 20.00, 10.00, 'EUR', 'Bank Transfer', 'nl')
      ON CONFLICT (id) DO UPDATE SET
        organization_name = EXCLUDED.organization_name,
        contribution_married = EXCLUDED.contribution_married,
        contribution_single = EXCLUDED.contribution_single,
        currency = EXCLUDED.currency,
        default_payment_method = EXCLUDED.default_payment_method,
        language = EXCLUDED.language
    `;
    
    return Response.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });
    
  } catch (error) {
    console.error('Database initialization error:', error);
    return Response.json({ 
      error: 'Failed to initialize database', 
      details: error.message 
    }, { status: 500 });
  }
}
