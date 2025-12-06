interface AnalyticsData {
  dailyViews: Record<string, number>;
  postViews: Record<number, number>;
  lastUpdated: string;
}

class AnalyticsService {
  private localStorageKey = 'site_analytics';
  
  // Track page view
  trackPageView(postId?: number) {
    if (typeof window === 'undefined') return;
    
    const today = new Date().toDateString();
    const analytics = this.getAnalytics();
    
    // Update daily count
    if (!analytics.dailyViews[today]) {
      analytics.dailyViews[today] = 0;
    }
    analytics.dailyViews[today]++;
    
    // Track popular posts
    if (postId) {
      if (!analytics.postViews[postId]) {
        analytics.postViews[postId] = 0;
      }
      analytics.postViews[postId]++;
    }
    
    this.saveAnalytics(analytics);
  }
  
  // Get real daily readers
  getDailyReaders(): number {
    const analytics = this.getAnalytics();
    const today = new Date().toDateString();
    return analytics.dailyViews[today] || 0;
  }
  
  // Get monthly average - FIXED TypeScript error
  getMonthlyAverage(): number {
    const analytics = this.getAnalytics();
    const dailyViews = Object.values(analytics.dailyViews);
    
    if (dailyViews.length === 0) return 0;
    
    // Fixed: Added proper types to reduce function
    const sum = dailyViews.reduce((a: number, b: number) => a + b, 0);
    return Math.round(sum / Math.min(dailyViews.length, 30));
  }
  
  // Get popular posts - FIXED TypeScript error
  getPopularPosts(limit: number = 5): Array<{id: number, views: number}> {
    const analytics = this.getAnalytics();
    
    // Convert object entries to array with proper types
    const posts = Object.entries(analytics.postViews)
      .map(([id, views]) => ({ 
        id: parseInt(id), 
        views: views as number  // Type assertion
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
    
    return posts;
  }
  
  private getAnalytics(): AnalyticsData {
    if (typeof window === 'undefined') {
      return {
        dailyViews: {},
        postViews: {},
        lastUpdated: new Date().toISOString(),
      };
    }
    
    const stored = localStorage.getItem(this.localStorageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      dailyViews: {},
      postViews: {},
      lastUpdated: new Date().toISOString(),
    };
  }
  
  private saveAnalytics(data: AnalyticsData) {
    if (typeof window === 'undefined') return;
    
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }
}

export const analyticsService = new AnalyticsService();