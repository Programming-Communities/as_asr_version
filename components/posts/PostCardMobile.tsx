'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, Bookmark } from 'lucide-react';
import CategoryBadge from '@/components/shared/CategoryBadge';
import { storageService } from '@/services/storage';
import type { WPPost } from '@/types/wordpress';

interface PostCardMobileProps {
  post: WPPost;
  priority?: boolean;
}

export default function PostCardMobile({ post, priority = false }: PostCardMobileProps) {
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

  // Helper function for category keys
  const getCategoryKey = (category: any, index: number) => {
    const categoryId = category?.id;
    const categoryName = category?.name || `category-${index}`;
    
    if (categoryId !== undefined && categoryId !== null && !isNaN(categoryId)) {
      return `${post.id}-category-${categoryId}`;
    }
    
    return `${post.id}-category-${categoryName}-${index}`;
  };

  return (
    <div className="group">
      <Link href={`/post/${post.slug}`} className="block">
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300">
          {/* Image */}
          {post.featuredImage && (
            <div className="relative w-full h-48">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={priority}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Category badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {post.categories.slice(0, 2).map((category, index) => (
                  <CategoryBadge
                    key={getCategoryKey(category, index)}
                    category={category}
                    small
                  />
                ))}
              </div>

              {/* Bookmark button */}
              <button
                onClick={handleBookmark}
                className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                <Bookmark
                  size={18}
                  className={isBookmarked 
                    ? 'fill-blue-500 text-blue-500' 
                    : 'text-gray-400 hover:text-blue-500'
                  }
                />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            <div className="flex gap-2 mb-2">
              {post.categories.slice(0, 2).map((category, index) => (
                <CategoryBadge
                  key={getCategoryKey(category, index)}
                  category={category}
                  small
                />
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-2 line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 text-sm">
              {post.excerpt.replace(/<[^>]*>/g, '')}
            </p>

            {/* Meta info */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>{post.author.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{readTime} min</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}