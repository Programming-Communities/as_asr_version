import { NextRequest, NextResponse } from 'next/server';

// Store for performance metrics
const performanceStore: Array<{
  metrics: any;
  url: string;
  timestamp: number;
  userAgent: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const now = Date.now();
    
    const body = await request.json();
    const { metrics, url, timestamp, userAgent } = body;
    
    // Validate required fields
    if (!metrics || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Store metrics
    performanceStore.push({
      metrics,
      url,
      timestamp,
      userAgent,
    });
    
    // Keep only last 1000 entries
    if (performanceStore.length > 1000) {
      performanceStore.shift();
    }
    
    // Log for monitoring
    console.log('📊 Performance metrics received:', {
      url,
      lcp: metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'N/A',
      fid: metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A',
      cls: metrics.cls ? metrics.cls.toFixed(4) : 'N/A',
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Metrics recorded successfully'
    });
    
  } catch (error) {
    console.error('Performance API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Calculate aggregate metrics
    const recentMetrics = performanceStore.slice(-limit);
    
    if (recentMetrics.length === 0) {
      return NextResponse.json({
        metrics: [],
        aggregates: {},
        count: 0,
      });
    }
    
    const aggregates = {
      lcp: calculateAggregate(recentMetrics.map(m => m.metrics.lcp).filter(Boolean)),
      fid: calculateAggregate(recentMetrics.map(m => m.metrics.fid).filter(Boolean)),
      cls: calculateAggregate(recentMetrics.map(m => m.metrics.cls).filter(Boolean)),
    };
    
    return NextResponse.json({
      metrics: recentMetrics,
      aggregates,
      count: recentMetrics.length,
      lastUpdated: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Get performance metrics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateAggregate(values: number[]) {
  if (values.length === 0) return null;
  
  const sorted = [...values].sort((a, b) => a - b);
  
  return {
    avg: sorted.reduce((a, b) => a + b, 0) / sorted.length,
    p50: percentile(sorted, 50),
    p75: percentile(sorted, 75),
    p90: percentile(sorted, 90),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    count: sorted.length,
  };
}

function percentile(arr: number[], p: number) {
  const index = (p / 100) * (arr.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  
  if (lower === upper) {
    return arr[lower];
  }
  
  return arr[lower] + (arr[upper] - arr[lower]) * (index - lower);
}