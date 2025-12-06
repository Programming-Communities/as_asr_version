'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { storageService } from '@/services/storage';

interface SearchResult {
  id: number;
  title: string;
  type: 'post' | 'category' | 'author';
  slug: string;
  excerpt?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    const searches = storageService.getLocal<string[]>('recent_searches', []);
    setRecentSearches(searches.slice(0, 5));
    
    // Mock trending searches
    setTrending(['Quran', 'Hadith', 'Fiqh', 'History', 'Spirituality']);
  }, []);

  // Handle search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimer = setTimeout(() => {
      setIsLoading(true);
      try {
        // Mock search with proper SearchResult types using 'as const'
        const mockResults = [
          {
            id: 1,
            title: 'Understanding Quranic Verses',
            type: 'post' as const,
            slug: 'understanding-quranic-verses',
            excerpt: 'Deep dive into the meanings and interpretations...',
          },
          {
            id: 2,
            title: 'Quran Studies',
            type: 'category' as const,
            slug: 'quran',
          },
          {
            id: 3,
            title: 'Dr. Ahmed Ali',
            type: 'author' as const,
            slug: 'ahmed-ali',
          },
        ].filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.excerpt && item.excerpt.toLowerCase().includes(query.toLowerCase()))
        );

        setResults(mockResults.slice(0, 5));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const searches = storageService.getLocal<string[]>('recent_searches', []);
    const updatedSearches = [searchQuery, ...searches.filter(s => s !== searchQuery)].slice(0, 10);
    storageService.setLocal('recent_searches', updatedSearches);
    setRecentSearches(updatedSearches.slice(0, 5));

    // Navigate to search page
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleClearRecent = () => {
    storageService.removeLocal('recent_searches');
    setRecentSearches([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Search button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
        aria-label="Search"
      >
        <Search size={20} />
      </button>

      {/* Search overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Search panel */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl mx-4">
              {/* Search input */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search articles, categories, authors..."
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                    autoFocus
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label="Clear"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* Recent searches */}
                {!query && recentSearches.length > 0 && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-gray-400" />
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Recent Searches
                        </h4>
                      </div>
                      <button
                        onClick={handleClearRecent}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search);
                            handleSearch(search);
                          }}
                          className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        >
                          <div className="flex items-center space-x-3">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">{search}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = recentSearches.filter((_, i) => i !== index);
                              storageService.setLocal('recent_searches', updated);
                              setRecentSearches(updated);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          >
                            <X size={12} />
                          </button>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending searches */}
                {!query && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp size={16} className="text-gray-400" />
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Trending Now
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(tag);
                            handleSearch(tag);
                          }}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                          <Hash size={12} />
                          <span className="text-sm">{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search results */}
                {query && (
                  <div className="p-4">
                    {isLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                          </div>
                        ))}
                      </div>
                    ) : results.length > 0 ? (
                      <div className="space-y-3">
                        {results.map((result) => (
                          <a
                            key={result.id}
                            href={`/${result.type === 'post' ? 'post' : result.type}/${result.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition group"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded ${
                                result.type === 'post' 
                                  ? 'bg-blue-100 dark:bg-blue-900' 
                                  : result.type === 'category'
                                  ? 'bg-green-100 dark:bg-green-900'
                                  : 'bg-purple-100 dark:bg-purple-900'
                              }`}>
                                <span className={`text-xs font-medium ${
                                  result.type === 'post'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : result.type === 'category'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-purple-600 dark:text-purple-400'
                                }`}>
                                  {result.type.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                                  {result.title}
                                </h5>
                                {result.excerpt && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {result.excerpt}
                                  </p>
                                )}
                                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 capitalize">
                                  {result.type}
                                </span>
                              </div>
                            </div>
                          </a>
                        ))}
                        <button
                          onClick={() => handleSearch()}
                          className="w-full p-3 text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 transition"
                        >
                          View all results for "{query}"
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                          <Search className="text-gray-400 dark:text-gray-600" size={24} />
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          No results found
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Try different keywords or check spelling
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                  <div className="flex items-center space-x-4">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
                      ↑↓
                    </kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
                      Enter
                    </kbd>
                    <span>Search</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
                      Esc
                    </kbd>
                    <span>Close</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}