export async function GET() {
  return Response.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return Response.json({
      message: 'POST received successfully',
      received: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ 
      error: 'Failed to parse request body',
      details: error.message 
    }, { status: 400 });
  }
}
