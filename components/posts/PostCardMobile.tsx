'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import CategoryBadge from '@/components/shared/CategoryBadge';
import type { WPPost } from '@/types/wordpress';

interface PostCardMobileProps {
  post: WPPost;
  priority?: boolean;
}

export default function PostCardMobile({ post, priority = false }: PostCardMobileProps) {
  const readTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));

  return (
    <div className="group">
      <Link href={`/post/${post.slug}`} className="block">
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all">
          {/* Image */}
          {post.featuredImage && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
                priority={priority}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* Categories */}
              <div className="absolute top-3 left-3 flex gap-2">
                {post.categories.slice(0, 2).map(category => (
                  <CategoryBadge
                    key={`mobile-${post.id}-cat-${category.id}`}
                    category={category}
                    small
                  />
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {post.categories.slice(0, 2).map(category => (
                  <CategoryBadge
                    key={`mobile-cat-${post.id}-${category.id}`}
                    category={category}
                    small
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                <Clock size={12} />
                <span>{readTime} min</span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2">
              {post.title}
            </h3>
            
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{new Date(post.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </div>
              
              <span>•</span>
              <span>{post.author.name}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}