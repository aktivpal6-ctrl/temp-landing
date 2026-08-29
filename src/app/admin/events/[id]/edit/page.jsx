"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Pencil } from "lucide-react";
import { Logo } from "@/components/primitives";
import { EventForm } from "@/components/admin/EventForm";
import { toast } from "sonner";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [authChecked, setAuthChecked] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) {
          router.replace("/login");
        } else {
          setAuthChecked(true);
          fetchEvent();
        }
      })
      .catch(() => router.replace("/login"));
  }, [router, id]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) throw new Error("Event not found");
      const data = await res.json();
      setEvent(data);
    } catch {
      toast.error("Event not found");
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update event");
      }

      toast.success("Event updated successfully!");
      router.push("/admin");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F2]">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF5C00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F7F7F2]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Logo size={32} showWord />
            <span className="rounded-full border border-[#FF5C00]/20 bg-[#FF5C00]/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5C00]">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin")}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F291E] transition-colors hover:border-[#FF5C00]/40 hover:text-[#FF5C00]"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F291E] transition-colors hover:border-red-300 hover:text-red-600"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 flex items-center gap-3">
            <Pencil className="h-5 w-5 text-[#FF5C00]" />
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#0F291E] md:text-3xl">
              Edit event
            </h1>
          </div>

          {event && (
            <EventForm
              initialData={event}
              onSubmit={onSubmit}
              submitLabel="Save changes"
              submitting={submitting}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}
