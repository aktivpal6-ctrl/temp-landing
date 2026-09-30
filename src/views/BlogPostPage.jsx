import Link from "next/link";
import { TrailRail } from "@/components/TrailRail";
import { BackgroundNumeral, FinalCTA, Hero } from "@/components/marketing/Marketing";
import { BlogContent } from "@/components/blog/BlogContent";
import { PostCard } from "@/components/blog/PostCard";
import { formatPostDate } from "@/lib/blog";

export function BlogPostPage({ post, related }) {
  return (
    <main id="main-content" tabIndex={-1} className="marketing-page apm-has-trail">
      <TrailRail chapters={[{ id: "chapter-01" }, { id: "chapter-02" }]} />
      <article aria-labelledby="hero-title">
        <Hero compact wide backdrop="grid" breadcrumb={{ path: "/blog", current: post.title }} description={post.excerpt}>
          {post.title}
        </Hero>

        <div className="apm-section apm-post" data-testid="chapter-01">
          <BackgroundNumeral value="01" />
          <div className="apm-wrap">
            <div className="apm-post-col">
              <p className="apm-post-meta apm-post-byline">
                <span>By <span className="apm-post-author">{post.author}</span></span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
                <span aria-hidden="true">·</span>
                {post.reading_minutes} min read
              </p>
              {/* The cover is usually the largest element on screen, so it loads first. */}
              {post.image_url && (
                <figure className="apm-post-cover">
                  <img src={post.image_url} alt={post.image_alt} fetchPriority="high" decoding="async" />
                </figure>
              )}
              <BlogContent content={post.content} />
            </div>
          </div>
        </div>
      </article>

      <section className="apm-section" data-testid="chapter-02" aria-labelledby="more-title">
        <BackgroundNumeral value="02" />
        <div className="apm-wrap">
          <h2 id="more-title">More from the AKTIVPAL blog</h2>
          {related.length > 0 && (
            <div className="apm-post-grid">
              {related.map((other) => <PostCard key={other._id} post={other} />)}
            </div>
          )}
          <Link className="apm-text-link" href="/blog">See all posts</Link>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
