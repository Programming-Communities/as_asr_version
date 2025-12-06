import { notFound } from 'next/navigation';
import PostDetail from '@/components/posts/PostDetail';
import CommentSection from '@/components/comments/CommentSection';
import RelatedPosts from '@/components/posts/RelatedPosts';
import AdWrapper from '@/components/ads/AdWrapper';
import wordpressService from '@/services/wordpress';
import type { WPPost } from '@/types/wordpress';

interface PostPageProps {
  params: Promise<{ // Add Promise wrapper
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params; // Await the params
  const post = await wordpressService.fetchPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    };
  }

  return {
    title: post.title,
    description: post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
      images: post.featuredImage ? [{
        url: post.featuredImage,
        alt: post.featuredImageAlt,
      }] : [],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params; // Await the params
  const post = await wordpressService.fetchPost(slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-8">
          <PostDetail post={post} />
          
          {/* In-article ad */}
          <div className="my-8">
            <AdWrapper slot="inArticle" format="horizontal" />
          </div>

          <CommentSection postId={post.id} />

          <RelatedPosts postId={post.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Author info */}
          {post.author && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {post.author.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Author
                  </p>
                </div>
              </div>
              {post.author.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {post.author.description}
                </p>
              )}
              <a
                href={`/author/${post.author.id}`}
                className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                View all articles →
              </a>
            </div>
          )}

          {/* Table of contents */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
              📋 Table of Contents
            </h4>
            <div className="space-y-2">
              {['Introduction', 'Main Points', 'Analysis', 'Conclusion', 'References'].map((item, i) => (
                <a
                  key={i}
                  href={`#section-${i + 1}`}
                  className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <span className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  <span className="text-sm">{item}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Share box */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
              📢 Share This Article
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Help others discover this content
            </p>
            <div className="grid grid-cols-3 gap-2">
              {['Facebook', 'Twitter', 'LinkedIn', 'WhatsApp', 'Email', 'Copy'].map((platform) => (
                <button
                  key={platform}
                  className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm"
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Ad */}
          <AdWrapper slot="sidebar" format="vertical" />
        </div>
      </div>
    </div>
  );
}