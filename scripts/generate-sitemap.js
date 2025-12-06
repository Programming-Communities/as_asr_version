const fs = require('fs').promises;
const path = require('path');

async function generateSitemap() {
  const pages = [
    '/',
    '/blog',
    '/categories',
    '/about',
    '/contact',
    '/privacy',
    '/terms'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${pages.map(page => `
  <url>
    <loc>https://yourdomain.com${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
</urlset>`;

  await fs.writeFile(
    path.join(__dirname, '../public/sitemap.xml'),
    sitemap
  );
  
  console.log('✅ Sitemap generated!');
}

generateSitemap();
