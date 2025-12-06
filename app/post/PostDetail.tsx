'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Clock, User, Calendar, Eye } from 'lucide-react';
import { storageService } from '@/services/storage';
import ReactionBar from '@/components/reactions/ReactionBar';
import ShareButtons from '@/components/ui/ShareButtons';
import type { WPPost } from '@/types/wordpress';

interface PostDetailProps {
  post: WPPost;
}

export default function PostDetail({ post }: PostDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readTime, setReadTime] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Set current URL
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }

    // Check if post is bookmarked
    setIsBookmarked(storageService.isBookmarked(post.id));

    // Calculate read time
    const wordCount = post.content.split(/\s+/).length;
    setReadTime(Math.max(1, Math.ceil(wordCount / 200)));
    
    // Add to reading history
    storageService.addToHistory(post.id, {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      date: post.date,
    });
  }, [post]);

  const handleBookmark = () => {
    if (isBookmarked) {
      storageService.removeBookmark(post.id);
    } else {
      storageService.saveBookmark(post.id, {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        date: post.date,
      });
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map(category => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition"
            >
              {category.name}
            </a>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{post.author.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{readTime} min read</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye size={16} />
            <span>2.5k views</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBookmark}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Bookmark
              size={18}
              className={isBookmarked 
                ? 'fill-blue-500 text-blue-500' 
                : 'text-gray-600 dark:text-gray-400'
              }
            />
            <span className="text-sm font-medium">
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
          </button>

          <ShareButtons
            title={post.title}
            url={currentUrl}
            excerpt={post.excerpt}
          />
        </div>
      </header>

      {/* Featured image */}
      {post.featuredImage && (
        <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <a
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm"
              >
                #{tag.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Reactions */}
      <div className="mb-8">
        <ReactionBar postId={post.id} />
      </div>

      {/* Author bio */}
      {post.author && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {post.author.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{post.author.name}</h3>
              {post.author.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {post.author.description}
                </p>
              )}
              <a
                href={`/author/${post.author.id}`}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                View all articles by {post.author.name} →
              </a>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}