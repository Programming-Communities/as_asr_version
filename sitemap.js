import { wordpressService } from '@/services/wordpress';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://al-asr.centers.pk';

  try {
    // Fetch WordPress posts for dynamic sitemap
    const { posts } = await wordpressService.fetchPosts({ first: 100 });
    const categories = await wordpressService.fetchCategories();

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
      },
    ];

    // Dynamic post pages
    const postPages = posts.map(post => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Dynamic category pages
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Search page
    const searchPage = {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    };

    // Admin page (lower priority)
    const adminPage = {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    };

    // Combine all pages
    const allPages = [
      ...staticPages,
      ...postPages,
      ...categoryPages,
      searchPage,
      adminPage,
    ];

    return allPages;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap if WordPress fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}