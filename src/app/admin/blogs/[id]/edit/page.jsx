"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink, Pencil } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogForm } from "@/components/admin/BlogForm";

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const me = await (await fetch("/api/auth/me")).json();
        if (!me.authenticated) return router.replace("/login");
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error(res.status === 404 ? "This post no longer exists." : "The post could not be loaded.");
        setPost(await res.json());
      } catch (err) {
        setLoadError(err.message);
      }
    };
    load();
  }, [router, id]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update post");
      router.push("/admin?tab=blogs");
    } catch (err) {
      setError(err.message || "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      <AdminHeader />
      <main className="mx-auto max-w-3xl px-6 py-8">
        {loadError ? (
          <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{loadError}</p>
        ) : !post ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF5C00] border-t-transparent" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Pencil className="h-5 w-5 text-[#FF5C00]" />
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#0F291E] md:text-3xl">
                  Edit blog post
                </h1>
              </div>
              {post.status === "published" && (
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#A63C00] hover:underline">
                  View live post <ExternalLink size={14} />
                </a>
              )}
            </div>
            <BlogForm initialData={post} onSubmit={onSubmit} submitLabel="Save changes" submitting={submitting} error={error} />
          </motion.div>
        )}
      </main>
    </div>
  );
}
