import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, categories = [] } = body;

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    if (subscribers.has(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 400 }
      );
    }

    // Add to subscribers
    subscribers.add(email.toLowerCase());

    console.log('New subscriber:', { email, name, categories });

    return NextResponse.json({ 
      success: true,
      message: 'Successfully subscribed!',
      data: {
        email,
        name,
        categories,
        subscribed_at: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Remove subscriber
    const deleted = subscribers.delete(email.toLowerCase());

    if (!deleted) {
      return NextResponse.json(
        { error: 'Email not found in subscriptions' },
        { status: 404 }
      );
    }

    console.log('Unsubscribed:', email);

    return NextResponse.json({ 
      success: true,
      message: 'Successfully unsubscribed',
    });

  } catch (error) {
    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
