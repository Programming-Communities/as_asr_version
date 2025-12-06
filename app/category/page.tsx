import Link from 'next/link';
import wordpressService from '@/services/wordpress';
import { siteConfig } from '@/config/site'; // Make sure this import exists
import type { WPCategory } from '@/types/wordpress';

export const metadata = {
  title: `All Categories - ${siteConfig.name}`,
  description: 'Browse all categories of Islamic content and articles.',
};

export default async function CategoriesPage() {
  const categories = await wordpressService.fetchCategories();

  // Sort alphabetically
  const sortedCategories = [...categories].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          All Categories
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mb-6">
          Browse our complete collection of Islamic content categories.
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
          {sortedCategories.length} categories
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCategories.map(category => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group block p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {category.name}
              </h3>
              <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
                {category.count}
              </span>
            </div>
            {category.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {category.description}
              </p>
            )}
            <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
              <span className="text-sm font-medium">Explore articles</span>
              <span className="ml-2">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">
              {sortedCategories.length}
            </div>
            <div className="text-gray-700 dark:text-gray-300 font-medium">Total Categories</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">
              {sortedCategories.reduce((sum, cat) => sum + cat.count, 0)}
            </div>
            <div className="text-gray-700 dark:text-gray-300 font-medium">Total Articles</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">
              {Math.max(...sortedCategories.map(cat => cat.count))}
            </div>
            <div className="text-gray-700 dark:text-gray-300 font-medium">Most Active Category</div>
          </div>
        </div>
      </div>
    </div>
  );
}