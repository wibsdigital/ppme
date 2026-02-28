import sql from '../../api/db.js';

export async function GET() {
  try {
    const payments = await sql`
      SELECT p.*, m.naam as member_name 
      FROM payments p
      JOIN members m ON p.member_id = m.id
      ORDER BY p.year DESC, p.month DESC
    `;
    return Response.json(payments);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const paymentData = await request.json();
    const id = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = await sql`
      INSERT INTO payments (
        id, member_id, month, year, amount_due, amount_paid,
        payment_date, payment_method, reference_note, status
      ) VALUES (
        ${id},
        ${paymentData.member_id},
        ${paymentData.month},
        ${paymentData.year},
        ${paymentData.amount_due},
        ${paymentData.amount_paid || 0},
        ${paymentData.payment_date || null},
        ${paymentData.payment_method || ''},
        ${paymentData.reference_note || ''},
        ${paymentData.status || 'Unpaid'}
      )
      RETURNING *
    `;
    
    return Response.json(payment[0]);
  } catch (error) {
    return Response.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
