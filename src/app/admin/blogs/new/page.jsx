"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) router.replace("/login");
        else setAuthChecked(true);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create post");
      router.push("/admin?tab=blogs");
    } catch (err) {
      setError(err.message || "Something went wrong");
      setSubmitting(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F2]">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF5C00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      <AdminHeader />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#FF5C00]" />
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#0F291E] md:text-3xl">
              New blog post
            </h1>
          </div>
          <BlogForm onSubmit={onSubmit} submitLabel="Create post" submitting={submitting} error={error} />
        </motion.div>
      </main>
    </div>
  );
}
