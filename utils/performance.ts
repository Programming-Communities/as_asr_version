/**
 * Performance monitoring and optimization utilities
 */

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

interface PerformanceEntryExtended extends PerformanceEntry {
  processingStart?: number;
  hadRecentInput?: boolean;
  value?: number;
  startTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private startTime: number = Date.now();

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupPerformanceObservers();
      this.captureInitialMetrics();
    }
  }

  private setupPerformanceObservers() {
    // Observe Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        // LCP Observer
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // FID Observer
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries() as PerformanceEntryExtended[];
          entries.forEach(entry => {
            if (entry.entryType === 'first-input' && entry.processingStart) {
              this.metrics.fid = entry.processingStart - entry.startTime;
            }
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // CLS Observer
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          const entries = entryList.getEntries() as PerformanceEntryExtended[];
          entries.forEach(entry => {
            if (!entry.hadRecentInput && entry.value) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        this.observers.push(lcpObserver, fidObserver, clsObserver);
      } catch (e) {
        console.warn('Performance observers not supported:', e);
      }
    }
  }

  private captureInitialMetrics() {
    if ('performance' in window) {
      const perf = window.performance;
      
      // Capture TTFB
      const navigationTiming = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        this.metrics.ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
      }

      // Capture FCP
      const paintEntries = perf.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public logMetrics() {
    const metrics = this.getMetrics();
    console.group('📊 Performance Metrics');
    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        console.log(`${key.toUpperCase()}: ${value.toFixed(2)}ms`);
      }
    });
    console.groupEnd();
  }

  public reportMetrics(endpoint: string = '/api/performance') {
    const metrics = this.getMetrics();
    
    // Only send if we have meaningful data
    if (Object.keys(metrics).length > 0) {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics,
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
        keepalive: true, // Send even if page is unloading
      }).catch(() => {
        // Silently fail - performance reporting shouldn't affect user experience
      });
    }
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      func(...args);
    }
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Measure function execution time
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  name: string = func.name || 'anonymous'
): (...args: Parameters<T>) => ReturnType<T> {
  return function measuredFunction(...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    
    console.log(`⏱️ ${name} executed in ${(end - start).toFixed(2)}ms`);
    
    return result;
  };
}