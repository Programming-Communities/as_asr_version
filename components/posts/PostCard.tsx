'use client';

import { useDeviceType } from '@/hooks/useDeviceType';
import PostCardDesktop from './PostCardDesktop';
import PostCardTablet from './PostCardTablet';
import PostCardMobile from './PostCardMobile';
import PostCardSkeleton from './PostCardSkeleton';
import type { WPPost } from '@/types/wordpress';

interface PostCardProps {
  post: WPPost;
  variant?: 'auto' | 'mobile' | 'tablet' | 'desktop';
  priority?: boolean;
}

export default function PostCard({ 
  post, 
  variant = 'auto', 
  priority = false 
}: PostCardProps) {
  const deviceType = useDeviceType();
  
  if (variant === 'auto') {
    switch (deviceType) {
      case 'mobile':
        return <PostCardMobile post={post} priority={priority} />;
      case 'tablet':
        return <PostCardTablet post={post} priority={priority} />;
      case 'desktop':
        return <PostCardDesktop post={post} priority={priority} />;
      default:
        return <PostCardDesktop post={post} priority={priority} />;
    }
  }

  switch (variant) {
    case 'mobile':
      return <PostCardMobile post={post} priority={priority} />;
    case 'tablet':
      return <PostCardTablet post={post} priority={priority} />;
    case 'desktop':
      return <PostCardDesktop post={post} priority={priority} />;
    default:
      return <PostCardDesktop post={post} priority={priority} />;
  }
}

// Export skeleton loader for convenience
export { PostCardSkeleton };