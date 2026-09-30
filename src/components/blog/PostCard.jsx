import Link from "next/link";
import { blogPath, formatPostDate } from "@/lib/blog";

// The title link stretches over the whole card, so the card is one link target.
// Cover images can come from any host, so they skip next/image (limited to next.config.js hosts).
export function PostCard({ post }) {
  return (
    <article className="apm-post-card">
      <div className={`apm-post-card-photo${post.image_url ? "" : " apm-post-card-photo--empty"}`}>
        {post.image_url && <img src={post.image_url} alt={post.image_alt} loading="lazy" decoding="async" />}
      </div>
      <div className="apm-post-card-body">
        <p className="apm-post-meta">
          <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
          <span aria-hidden="true">·</span>
          {post.reading_minutes} min read
        </p>
        <h3><Link href={blogPath(post)} className="apm-post-card-link">{post.title}</Link></h3>
        <p className="apm-post-card-excerpt">{post.excerpt}</p>
      </div>
    </article>
  );
}
