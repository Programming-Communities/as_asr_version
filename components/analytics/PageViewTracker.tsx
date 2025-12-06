'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view when route changes
    const trackPageView = async () => {
      try {
        // You can implement your analytics tracking here
        // For example, send to Google Analytics, custom API, etc.
        
        const fullUrl = `${window.location.origin}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        
        // Send to your analytics endpoint
        await fetch('/api/analytics/pageview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: fullUrl,
            path: pathname,
            query: searchParams.toString(),
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        });
        
        // Update localStorage for basic visitor counting
        const today = new Date().toDateString();
        const dailyViews = JSON.parse(localStorage.getItem('daily_views') || '{}');
        dailyViews[today] = (dailyViews[today] || 0) + 1;
        localStorage.setItem('daily_views', JSON.stringify(dailyViews));
        
        // Update total views
        const totalViews = parseInt(localStorage.getItem('total_views') || '0') + 1;
        localStorage.setItem('total_views', totalViews.toString());
        
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    if (pathname) {
      trackPageView();
    }
  }, [pathname, searchParams]);

  return null;
}