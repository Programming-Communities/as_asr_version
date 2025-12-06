import { notFound } from 'next/navigation';
import Link from 'next/link';
import PostGrid from '@/components/posts/PostGrid';
import AdWrapper from '@/components/ads/AdWrapper';
import wordpressService from '@/services/wordpress';
import type { WPCategory } from '@/types/wordpress';
import { siteConfig } from '@/config/site'; // Added import

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(props: CategoryPageProps) {
  const params = await props.params; // Await params
  const categories = await wordpressService.fetchCategories();
  const category = categories.find((cat: WPCategory) => cat.slug === params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} - ${siteConfig.name}`,
    description: category.description || `Explore all articles in ${category.name} category.`,
  };
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params; // Await params
  const categories = await wordpressService.fetchCategories();
  const category = categories.find((cat: WPCategory) => cat.slug === params.slug);
  
  if (!category) {
    notFound();
  }

  const { posts } = await wordpressService.fetchPosts({
    first: 12,
    category: category.id,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
          Category
        </div>
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {category.description || `Explore comprehensive content about ${category.name}.`}
        </p>
        <div className="text-sm text-gray-500">
          {category.count} article{category.count !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <PostGrid posts={posts} />
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
            <h3 className="font-bold mb-4">About This Category</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {category.description || `Explore comprehensive content about ${category.name}.`}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Articles</span>
                <span className="font-semibold">{category.count}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
            <h3 className="font-bold mb-4">Related Categories</h3>
            <div className="space-y-2">
              {categories
                .filter((cat: WPCategory) => cat.id !== category.id)
                .slice(0, 5)
                .map((cat: WPCategory) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="flex justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <span>{cat.name}</span>
                    <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 rounded">
                      {cat.count}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}