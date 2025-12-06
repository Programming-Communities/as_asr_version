import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store
const commentsStore = new Map<number, any[]>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, author_name, author_email, content, parent = 0 } = body;

    // Validate input
    if (!postId || !author_name || !author_email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(author_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Anti-spam check
    if (content.length < 5) {
      return NextResponse.json(
        { error: 'Comment is too short' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment is too long' },
        { status: 400 }
      );
    }

    // Get client IP - FIXED LINE
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    // Create new comment
    const newComment = {
      id: Date.now(),
      postId,
      author_name,
      author_email: author_email.toLowerCase(),
      content,
      parent,
      date: new Date().toISOString(),
      status: 'pending',
      ip: ipAddress, // FIXED: Use ipAddress variable
      user_agent: request.headers.get('user-agent') || '',
    };

    // Store comment
    const postComments = commentsStore.get(postId) || [];
    if (parent > 0) {
      // Find parent and add as reply
      const addReply = (comments: any[], parentId: number): boolean => {
        for (const comment of comments) {
          if (comment.id === parentId) {
            comment.children = comment.children || [];
            comment.children.push(newComment);
            return true;
          }
          if (comment.children && addReply(comment.children, parentId)) {
            return true;
          }
        }
        return false;
      };
      
      if (!addReply(postComments, parent)) {
        postComments.push(newComment);
      }
    } else {
      postComments.push(newComment);
    }

    commentsStore.set(postId, postComments);

    return NextResponse.json({ 
      success: true,
      message: 'Comment submitted successfully',
      comment: newComment,
    });

  } catch (error) {
    console.error('Comment API error:', error);
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

    const postComments = commentsStore.get(parseInt(postId)) || [];

    return NextResponse.json({
      comments: postComments,
      count: postComments.length,
    });

  } catch (error) {
    console.error('Get comments API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}