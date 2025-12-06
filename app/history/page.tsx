'use client';

import { useState, useEffect } from 'react';
import { History as HistoryIcon, Clock } from 'lucide-react';
import Link from 'next/link';
import { storageService } from '@/services/storage';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const readingHistory = storageService.getHistory();
    // Sort by most recent first
    const sortedHistory = [...readingHistory].sort((a, b) => 
      new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime()
    );
    setHistory(sortedHistory);
    setLoading(false);
  }, []);

  const clearHistory = () => {
    // Clear history by removing the key from localStorage
    localStorage.removeItem('reading-history');
    setHistory([]);
  };

  const removeFromHistory = (id: number) => {
    const currentHistory = storageService.getHistory();
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    localStorage.setItem('reading-history', JSON.stringify(updatedHistory));
    
    // Update state
    const sortedHistory = [...updatedHistory].sort((a, b) => 
      new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime()
    );
    setHistory(sortedHistory);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
          <HistoryIcon className="mr-2" size={16} />
          Reading History
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Recently Viewed</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Articles you've recently read
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
      ) : history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    href={`/post/${item.slug}`}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.excerpt}
                    </p>
                  </Link>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Last read: {new Date(item.lastRead).toLocaleDateString()}
                    </span>
                    <span>Viewed: {item.viewCount || 1} time{item.viewCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromHistory(item.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 transition"
                  aria-label="Remove from history"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
          <Clock className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No reading history
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            Your reading history will appear here as you browse and read articles.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Start Reading
          </Link>
        </div>
      )}
    </div>
  );
}