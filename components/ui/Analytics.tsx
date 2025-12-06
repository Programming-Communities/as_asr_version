'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { storageService } from '@/services/storage';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check cookie consent
    const cookiePreferences = storageService.getCookiePreferences();
    const allowAnalytics = cookiePreferences?.analytics !== false;

    if (!allowAnalytics) {
      return;
    }

    // Page view tracking
    const url = `${pathname}${searchParams ? `?${searchParams}` : ''}`;
    
    // Google Analytics (if enabled)
    if (typeof window.gtag !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
      window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
        page_path: url,
      });
    }

    // Custom event: page_view
    trackEvent('page_view', {
      page_path: url,
      page_title: document.title,
    });

    // Performance monitoring
    if ('performance' in window) {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        trackEvent('performance', {
          dns: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
          tcp: navigationTiming.connectEnd - navigationTiming.connectStart,
          ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
          dom_load: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
          window_load: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
        });
      }
    }

  }, [pathname, searchParams]);

  const trackEvent = (name: string, params?: Record<string, any>) => {
    console.log(`[Analytics] ${name}:`, params);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, params);
    }
  };

  return null;
}
