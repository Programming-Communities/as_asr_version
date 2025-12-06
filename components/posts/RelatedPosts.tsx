'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';
import PostCard from './PostCard';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import type { WPPost, WPCategory } from '@/types/wordpress';

interface RelatedPostsProps {
  postId: number;
}

export default function RelatedPosts({ postId }: RelatedPostsProps) {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching related posts
    const timer = setTimeout(() => {
      // Create proper WPCategory objects with count
      const mockCategories: WPCategory[] = [
        { id: 1, name: 'Quran', slug: 'quran', count: 10 },
        { id: 2, name: 'Education', slug: 'education', count: 8 },
      ];

      const mockPosts: WPPost[] = Array.from({ length: 4 }, (_, i) => ({
        id: postId + i + 1,
        date: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
        modified: new Date().toISOString(),
        slug: `related-post-${i + 1}`,
        title: `Related Article ${i + 1}: Similar Insights and Analysis`,
        content: `<p>This is a related article that provides additional context and insights on similar topics.</p>`,
        excerpt: `Discover more about this topic through related content and analysis.`,
        featuredImage: i % 2 === 0 ? 'https://via.placeholder.com/600x400' : null,
        featuredImageAlt: `Related article image ${i + 1}`,
        categories: mockCategories, // Use proper WPCategory objects
        tags: [],
        author: {
          id: '1',
          name: 'Author Name',
          avatar: 'https://via.placeholder.com/96',
          description: '',
        },
        acf: {},
      }));

      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [postId]);

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <TrendingUp className="text-orange-600 dark:text-orange-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Related Articles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Continue reading with these related posts
            </p>
          </div>
        </div>
        <a
          href="/blog"
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <span className="font-medium">View all</span>
          <ArrowRight size={18} />
        </a>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoader type="card" count={2} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}

      {/* Reading time summary */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-3">
          <Clock className="text-blue-600 dark:text-blue-400" size={20} />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">Reading time:</span> Approximately 20 minutes for all related articles
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 opacity-80">
              Based on average reading speed of 200 words per minute
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}