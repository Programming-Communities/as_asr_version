import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Validate credentials against your database
    // 2. Check if user exists and password matches
    // 3. Generate JWT token or session
    // 4. Set secure HTTP-only cookie

    // For demo purposes, we'll simulate successful login
    // Replace with actual authentication logic

    const isValid = email.includes('@') && password.length >= 6;

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session data
    const sessionData = {
      user: {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'user',
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    // Create response
    const response = NextResponse.json({
      success: true,
      user: sessionData.user,
    });

    // Set session cookie (in production, use secure, httpOnly, sameSite flags)
    response.cookies.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}