import { notFound } from 'next/navigation';
import PostDetail from '@/components/posts/PostDetail';
import CommentSection from '@/components/comments/CommentSection';
import RelatedPosts from '@/components/posts/RelatedPosts';
import AdWrapper from '@/components/ads/AdWrapper';
import TableOfContents from '@/components/posts/TableOfContents';
import wordpressService from '@/services/wordpress';
import type { WPPost } from '@/types/wordpress';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
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

// Dynamic function to extract headings from ANY post content
function extractHeadingsFromContent(content: string): Array<{id: string, text: string, level: number}> {
  const headings: Array<{id: string, text: string, level: number}> = [];
  
  // Remove script and style tags
  const cleanContent = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                              .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Method 1: Look for HTML headings (h2, h3, h4)
  const htmlHeadingRegex = /<h([2-4])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  let headingIndex = 0;
  
  while ((match = htmlHeadingRegex.exec(cleanContent)) !== null) {
    const level = parseInt(match[1]);
    let text = match[2];
    
    // Remove HTML tags from heading text
    text = text.replace(/<[^>]*>/g, '').trim();
    
    if (text) {
      const id = `section-${headingIndex + 1}`;
      headings.push({ id, text: text.substring(0, 100), level });
      headingIndex++;
    }
  }
  
  // Method 2: If no HTML headings found, look for paragraph breaks that might be sections
  if (headings.length === 0) {
    // Split by paragraph tags or double line breaks
    const paragraphs = cleanContent.split(/<\/p>|<br\s*\/?>\s*<br\s*\/?>|\n\n/);
    
    for (let i = 0; i < Math.min(paragraphs.length, 15); i++) {
      const para = paragraphs[i].trim();
      if (para.length > 50 && para.length < 500) {
        // Check if paragraph might be a section heading
        const text = para.replace(/<[^>]*>/g, '').trim().substring(0, 80);
        
        // Avoid very long paragraphs (likely content, not headings)
        if (text && text.length > 20 && text.length < 150) {
          const id = `section-${headings.length + 1}`;
          headings.push({ id, text, level: 2 });
          
          // Limit to 10 sections maximum
          if (headings.length >= 10) break;
        }
      }
    }
  }
  
  return headings;
}

// Function to add IDs to content WITHOUT modifying structure
function prepareContentForTOC(content: string, headings: Array<{id: string, text: string}>): string {
  if (headings.length === 0) return content;
  
  let modifiedContent = content;
  
  // Add section anchors before each heading/section
  headings.forEach((heading, index) => {
    const id = heading.id;
    const searchText = heading.text.substring(0, 50);
    
    if (searchText) {
      // Create a span anchor near this text
      const anchor = `<span id="${id}" class="section-anchor"></span>`;
      
      // Try to insert anchor near where this text appears
      // We'll add it as a separate div at the beginning
      const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedText})`, 'i');
      
      // Only add anchor if text is found and not already anchored
      if (regex.test(modifiedContent) && !modifiedContent.includes(`id="${id}"`)) {
        modifiedContent = modifiedContent.replace(regex, `${anchor}$1`);
      }
    }
  });
  
  return modifiedContent;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await wordpressService.fetchPost(slug);
  
  if (!post) {
    notFound();
  }

  // Extract headings dynamically from post content
  const headings = extractHeadingsFromContent(post.content);
  
  // Prepare content with section anchors
  const contentWithAnchors = prepareContentForTOC(post.content, headings);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-8">
          <PostDetail post={{...post, content: contentWithAnchors}} />
          
          {/* In-article ad */}
          <div className="my-8">
            <AdWrapper slot="inArticle" format="horizontal" />
          </div>

          <CommentSection postId={post.id} />

          <RelatedPosts postId={post.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Author info - DYNAMIC */}
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

          {/* Dynamic Table of contents - AUTO GENERATED */}
          <TableOfContents headings={headings} />

          {/* Share box - DYNAMIC */}
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