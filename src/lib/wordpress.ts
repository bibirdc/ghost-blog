import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';

export interface Post {
  title: string;
  slug: string;
  date: string;
  dateFormatted: string;
  content: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  status: string;
  type: string;
  firstImage: string | null;
}

export interface Category {
  name: string;
  slug: string;
}

let cachedPosts: Post[] | null = null;
let cachedCategories: Category[] | null = null;

function extractCDATA(val: unknown): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return extractCDATA(val[0]);
  if (typeof val === 'object' && val !== null && '_' in val) {
    return (val as { _: string })._;
  }
  return String(val);
}

function extractFirstImage(html: string): string | null {
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
}

function generateExcerpt(html: string, maxLength = 200): string {
  // Strip HTML tags and WordPress block comments
  const text = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

async function parseWordPress() {
  const xmlPath = path.join(process.cwd(), 'data', 'wordpress.xml');
  const xml = fs.readFileSync(xmlPath, 'utf-8');

  const result = await parseStringPromise(xml, {
    explicitArray: true,
    trim: true,
  });

  const channel = result.rss.channel[0];

  // Extract categories
  const wpCategories: Category[] = [];
  if (channel['wp:category']) {
    for (const cat of channel['wp:category']) {
      const name = extractCDATA(cat['wp:cat_name']);
      const slug = extractCDATA(cat['wp:category_nicename']);
      if (name && slug && slug !== 'uncategorized') {
        wpCategories.push({ name, slug });
      }
    }
  }

  // Extract posts
  const posts: Post[] = [];
  const items = channel.item || [];

  for (const item of items) {
    const postType = extractCDATA(item['wp:post_type']);
    const status = extractCDATA(item['wp:status']);

    if (postType !== 'post') continue;
    if (status !== 'publish') continue;

    const title = extractCDATA(item.title);
    const slug = extractCDATA(item['wp:post_name']);
    const dateRaw = extractCDATA(item['wp:post_date']);
    const content = extractCDATA(item['content:encoded']);
    const excerptRaw = extractCDATA(item['excerpt:encoded']);

    // Extract categories and tags from the item
    const categories: string[] = [];
    const tags: string[] = [];

    if (item.category) {
      for (const cat of item.category) {
        const domain = cat.$.domain;
        const name = cat._ || extractCDATA(cat);
        if (domain === 'category' && name !== 'Uncategorized') {
          categories.push(name);
        } else if (domain === 'post_tag') {
          tags.push(name);
        }
      }
    }

    const excerpt = excerptRaw || generateExcerpt(content);
    const firstImage = extractFirstImage(content);

    posts.push({
      title,
      slug,
      date: dateRaw,
      dateFormatted: formatDate(dateRaw),
      content,
      excerpt,
      categories,
      tags,
      status,
      type: postType,
      firstImage,
    });
  }

  // Sort by date, newest first
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { posts, categories: wpCategories };
}

export async function getAllPosts(): Promise<Post[]> {
  if (!cachedPosts) {
    const data = await parseWordPress();
    cachedPosts = data.posts;
    cachedCategories = data.categories;
  }
  return cachedPosts;
}

export async function getAllCategories(): Promise<Category[]> {
  if (!cachedCategories) {
    const data = await parseWordPress();
    cachedPosts = data.posts;
    cachedCategories = data.categories;
  }
  return cachedCategories;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const posts = await getAllPosts();
  const categories = await getAllCategories();
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  return posts.filter((p) => p.categories.includes(cat.name));
}
