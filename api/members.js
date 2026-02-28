import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return Response.json({ error: 'DATABASE_URL is not set' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    
    const members = await sql`
      SELECT * FROM members 
      ORDER BY created_at DESC
    `;
    
    return Response.json(members);
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return Response.json({ error: 'Failed to fetch members', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!process.env.DATABASE_URL) {
      return Response.json({ error: 'DATABASE_URL is not set' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const memberData = await request.json();
    const id = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Combine name fields
    const fullName = `${memberData.voornamen || ''} ${memberData.tussenvoegsel || ''} ${memberData.achternaam || ''}`.trim();
    
    const member = await sql`
      INSERT INTO members (
        id, naam, email, telefoon, adres, burgerlijke_staat,
        contributietarief, betaal_methode, registratie_datum, status
      ) VALUES (
        ${id}, 
        ${fullName}, 
        ${memberData.email}, 
        ${memberData.telefoonnummer}, 
        ${memberData.adres}, 
        ${memberData.burgerlijke_staat},
        ${memberData.contributietarief}, 
        ${memberData.betaal_methode}, 
        ${new Date().toISOString().split('T')[0]}, 
        'Active'
      )
      RETURNING *
    `;
    
    console.log('Member created successfully:', member[0]);
    return Response.json(member[0]);
  } catch (error) {
    console.error('Member creation error:', error);
    return Response.json({ error: 'Failed to create member', details: error.message }, { status: 500 });
  }
}
