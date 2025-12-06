/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://al-asr.centers.pk',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/404'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL}/server-sitemap.xml`,
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/admin',
    '/admin/**',
    '/api/**',
    '/404',
    '/500',
    '/_next/**',
    '/favicon.ico',
  ],
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/blog': 0.9,
      '/categories': 0.8,
      '/about': 0.7,
      '/contact': 0.6,
      '/privacy': 0.5,
      '/terms': 0.5,
    };

    const changefreqs = {
      '/': 'daily',
      '/blog': 'daily',
      '/categories': 'weekly',
      '/about': 'monthly',
      '/contact': 'monthly',
    };

    return {
      loc: path,
      changefreq: changefreqs[path] || config.changefreq,
      priority: priorities[path] || config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs || [],
    };
  },
  additionalPaths: async (config) => {
    const result = [
      config.transform(config, '/blog'),
      config.transform(config, '/categories'),
      config.transform(config, '/about'),
      config.transform(config, '/contact'),
      config.transform(config, '/privacy'),
      config.transform(config, '/terms'),
    ];

    return result;
  },
};