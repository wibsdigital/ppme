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
    
    const member = await sql`
      INSERT INTO members (
        id, voornamen, tussenvoegsel, achternaam, lidnummer, lidtype,
        burgerlijke_staat, betaal_methode, email, telefoonnummer, adres,
        postcode, woonplaats, nationaliteit, geboortedatum, geboorteplaats,
        contributietarief, registratie_datum, status
      ) VALUES (
        ${id}, 
        ${memberData.voornamen}, 
        ${memberData.tussenvoegsel}, 
        ${memberData.achternaam}, 
        ${memberData.lidnummer}, 
        ${memberData.lidtype},
        ${memberData.burgerlijke_staat},
        ${memberData.betaal_methode}, 
        ${memberData.email}, 
        ${memberData.telefoonnummer}, 
        ${memberData.adres}, 
        ${memberData.postcode}, 
        ${memberData.woonplaats}, 
        ${memberData.nationaliteit}, 
        ${memberData.geboortedatum}, 
        ${memberData.geboorteplaats},
        ${memberData.contributietarief}, 
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

export async function PUT(request) {
  try {
    if (!process.env.DATABASE_URL) {
      return Response.json({ error: 'DATABASE_URL is not set' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const memberData = await request.json();
    
    const member = await sql`
      UPDATE members SET
        voornamen = ${memberData.voornamen}, 
        tussenvoegsel = ${memberData.tussenvoegsel}, 
        achternaam = ${memberData.achternaam}, 
        lidnummer = ${memberData.lidnummer}, 
        lidtype = ${memberData.lidtype},
        burgerlijke_staat = ${memberData.burgerlijke_staat},
        betaal_methode = ${memberData.betaal_methode}, 
        email = ${memberData.email}, 
        telefoonnummer = ${memberData.telefoonnummer}, 
        adres = ${memberData.adres}, 
        postcode = ${memberData.postcode}, 
        woonplaats = ${memberData.woonplaats}, 
        nationaliteit = ${memberData.nationaliteit}, 
        geboortedatum = ${memberData.geboortedatum}, 
        geboorteplaats = ${memberData.geboorteplaats},
        contributietarief = ${memberData.contributietarief},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${memberData.id}
      RETURNING *
    `;
    
    console.log('Member updated successfully:', member[0]);
    return Response.json(member[0]);
  } catch (error) {
    console.error('Member update error:', error);
    return Response.json({ error: 'Failed to update member', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!process.env.DATABASE_URL) {
      return Response.json({ error: 'DATABASE_URL is not set' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return Response.json({ error: 'Member ID is required' }, { status: 400 });
    }
    
    await sql`DELETE FROM members WHERE id = ${id}`;
    
    return Response.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Member deletion error:', error);
    return Response.json({ error: 'Failed to delete member', details: error.message }, { status: 500 });
  }
}
