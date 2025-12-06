'use client';

import { useState, useEffect } from 'react';
import { Bookmark as BookmarkIcon, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { storageService } from '@/services/storage';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedBookmarks = storageService.getBookmarks();
    const bookmarkArray = Object.values(savedBookmarks);
    setBookmarks(bookmarkArray);
    setLoading(false);
  }, []);

  const removeBookmark = (id: number) => {
    storageService.removeBookmark(id);
    const savedBookmarks = storageService.getBookmarks();
    setBookmarks(Object.values(savedBookmarks));
  };

  const clearAllBookmarks = () => {
    Object.keys(storageService.getBookmarks()).forEach(id => {
      storageService.removeBookmark(parseInt(id));
    });
    setBookmarks([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
          <BookmarkIcon className="mr-2" size={16} />
          Bookmarks
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Saved Articles</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your bookmarked articles for easy access
            </p>
          </div>
          {bookmarks.length > 0 && (
            <button
              onClick={clearAllBookmarks}
              className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    href={`/post/${bookmark.slug}`}
                    className="block group"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                      {bookmark.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {bookmark.excerpt}
                    </p>
                  </Link>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>{new Date(bookmark.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeBookmark(bookmark.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 transition"
                  aria-label="Remove bookmark"
                >
                  <BookmarkIcon className="fill-red-500 text-red-500" size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No bookmarks yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            When you bookmark articles using the bookmark icon, they will appear here for easy access.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse Articles
          </Link>
        </div>
      )}
    </div>
  );
}