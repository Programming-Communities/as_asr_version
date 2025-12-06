'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, Bookmark } from 'lucide-react';
import CategoryBadge from '@/components/shared/CategoryBadge';
import { storageService } from '@/services/storage';
import type { WPPost } from '@/types/wordpress';

interface PostCardDesktopProps {
  post: WPPost;
  priority?: boolean;
}

export default function PostCardDesktop({ post, priority = false }: PostCardDesktopProps) {
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (storageService.isBookmarked(post.id)) {
      storageService.removeBookmark(post.id);
    } else {
      storageService.saveBookmark(post.id, {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        date: post.date,
      });
    }
  };

  const isBookmarked = storageService.isBookmarked(post.id);
  const readTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));

  // Helper function to generate safe keys
  const getCategoryKey = (category: any, index: number) => {
    // Check if category.id exists and is a valid number
    const categoryId = category?.id;
    const categoryName = category?.name || `category-${index}`;
    
    if (categoryId !== undefined && categoryId !== null && !isNaN(categoryId)) {
      return `${post.id}-category-${categoryId}`;
    }
    
    // Fallback to name or index if id is invalid
    return `${post.id}-category-${categoryName}-${index}`;
  };

  return (
    <div className="group">
      <Link href={`/post/${post.slug}`} className="block">
        <div className="flex gap-6 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300">
          {/* Image */}
          {post.featuredImage && (
            <div className="relative w-64 h-48 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 256px) 100vw, 256px"
                priority={priority}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Category badges - FIXED: Added index parameter */}
              <div className="absolute top-3 left-3 flex gap-2">
                {post.categories.slice(0, 2).map((category, index) => (
                  <CategoryBadge
                    key={getCategoryKey(category, index)}
                    category={category}
                    small
                  />
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                {/* Categories - FIXED: Added index parameter */}
                <div className="flex gap-2 mb-2">
                  {post.categories.slice(0, 2).map((category, index) => (
                    <CategoryBadge
                      key={getCategoryKey(category, index)}
                      category={category}
                      small
                    />
                  ))}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-2 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {post.excerpt.replace(/<[^>]*>/g, '')}
                </p>
              </div>
              
              {/* Bookmark button */}
              <button
                onClick={handleBookmark}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition self-start"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                <Bookmark
                  size={20}
                  className={isBookmarked 
                    ? 'fill-blue-500 text-blue-500' 
                    : 'text-gray-400 hover:text-blue-500'
                  }
                />
              </button>
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>{post.author.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}