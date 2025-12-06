'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock } from 'lucide-react';
import CategoryBadge from '@/components/shared/CategoryBadge';
import type { WPPost } from '@/types/wordpress';

interface PostCardTabletProps {
  post: WPPost;
  priority?: boolean;
}

export default function PostCardTablet({ post, priority = false }: PostCardTabletProps) {
  const readTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));

  return (
    <div className="group">
      <Link href={`/post/${post.slug}`} className="block">
        <div className="flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all">
          {/* Image */}
          {post.featuredImage && (
            <div className="relative w-40 h-32 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 160px) 100vw, 160px"
                priority={priority}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                {/* Categories */}
                <div className="flex gap-2 mb-2">
                  {post.categories.slice(0, 2).map(category => (
                    <CategoryBadge
                      key={`tablet-${post.id}-cat-${category.id}`}
                      category={category}
                      small
                    />
                  ))}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-2 line-clamp-2">
                  {post.title}
                </h3>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <User size={12} />
                <span className="truncate">{post.author.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{new Date(post.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</span>
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