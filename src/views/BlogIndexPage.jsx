import Link from "next/link";
import { TrailRail } from "@/components/TrailRail";
import { BackgroundNumeral, FinalCTA, Hero } from "@/components/marketing/Marketing";
import { PostCard } from "@/components/blog/PostCard";

export function BlogIndexPage({ posts, loadError = false }) {
  return (
    <main id="main-content" tabIndex={-1} className="marketing-page apm-has-trail">
      <TrailRail chapters={[{ id: "chapter-01" }]} />
      <Hero compact breadcrumb="/blog" note description="Trail guides, safety tips and stories from people getting outside together in British Columbia.">
        Stories from the trail
      </Hero>

      <section className="apm-section" data-testid="chapter-01" aria-labelledby="posts-title">
        <BackgroundNumeral value="01" />
        <div className="apm-wrap">
          <h2 id="posts-title">Latest outdoor guides and stories</h2>
          {loadError ? (
            <div role="status" className="apm-blog-status">
              <p className="apm-blog-status-title">Posts could not be loaded</p>
              <p>Please refresh the page to see the latest posts.</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="apm-blog-status" data-testid="blog-empty">
              <p className="apm-blog-status-title">The first posts are on their way.</p>
              <p>
                In the meantime, <Link href="/how-it-works">see how AKTIVPAL works</Link> or{" "}
                <Link href="/movement">explore outdoor activities in British Columbia</Link>.
              </p>
            </div>
          ) : (
            <div className="apm-post-grid" data-testid="blog-posts">
              {posts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          )}
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
