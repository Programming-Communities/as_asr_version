import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userData = rateLimit.get(ip);

  if (!userData) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (now > userData.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userData.count >= RATE_LIMIT_MAX) {
    return false;
  }

  userData.count++;
  rateLimit.set(ip, userData);
  return true;
}

// Cleanup old rate limit entries
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimit.entries()); // Convert to array
  for (const [ip, data] of entries) {
    if (now > data.resetTime) {
      rateLimit.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { postId, reaction, guestToken } = body;

    // Validate input
    if (!postId || !reaction || !guestToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate reaction type
    const validReactions = ['like', 'love', 'celebrate', 'clap', 'fire', 'smile'];
    if (!validReactions.includes(reaction)) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    // Simulate success
    const success = true;

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to submit reaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Reaction submitted successfully'
    });

  } catch (error) {
    console.error('Reaction API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    // Return mock data
    const mockReactions = {
      like: Math.floor(Math.random() * 100),
      love: Math.floor(Math.random() * 50),
      celebrate: Math.floor(Math.random() * 30),
      clap: Math.floor(Math.random() * 40),
      fire: Math.floor(Math.random() * 20),
      smile: Math.floor(Math.random() * 60),
    };

    return NextResponse.json(mockReactions);

  } catch (error) {
    console.error('Get reactions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}