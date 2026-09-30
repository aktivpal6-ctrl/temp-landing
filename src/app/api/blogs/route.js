import { NextResponse, after } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Blog from "@/models/Blog";
import { isAdmin } from "@/lib/auth";
import { changedBlogPaths, publicBlog } from "@/lib/blog";
import { notifyIndexNow } from "@/lib/indexnow";
import { blogInputSchema } from "@/lib/blog-schema";
import { blogFields, slugTaken } from "@/lib/blog-store";

export const runtime = "nodejs";

// Public: published posts, newest first. Admin: every post, including drafts.
export async function GET() {
  try {
    await connectToDatabase();
    const admin = await isAdmin();
    const posts = admin
      ? await Blog.find().sort({ updatedAt: -1 }).lean()
      : (await Blog.find({ status: "published" }).sort({ published_at: -1 }).lean()).map((post) => publicBlog(post));
    return NextResponse.json(posts, { headers: { "Cache-Control": "private, no-store", Vary: "Cookie" } });
  } catch (e) {
    console.error("Blogs fetch error:", e.message);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const parsed = blogInputSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectToDatabase();

    if (parsed.data.slug && await slugTaken(parsed.data.slug)) {
      return NextResponse.json({ ok: false, error: "Another post already uses this URL" }, { status: 409 });
    }

    const post = await Blog.create(await blogFields(parsed.data));
    after(() => notifyIndexNow(changedBlogPaths(null, post)));
    return NextResponse.json({ ok: true, data: post }, { status: 201 });
  } catch (e) {
    if (e.code === 11000) {
      return NextResponse.json({ ok: false, error: "Another post already uses this URL" }, { status: 409 });
    }
    console.error("Blog create error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
