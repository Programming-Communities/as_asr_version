'use client';

import { storageService } from './storage';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

interface PageView {
  path: string;
  title: string;
  timestamp: number;
}

export class AnalyticsService {
  private isEnabled(): boolean {
    const preferences = storageService.getCookiePreferences();
    return preferences?.analytics === true;
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled() || !window.gtag) return;

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }

  trackPageView(pageView: PageView): void {
    if (!this.isEnabled() || !window.gtag) return;

    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '', {
      page_path: pageView.path,
      page_title: pageView.title,
    });
  }

  trackReaction(postId: number, reaction: string): void {
    this.trackEvent({
      category: 'Reaction',
      action: 'react',
      label: `Post ${postId}`,
      value: 1,
    });
  }

  trackComment(postId: number): void {
    this.trackEvent({
      category: 'Comment',
      action: 'comment',
      label: `Post ${postId}`,
      value: 1,
    });
  }

  trackShare(platform: string, postId: number): void {
    this.trackEvent({
      category: 'Share',
      action: 'share',
      label: `${platform} - Post ${postId}`,
      value: 1,
    });
  }

  trackSearch(query: string): void {
    this.trackEvent({
      category: 'Search',
      action: 'search',
      label: query,
      value: 1,
    });
  }

  trackPerformance(metric: {
    name: string;
    value: number;
    rating?: 'good' | 'needs-improvement' | 'poor';
  }): void {
    if (!this.isEnabled()) return;

    this.trackEvent({
      category: 'Performance',
      action: metric.name,
      label: metric.rating,
      value: Math.round(metric.value),
    });
  }

  trackScroll(depth: number): void {
    if (!this.isEnabled()) return;

    this.trackEvent({
      category: 'Engagement',
      action: 'scroll',
      label: `Scroll Depth: ${depth}%`,
      value: depth,
    });
  }

  trackTimeOnPage(duration: number): void {
    if (!this.isEnabled()) return;

    this.trackEvent({
      category: 'Engagement',
      action: 'time_on_page',
      label: `Duration: ${Math.round(duration / 1000)}s`,
      value: duration,
    });
  }
}

export const analyticsService = new AnalyticsService();

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}