import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      ...(post.firstImage ? { images: [{ url: post.firstImage }] } : {}),
    },
    twitter: {
      card: post.firstImage ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.excerpt,
    },
  };
}

function cleanContent(html: string): string {
  // Remove WordPress block comments but keep the HTML content
  return html
    .replace(/<!-- wp:[^\n]* -->/g, '')
    .replace(/<!-- \/wp:[^\n]* -->/g, '')
    .trim();
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const cleanedContent = cleanContent(post.content);

  return (
    <article className="post-page">
      <Link href="/" className="back-link">
        &larr; Back to all posts
      </Link>

      <header className="post-header">
        <div className="post-header-meta">
          {post.categories.length > 0 && (
            <Link
              href={`/category/${post.categories[0].toLowerCase().replace(/\s+/g, '-')}`}
              className="post-card-category"
            >
              {post.categories[0]}
            </Link>
          )}
          <span className="post-card-date">{post.dateFormatted}</span>
        </div>
        <h1>{post.title}</h1>
      </header>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: cleanedContent }}
      />

      {post.tags.length > 0 && (
        <div className="post-tags">
          <p className="post-tags-label section-label">Tags</p>
          <div className="post-tags-list">
            {post.tags.map((tag) => (
              <span key={tag} className="post-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="newsletter-cta">
        <h3>Enjoyed this read?</h3>
        <p>
          Get more insights on treatment design and the advertising industry
          straight to your inbox.
        </p>
        <a
          href="mailto:info@treatmentsbyghost.com?subject=Newsletter%20Signup"
          className="cta-button"
        >
          Subscribe
        </a>
      </div>
    </article>
  );
}
