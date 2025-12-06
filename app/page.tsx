import Hero from '@/components/layout/Hero';
import PostGrid from '@/components/posts/PostGrid';
import AdWrapper from '@/components/ads/AdWrapper';
import wordpressService from '@/services/wordpress';

export default async function HomePage() {
  const { posts } = await wordpressService.fetchPosts({
    first: 12,
  });

  return (
    <div>
      {/* Hero Section */}
      <Hero 
        title="Al-Asr Islamic Service"
        description="Islamic services, calendar events, and community programs. Stay updated with the latest from Al-Asr Islamic Service."
      />

      {/* Latest Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Latest Articles
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Fresh content from our writers and scholars
              </p>
            </div>
            <a
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View all articles →
            </a>
          </div>
          
          <PostGrid posts={posts} />
        </div>
      </section>

      {/* Ad Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <AdWrapper slot="footer" format="horizontal" />
        </div>
      </section>
    </div>
  );
}