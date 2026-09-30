import { NextResponse, after } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Blog from "@/models/Blog";
import { isAdmin } from "@/lib/auth";
import { changedBlogPaths, publicBlog } from "@/lib/blog";
import { notifyIndexNow } from "@/lib/indexnow";
import { blogInputSchema } from "@/lib/blog-schema";
import { blogFields, slugTaken } from "@/lib/blog-store";

export const runtime = "nodejs";

const OBJECT_ID = /^[a-f0-9]{24}$/i;

// Admin: any post by ID. Public: a published post by ID or by its URL slug.
export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const admin = await isAdmin();
    const match = OBJECT_ID.test(id) ? { _id: id } : { slug: id };
    const post = await Blog.findOne(admin ? match : { ...match, status: "published" }).lean();
    if (!post) {
      return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(admin ? post : publicBlog(post, { content: true }), {
      headers: { "Cache-Control": "private, no-store", Vary: "Cookie" },
    });
  } catch (e) {
    console.error("Blog fetch error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const parsed = blogInputSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectToDatabase();

    const existing = OBJECT_ID.test(id) && await Blog.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
    }
    if (parsed.data.slug && await slugTaken(parsed.data.slug, existing._id)) {
      return NextResponse.json({ ok: false, error: "Another post already uses this URL" }, { status: 409 });
    }

    const post = await Blog.findByIdAndUpdate(id, { $set: await blogFields(parsed.data, existing) }, { new: true, runValidators: true }).lean();
    after(() => notifyIndexNow(changedBlogPaths(existing, post)));
    return NextResponse.json({ ok: true, data: post });
  } catch (e) {
    if (e.code === 11000) {
      return NextResponse.json({ ok: false, error: "Another post already uses this URL" }, { status: 409 });
    }
    console.error("Blog update error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const post = OBJECT_ID.test(id) && await Blog.findByIdAndDelete(id).lean();
    if (!post) {
      return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
    }

    after(() => notifyIndexNow(changedBlogPaths(post, null)));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Blog delete error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
