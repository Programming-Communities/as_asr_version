'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { AdProps } from '@/types/components';
import { adsConfig } from '@/config/site';

export default function AdMobile({ slot, format = 'auto', className = '' }: AdProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const config = adsConfig.mobile[slot as keyof typeof adsConfig.mobile] || adsConfig.mobile.inArticle;

  if (!isVisible) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Ad label */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>Ad</span>
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
        ${format === 'rectangle' ? 'aspect-horizontal' : 'aspect-[320/50]'}
        ${!isLoaded ? 'bg-gray-100 dark:bg-gray-900 animate-pulse' : ''}
      `}>
        {isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
            <div className="text-center p-3">
              <div className="text-xl mb-1">📲</div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                Mobile Ad
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {slot} - Mobile optimized
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
