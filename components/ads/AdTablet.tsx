'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { AdProps } from '@/types/components';
import { adsConfig } from '@/config/site';

export default function AdTablet({ slot, format = 'auto', className = '' }: AdProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const config = adsConfig.tablet[slot as keyof typeof adsConfig.tablet] || adsConfig.tablet.sidebar;

  if (!isVisible) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Ad label */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>Advertisement</span>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          aria-label="Close ad"
        >
          <X size={12} />
        </button>
      </div>

      {/* Ad container */}
      <div className={`
        relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800
        ${format === 'vertical' ? 'aspect-vertical' : 'aspect-horizontal'}
        ${!isLoaded ? 'bg-gray-100 dark:bg-gray-900 animate-pulse' : ''}
      `}>
        {isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Tablet Ad
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Optimized for tablet - {slot}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {format === 'vertical' ? '300x250' : '468x60'}
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
