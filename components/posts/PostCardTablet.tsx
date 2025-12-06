'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, Bookmark } from 'lucide-react';
import CategoryBadge from '@/components/shared/CategoryBadge';
import { storageService } from '@/services/storage';
import type { WPPost } from '@/types/wordpress';

interface PostCardTabletProps {
  post: WPPost;
  priority?: boolean;
}

export default function PostCardTablet({ post, priority = false }: PostCardTabletProps) {
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
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            {post.featuredImage && (
              <div className="md:w-1/3 relative h-48 md:h-auto">
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={priority}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                
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
            <div className="flex-1 p-4 md:p-6">
              <div className="flex gap-2 mb-3">
                {post.categories.slice(0, 2).map((category, index) => (
                  <CategoryBadge
                    key={getCategoryKey(category, index)}
                    category={category}
                    small
                  />
                ))}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-3 line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {post.excerpt.replace(/<[^>]*>/g, '')}
              </p>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>{post.author.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{new Date(post.date).toLocaleDateString('en-US', {
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
        </div>
      </Link>
    </div>
  );
}