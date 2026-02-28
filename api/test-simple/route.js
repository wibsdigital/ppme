export async function GET() {
  return Response.json({ 
    message: 'Simple test API working',
    timestamp: new Date().toISOString()
  });
}

export async function POST() {
  try {
    const data = await request.json();
    return Response.json({ 
      success: true,
      received: data,
      message: 'POST test successful'
    });
  } catch (error) {
    return Response.json({ 
      error: 'POST test failed',
      details: error.message 
    }, { status: 500 });
  }
}
