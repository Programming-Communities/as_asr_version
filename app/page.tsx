import Hero from '@/components/layout/Hero';
import PostGrid from '@/components/posts/PostGrid';
import AdWrapper from '@/components/ads/AdWrapper';
import wordpressService from '@/services/wordpress';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default async function HomePage() {
  // Fetch latest posts
  const { posts } = await wordpressService.fetchPosts({
    first: 12,
  });

  // Fetch categories for featured section
  const categories = await wordpressService.fetchCategories();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Latest Articles */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Articles
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover our newest Islamic content and educational resources
          </p>
        </div>
        
        <PostGrid posts={posts} />
      </section>

      {/* Featured Categories */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore content based on your interests
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map(category => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {category.count} articles
                </p>
                <span className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                  Explore →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <section className="container mx-auto px-4 py-8">
        <AdWrapper 
          slot="homeBanner" 
          format="horizontal"
          className="mb-8"
        />
      </section>

      {/* Featured Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Al Asr Centers?
            </h2>
            <div className="prose prose-lg dark:prose-invert">
              <p>
                Al Asr Centers provides authentic Islamic education through comprehensive articles, 
                Quranic studies, and scholarly insights. Our platform is designed to make Islamic 
                learning accessible to everyone.
              </p>
              <ul>
                <li>Authentic content verified by scholars</li>
                <li>Comprehensive Quranic studies</li>
                <li>Regularly updated articles</li>
                <li>Mobile-friendly responsive design</li>
                <li>Free access to all educational materials</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-3">Daily Inspiration</h3>
              <p className="mb-4">
                Start your day with meaningful Islamic insights and reminders.
              </p>
              <a href="/blog" className="inline-flex items-center font-medium hover:underline">
                Read Daily Content →
              </a>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Quick Access
              </h3>
              <div className="space-y-2">
                <a href="/quran" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Quran Studies
                </a>
                <a href="/hadith" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Hadith Collection
                </a>
                <a href="/fiqh" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Islamic Jurisprudence
                </a>
                <a href="/history" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Islamic History
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}