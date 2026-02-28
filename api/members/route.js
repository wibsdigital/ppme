import sql from '../../api/db.js';

export async function GET() {
  try {
    const members = await sql`
      SELECT * FROM members 
      ORDER BY created_at DESC
    `;
    return Response.json(members);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const memberData = await request.json();
    const id = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const member = await sql`
      INSERT INTO members (
        id, naam, email, telefoon, adres, burgerlijke_staat,
        contributietarief, betaal_methode, registratie_datum, status
      ) VALUES (
        ${id}, 
        ${memberData.naam}, 
        ${memberData.email}, 
        ${memberData.telefoon}, 
        ${memberData.adres}, 
        ${memberData.burgerlijke_staat},
        ${memberData.contributietarief}, 
        ${memberData.betaal_methode}, 
        ${new Date().toISOString().split('T')[0]}, 
        'Active'
      )
      RETURNING *
    `;
    
    return Response.json(member[0]);
  } catch (error) {
    return Response.json({ error: 'Failed to create member' }, { status: 500 });
  }
}
