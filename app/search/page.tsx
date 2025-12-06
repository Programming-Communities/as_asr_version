'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X, Calendar, User, Hash } from 'lucide-react';
import PostCard from '@/components/posts/PostCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import type { WPPost, WPCategory } from '@/types/wordpress';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<WPPost[]>([]);
  const [filteredResults, setFilteredResults] = useState<WPPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    author: '',
    date: '',
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);

  useEffect(() => {
    if (query) {
      performSearch();
    } else {
      setResults([]);
      setFilteredResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        // Create proper WPCategory objects with count
        const mockCategories: WPCategory[] = [
          { id: 1, name: 'Quran', slug: 'quran', count: 10 },
          { id: 2, name: 'Hadith', slug: 'hadith', count: 8 },
          { id: 3, name: 'Fiqh', slug: 'fiqh', count: 12 },
          { id: 4, name: 'History', slug: 'history', count: 15 },
        ];

        // Create proper WPPost objects with complete categories
        const mockResults: WPPost[] = Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          date: new Date(Date.now() - i * 86400000).toISOString(),
          modified: new Date().toISOString(),
          slug: `search-result-${i + 1}`,
          title: `Search Result: ${query} - ${['Quran', 'Hadith', 'Fiqh', 'History'][i % 4]} Article ${i + 1}`,
          content: `This is a search result for "${query}". It contains relevant content about the topic you're searching for.`,
          excerpt: `Search result excerpt for "${query}". This would be the actual excerpt from the article.`,
          featuredImage: i % 3 === 0 ? 'https://via.placeholder.com/600x400' : null,
          featuredImageAlt: `Image for search result ${i + 1}`,
          categories: [
            mockCategories[i % 4] // Use proper WPCategory objects
          ],
          tags: [],
          author: {
            id: (i % 5 + 1).toString(),
            name: ['Ahmed Khan', 'Sarah Ali', 'Dr. Muhammad', 'Fatima Hassan', 'Omar Ahmed'][i % 5],
            avatar: `https://via.placeholder.com/96`,
            description: '',
          },
          acf: {},
        }));

        setResults(mockResults);
        setFilteredResults(mockResults);
        
        // Extract filters
        const uniqueCategories = Array.from(new Set(mockResults.map(r => 
          r.categories[0]?.name || 'Uncategorized'
        )));
        setCategories(uniqueCategories);

        const uniqueAuthors = Array.from(new Set(mockResults.map(r => 
          r.author.name || 'Unknown'
        )));
        setAuthors(uniqueAuthors);
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Search error:', error);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...results];
    
    if (activeFilters.category) {
      filtered = filtered.filter(post => 
        post.categories.some(cat => cat.name === activeFilters.category)
      );
    }
    
    if (activeFilters.author) {
      filtered = filtered.filter(post => 
        post.author.name === activeFilters.author
      );
    }
    
    if (activeFilters.date === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(post => new Date(post.date) > weekAgo);
    } else if (activeFilters.date === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(post => new Date(post.date) > monthAgo);
    }
    
    setFilteredResults(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [activeFilters, results]);

  const clearFilters = () => {
    setActiveFilters({ category: '', author: '', date: '' });
  };

  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Search Results
        </h1>
        
        {query && (
          <div className="flex items-center space-x-2 text-lg text-gray-600 dark:text-gray-400">
            <Search size={20} />
            <span>for</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">"{query}"</span>
            <span className="text-gray-500">•</span>
            <span>{filteredResults.length} results</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center space-x-2">
                  <Filter size={20} />
                  <span>Filters</span>
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
                  >
                    <X size={14} />
                    <span>Clear all</span>
                  </button>
                )}
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <Hash size={16} />
                  <span>Category</span>
                </h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveFilters(prev => ({
                        ...prev,
                        category: prev.category === category ? '' : category
                      }))}
                      className={`flex items-center justify-between w-full p-2 rounded-lg transition ${
                        activeFilters.category === category
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{category}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {results.filter(r => 
                          r.categories.some(cat => cat.name === category)
                        ).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Author filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <User size={16} />
                  <span>Author</span>
                </h4>
                <div className="space-y-2">
                  {authors.map((author) => (
                    <button
                      key={author}
                      onClick={() => setActiveFilters(prev => ({
                        ...prev,
                        author: prev.author === author ? '' : author
                      }))}
                      className={`flex items-center justify-between w-full p-2 rounded-lg transition ${
                        activeFilters.author === author
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="truncate">{author}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {results.filter(r => 
                          r.author.name === author
                        ).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date filter */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Date</span>
                </h4>
                <div className="space-y-2">
                  {[
                    { value: '', label: 'All time' },
                    { value: 'week', label: 'Past week' },
                    { value: 'month', label: 'Past month' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setActiveFilters(prev => ({
                        ...prev,
                        date: prev.date === option.value ? '' : option.value
                      }))}
                      className={`w-full p-2 text-left rounded-lg transition ${
                        activeFilters.date === option.value
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <SkeletonLoader type="card" count={6} />
          ) : filteredResults.length > 0 ? (
            <div className="space-y-6">
              {filteredResults.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  priority={index < 3}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Search className="text-gray-400 dark:text-gray-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                We couldn't find any articles matching "{query}". Try different keywords or check your spelling.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoader type="card" count={6} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}