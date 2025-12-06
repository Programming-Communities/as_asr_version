'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Clock, User, Calendar, Play } from 'lucide-react';
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
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
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

    // Check if post has video
    if (post.acf?.video_url || post.acf?.featured_video) {
      setShowVideo(true);
    }
  }, [post]);

  // Add this useEffect to highlight active sections and clean up anchors
  useEffect(() => {
    // Clean up section anchors on unmount
    return () => {
      const anchors = document.querySelectorAll('.section-anchor');
      anchors.forEach(anchor => {
        if (anchor.parentNode) {
          anchor.parentNode.removeChild(anchor);
        }
      });
    };
  }, [post.content]);

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

  const videoUrl = post.acf?.video_url || post.acf?.featured_video;

  // Helper function to generate safe keys for categories
  const getCategoryKey = (category: any, index: number) => {
    // Check if category.id exists and is a valid number
    const categoryId = category?.id;
    const categoryName = category?.name || `category-${index}`;
    
    if (categoryId !== undefined && categoryId !== null && !isNaN(categoryId)) {
      return `${categoryId}`;
    }
    
    // Fallback to name or index if id is invalid
    return `${categoryName}-${index}`;
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        {/* Categories - FIXED: Added index parameter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((category, index) => (
            <a
              key={getCategoryKey(category, index)}
              href={`/category/${category.slug}`}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition"
            >
              {category.name}
            </a>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-right">
          {post.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 dark:text-gray-400 mb-6 justify-end">
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
          
          {showVideo && (
            <div className="flex items-center gap-2">
              <Play size={16} />
              <span>Includes video</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 justify-end">
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
            url={typeof window !== 'undefined' ? window.location.href : ''}
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

      {/* Video Player - If post has video */}
      {videoUrl && (
        <div className="mb-8">
          <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-black">
            <iframe
              src={videoUrl}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={post.title}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mb-8" dir="rtl">
        <div 
          className="wp-content text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{
            textAlign: 'right',
            lineHeight: '2',
            fontSize: '1.125rem',
            fontFamily: "'Noto Naskh Arabic', 'Arial', sans-serif"
          }}
        />
      </div>

      {/* Tags - FIXED: Added index parameter */}
      {post.tags.length > 0 && (
        <div className="mb-8 text-right">
          <h3 className="text-lg font-semibold mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2 justify-end">
            {post.tags.map((tag, index) => (
              <a
                key={tag?.id || `tag-${index}`}
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
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-8 text-right">
          <div className="flex items-start gap-4 flex-row-reverse">
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
                ← View all articles by {post.author.name}
              </a>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}