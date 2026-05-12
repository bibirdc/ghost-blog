import { getAllPosts } from './wordpress';
import fs from 'fs';
import path from 'path';

export async function generateSearchIndex() {
  const posts = await getAllPosts();

  const index = posts.map((p) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    category: p.categories[0] || '',
    date: p.dateFormatted,
    // Strip HTML for searchable plain text
    text: p.content
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500),
  }));

  const outDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(
    path.join(outDir, 'search-index.json'),
    JSON.stringify(index)
  );
}
