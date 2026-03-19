import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories, getPostsByCategory } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};

  return {
    title: cat.name,
    description: `Posts in the ${cat.name} category — Treatments by Ghost`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const cat = categories.find((c) => c.slug === slug);

  if (!cat) {
    notFound();
  }

  const posts = await getPostsByCategory(slug);

  return (
    <div className="page-container">
      <div className="category-header">
        <p className="section-label">Category</p>
        <h1>{cat.name}</h1>
        <p>
          {posts.length} post{posts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="category-filter">
        <Link href="/">All</Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={c.slug === slug ? 'active' : ''}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="posts-list">
        {posts.map((post) => (
          <article
            key={post.slug}
            className={`post-card ${!post.firstImage ? 'no-image' : ''}`}
          >
            <div className="post-card-content">
              <div className="post-card-meta">
                {post.categories.length > 0 && (
                  <span className="post-card-category">
                    {post.categories[0]}
                  </span>
                )}
                <span className="post-card-date">{post.dateFormatted}</span>
              </div>
              <h2>
                <Link href={`/post/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="post-card-excerpt">{post.excerpt}</p>
            </div>
            {post.firstImage && (
              <img
                src={post.firstImage}
                alt=""
                className="post-card-thumbnail"
                loading="lazy"
              />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
