'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { AdProps } from '@/types/components';
import { adsConfig } from '@/config/site';

export default function AdDesktop({ slot, format = 'auto', className = '' }: AdProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate ad loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const config = adsConfig.desktop[slot as keyof typeof adsConfig.desktop] || adsConfig.desktop.sidebar;

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
          <>
            {/* Mock ad content - Replace with actual ad code */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
              <div className="text-center p-4">
                <div className="text-2xl mb-2">📢</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Sponsored Content
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Desktop Ad - {slot}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {format === 'vertical' ? '300x600' : '728x90'}
                </p>
              </div>
            </div>

            {/* Actual ad would be loaded here */}
            {/* <script async src={`https://adserver.com/${slot}`} /> */}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Privacy notice */}
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center">
        Your privacy is important. Ads help us run this site.
      </p>
    </div>
  );
}
