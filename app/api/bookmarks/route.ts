    import { NextRequest, NextResponse } from 'next/server';

interface Bookmark {
  id: string;
  postId: number;
  userId: string;
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  savedAt: string;
}

// In-memory store for demo (replace with database in production)
let bookmarks: Bookmark[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userBookmarks = bookmarks.filter(b => b.userId === userId);
    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedBookmarks = userBookmarks.slice(start, end);

    return NextResponse.json({
      success: true,
      data: {
        bookmarks: paginatedBookmarks,
        pagination: {
          page,
          limit,
          total: userBookmarks.length,
          totalPages: Math.ceil(userBookmarks.length / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, postId, title, excerpt, slug, image } = body;

    if (!userId || !postId || !title || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if already bookmarked
    const existingBookmark = bookmarks.find(
      b => b.userId === userId && b.postId === postId
    );

    if (existingBookmark) {
      return NextResponse.json({
        success: false,
        error: 'Already bookmarked',
      });
    }

    const newBookmark: Bookmark = {
      id: `${userId}-${postId}-${Date.now()}`,
      userId,
      postId,
      title,
      excerpt: excerpt || '',
      slug,
      image,
      savedAt: new Date().toISOString(),
    };

    bookmarks.push(newBookmark);

    return NextResponse.json({
      success: true,
      data: newBookmark,
      message: 'Bookmark added successfully',
    });
  } catch (error) {
    console.error('Add bookmark error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const bookmarkId = searchParams.get('bookmarkId');
    const postId = searchParams.get('postId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!bookmarkId && !postId) {
      return NextResponse.json(
        { error: 'Either bookmarkId or postId is required' },
        { status: 400 }
      );
    }

    const initialLength = bookmarks.length;
    
    if (bookmarkId) {
      bookmarks = bookmarks.filter(b => !(b.userId === userId && b.id === bookmarkId));
    } else if (postId) {
      bookmarks = bookmarks.filter(b => !(b.userId === userId && b.postId === parseInt(postId)));
    }

    const removed = initialLength > bookmarks.length;

    return NextResponse.json({
      success: removed,
      message: removed ? 'Bookmark removed successfully' : 'Bookmark not found',
    });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}