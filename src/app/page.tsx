import Link from 'next/link';
import { getAllPosts, getAllCategories } from '@/lib/wordpress';

export default async function HomePage() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();

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

      <div className="newsletter-cta">
        <h3>Stay in the loop</h3>
        <p>
          Get insights on treatment design, commercial filmmaking, and the
          advertising industry delivered to your inbox.
        </p>
        <a
          href="mailto:info@treatmentsbyghost.com?subject=Newsletter%20Signup"
          className="cta-button"
        >
          Subscribe
        </a>
      </div>
    </div>
  );
}
