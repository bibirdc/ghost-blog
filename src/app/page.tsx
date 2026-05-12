import Link from 'next/link';
import { getAllPosts, getAllCategories } from '@/lib/wordpress';
import { generateSearchIndex } from '@/lib/generate-search-index';

export default async function HomePage() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();
  await generateSearchIndex();

  return (
    <div className="page-container">
      <div className="category-filter">
        <Link href="/" className="active">
          All
        </Link>
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}>
            {cat.name}
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

      <div className="newsletter-cta" id="newsletter-cta">
        <p className="newsletter-label">Free with every signup</p>
        <h3>Get a free excerpt from The Treatment Winning Bible</h3>
        <p>
          Plus weekly insights on treatment design, visual research,
          and what actually wins pitches. No fluff. Unsubscribe anytime.
        </p>
        <Link href="/subscribe" className="cta-button">
          Subscribe and get the excerpt
        </Link>
      </div>
    </div>
  );
}
