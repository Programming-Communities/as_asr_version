'use client';

import { useDeviceType } from '@/hooks/useDeviceType';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton';
import type { WPPost } from '@/types/wordpress';

interface PostGridProps {
  posts: WPPost[];
  variant?: 'auto' | 'mobile' | 'tablet' | 'desktop';
  loading?: boolean;
  className?: string;
}

export default function PostGrid({ 
  posts, 
  variant = 'auto',
  loading = false,
  className = ''
}: PostGridProps) {
  const deviceType = useDeviceType();
  const displayVariant = variant === 'auto' ? deviceType : variant;

  // Grid configuration based on device
  const gridConfig = {
    mobile: 'space-y-4',
    tablet: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    desktop: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
  };

  // Skeleton count based on device
  const skeletonConfig = {
    mobile: 3,
    tablet: 4,
    desktop: 6,
  };

  if (loading) {
    return (
      <div className={gridConfig[displayVariant]}>
        {Array.from({ length: skeletonConfig[displayVariant] }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No articles found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Check back soon for new content.
        </p>
      </div>
    );
  }

  return (
    <div className={`${gridConfig[displayVariant]} ${className}`}>
      {posts.map((post, index) => (
        <div key={`post-${post.id}-${index}`} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <PostCard 
            post={post} 
            variant={displayVariant}
            priority={index < 3}
          />
        </div>
      ))}
    </div>
  );
}