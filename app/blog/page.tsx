import Link from 'next/link';
import PostGrid from '@/components/posts/PostGrid';
import AdWrapper from '@/components/ads/AdWrapper';
import wordpressService from '@/services/wordpress';
import { siteConfig } from '@/config/site';
import type { WPCategory } from '@/types/wordpress';

export const metadata = {
  title: `${siteConfig.name} - Blog`,
  description: 'Latest articles and Islamic content from Al Asr Centers',
};

export default async function BlogPage() {
  const { posts } = await wordpressService.fetchPosts({
    first: 12,
  });

  const categories = await wordpressService.fetchCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Latest Articles
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mb-8">
          Explore our collection of Islamic articles, Quran studies, and educational content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          <PostGrid posts={posts} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
              📚 Categories
            </h3>
            <div className="space-y-2">
              {categories.slice(0, 8).map((cat: WPCategory) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="flex items-center justify-between p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition block" // REMOVE either 'flex' or 'block'
                >
                  <span>{cat.name}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
            {categories.length > 8 && (
              <Link
                href="/categories"
                className="block mt-4 text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
              >
                View all categories →
              </Link>
            )}
          </div>

          {/* Popular tags */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
              🔥 Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Quran', 'Hadith', 'Fiqh', 'History', 'Spirituality', 'Ramadan', 'Hajj', 'Zakat'].map((tag, i) => (
                <Link
                  key={i}
                  href={`/tag/${tag.toLowerCase()}`}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm"
                >
                  #{tag}
                </Link>
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