import { NextRequest, NextResponse } from 'next/server';
import wordpressService from '@/services/wordpress';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Fetch posts from WordPress - FIXED: Use hasNextPage instead of hasMore
    const { posts, hasNextPage, endCursor } = await wordpressService.fetchPosts({
      first: perPage,
      after: undefined, // Add proper cursor logic if needed
      category: category ? parseInt(category) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        posts: posts,
        pagination: {
          page,
          per_page: perPage,
          total_posts: posts.length,
          has_more: hasNextPage, // FIXED
          next_cursor: endCursor,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}