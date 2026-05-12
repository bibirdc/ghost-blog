import fs from 'fs';
import path from 'path';
import { getAllPosts, getAllCategories } from './wordpress';

async function generateSitemap() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();
  const baseUrl = 'https://treatmentsbyghost.com/blog';
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/bible</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Category pages
  for (const cat of categories) {
    xml += `
  <url>
    <loc>${baseUrl}/category/${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  // Blog posts
  for (const post of posts) {
    const postDate = new Date(post.date).toISOString().split('T')[0];
    xml += `
  <url>
    <loc>${baseUrl}/post/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  xml += `
</urlset>`;

  const outDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8');
  console.log(`Sitemap generated: ${posts.length} posts, ${categories.length} categories`);
}

generateSitemap();
