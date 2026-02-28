import { neon } from '@neondatabase/serverless';

// Handle different HTTP methods and endpoints
async function handleRequest(request, method, path) {
  const sql = neon(process.env.DATABASE_URL);
  
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL is not set' }, { status: 500 });
  }

  try {
    // MEMBERS ENDPOINTS
    if (path === '/members') {
      if (method === 'GET') {
        const members = await sql`SELECT * FROM members ORDER BY created_at DESC`;
        return Response.json(members);
      }
      
      if (method === 'POST') {
        const memberData = await request.json();
        const id = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const member = await sql`
          INSERT INTO members (
            id, voornamen, tussenvoegsel, achternaam, lidnummer, lidtype,
            burgerlijke_staat, betaal_methode, email, telefoonnummer, adres,
            postcode, woonplaats, nationaliteit, geboortedatum, geboorteplaats,
            contributietarief, registratie_datum, status
          ) VALUES (
            ${id}, ${memberData.voornamen}, ${memberData.tussenvoegsel}, ${memberData.achternaam}, 
            ${memberData.lidnummer}, ${memberData.lidtype}, ${memberData.burgerlijke_staat},
            ${memberData.betaal_methode}, ${memberData.email}, ${memberData.telefoonnummer}, 
            ${memberData.adres}, ${memberData.postcode}, ${memberData.woonplaats}, 
            ${memberData.nationaliteit}, ${memberData.geboortedatum}, ${memberData.geboorteplaats},
            ${memberData.contributietarief}, ${new Date().toISOString().split('T')[0]}, 'Active'
          ) RETURNING *
        `;
        
        return Response.json(member[0]);
      }
      
      if (method === 'PUT') {
        const memberData = await request.json();
        const member = await sql`
          UPDATE members SET
            voornamen = ${memberData.voornamen}, tussenvoegsel = ${memberData.tussenvoegsel}, 
            achternaam = ${memberData.achternaam}, lidnummer = ${memberData.lidnummer}, 
            lidtype = ${memberData.lidtype}, burgerlijke_staat = ${memberData.burgerlijke_staat},
            betaal_methode = ${memberData.betaal_methode}, email = ${memberData.email}, 
            telefoonnummer = ${memberData.telefoonnummer}, adres = ${memberData.adres}, 
            postcode = ${memberData.postcode}, woonplaats = ${memberData.woonplaats}, 
            nationaliteit = ${memberData.nationaliteit}, geboortedatum = ${memberData.geboortedatum}, 
            geboorteplaats = ${memberData.geboorteplaats}, contributietarief = ${memberData.contributietarief},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${memberData.id}
          RETURNING *
        `;
        
        return Response.json(member[0]);
      }
      
      if (method === 'DELETE') {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        
        if (!id) {
          return Response.json({ error: 'Member ID is required' }, { status: 400 });
        }
        
        await sql`DELETE FROM members WHERE id = ${id}`;
        return Response.json({ success: true, message: 'Member deleted successfully' });
      }
    }
    
    // PAYMENTS ENDPOINTS
    if (path === '/payments') {
      if (method === 'GET') {
        const payments = await sql`
          SELECT p.*, m.voornamen, m.achternaam 
          FROM payments p 
          JOIN members m ON p.member_id = m.id 
          ORDER BY p.created_at DESC
        `;
        return Response.json(payments);
      }
      
      if (method === 'POST') {
        const paymentData = await request.json();
        const id = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const payment = await sql`
          INSERT INTO payments (
            id, member_id, month, year, amount_due, amount_paid,
            payment_date, payment_method, reference_note, status
          ) VALUES (
            ${id}, ${paymentData.member_id}, ${paymentData.month}, ${paymentData.year},
            ${paymentData.amount_due}, ${paymentData.amount_paid || 0}, 
            ${paymentData.payment_date}, ${paymentData.payment_method}, 
            ${paymentData.reference_note}, 'Unpaid'
          ) RETURNING *
        `;
        
        return Response.json(payment[0]);
      }
    }
    
    // AUTH ENDPOINT
    if (path === '/auth') {
      if (method === 'POST') {
        const { username, password } = await request.json();
        
        if (!username || !password) {
          return Response.json({ error: 'Username and password required' }, { status: 400 });
        }
        
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
      }
    }
    
    // DATABASE TEST ENDPOINT
    if (path === '/test-db') {
      const result = await sql`SELECT NOW() as current_time`;
      
      const tables = await sql`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      `;
      
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
    }
    
    // MIGRATION ENDPOINT
    if (path === '/migrate-db' && method === 'POST') {
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
    }
    
    return Response.json({ error: 'Endpoint not found' }, { status: 404 });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ 
      error: 'Request failed', 
      details: error.message 
    }, { status: 500 });
  }
}

// Export individual handlers for Vercel compatibility
export async function GET(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  return handleRequest(request, 'GET', path);
}

export async function POST(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  return handleRequest(request, 'POST', path);
}

export async function PUT(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  return handleRequest(request, 'PUT', path);
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  return handleRequest(request, 'DELETE', path);
}
