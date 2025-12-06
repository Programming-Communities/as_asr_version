'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useDeviceType } from '@/hooks/useDeviceType';

export default function AdStickyRail() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const device = useDeviceType();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || device === 'mobile') return null;

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-64 z-40">
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition"
          aria-label="Close sticky ad"
        >
          <X size={12} />
        </button>

        {/* Ad label */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Sponsored · Sticky
        </div>

        {/* Ad content */}
        <div className={`relative h-96 ${!isLoaded ? 'bg-gray-100 dark:bg-gray-800 animate-pulse rounded' : ''}`}>
          {isLoaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded">
              <div className="text-3xl mb-4">🎯</div>
              <h4 className="font-bold text-gray-900 dark:text-white text-center mb-2">
                Sticky Sidebar Ad
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                Perfect for desktop engagement
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                Scrolls with you • 300x600
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Privacy notice */}
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 text-center">
          This ad is sticky and follows your scroll
        </p>
      </div>
    </div>
  );
}
