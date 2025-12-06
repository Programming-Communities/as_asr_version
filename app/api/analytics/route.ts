import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    if (!event || !data) {
      return NextResponse.json(
        { error: 'Event and data are required' },
        { status: 400 }
      );
    }

    // Check if analytics is enabled
    const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
    if (!analyticsEnabled) {
      return NextResponse.json(
        { success: true, message: 'Analytics disabled' },
        { status: 200 }
      );
    }

    // Process different event types
    switch (event) {
      case 'page_view':
        console.log('📊 Page view:', data);
        break;
      case 'click':
        console.log('🖱️ Click event:', data);
        break;
      case 'scroll':
        console.log('📜 Scroll depth:', data.depth);
        break;
      case 'time_on_page':
        console.log('⏱️ Time on page:', data.duration);
        break;
      case 'reaction':
        console.log('❤️ Reaction:', data);
        break;
      case 'comment':
        console.log('💬 Comment:', data);
        break;
      case 'share':
        console.log('📤 Share:', data);
        break;
      default:
        console.log('❓ Unknown event:', event, data);
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const metric = searchParams.get('metric');
    const period = searchParams.get('period') || '7d';

    const mockData = {
      page_views: {
        total: 12480,
        change: '+12%',
        daily: [
          { date: '2024-01-01', value: 1420 },
          { date: '2024-01-02', value: 1560 },
          { date: '2024-01-03', value: 1380 },
          { date: '2024-01-04', value: 1620 },
          { date: '2024-01-05', value: 1780 },
          { date: '2024-01-06', value: 1950 },
          { date: '2024-01-07', value: 2120 },
        ],
      },
      top_pages: [
        { page: '/post/quran-basics', views: 2450 },
        { page: '/post/hadith-collection', views: 1890 },
        { page: '/category/fiqh', views: 1560 },
        { page: '/about', views: 1230 },
        { page: '/contact', views: 980 },
      ],
      traffic_sources: {
        direct: 45,
        search: 30,
        social: 15,
        referral: 10,
      },
      user_engagement: {
        avg_time_on_page: '3m 24s',
        bounce_rate: '42%',
        pages_per_session: 3.2,
      },
      devices: {
        mobile: 58,
        desktop: 35,
        tablet: 7,
      },
    };

    if (metric && mockData[metric as keyof typeof mockData]) {
      return NextResponse.json({
        success: true,
        data: mockData[metric as keyof typeof mockData],
      });
    }

    return NextResponse.json({
      success: true,
      data: mockData,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}