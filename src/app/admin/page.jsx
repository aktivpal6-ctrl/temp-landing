"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Users, RefreshCw, Search, Calendar, Pencil, Trash2, Eye, FileText, ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/primitives";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const TABS = [
  { key: "waitlist", label: "Waitlist", icon: Users },
  { key: "events", label: "Events", icon: Calendar },
  { key: "blogs", label: "Blog", icon: FileText },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("waitlist");

  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  // { ...item, kind: "event" | "blog" }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [attendeesEvent, setAttendeesEvent] = useState(null);

  const fetchEntries = async () => {
    setEntriesLoading(true);
    try {
      const res = await fetch("/api/waitlist");
      const data = await res.json();
      if (data.ok) setEntries(data.data);
      else router.replace("/login");
    } catch {
      router.replace("/login");
    } finally {
      setEntriesLoading(false);
    }
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) throw new Error("Blog feed unavailable");
      setBlogs(data);
    } catch {
      toast.error("Failed to load blog posts");
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    // Editors return here with ?tab=blogs after saving a post.
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (TABS.some(({ key }) => key === tab)) setActiveTab(tab);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) router.replace("/login");
        else {
          fetchEntries();
          fetchEvents();
          fetchBlogs();
        }
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const isBlog = deleteTarget.kind === "blog";
    setDeleting(true);
    try {
      const res = await fetch(`/api/${isBlog ? "blogs" : "events"}/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      (isBlog ? setBlogs : setEvents)((prev) => prev.filter((e) => e._id !== deleteTarget._id));
      toast.success(isBlog ? "Post deleted" : "Event deleted");
    } catch {
      toast.error(isBlog ? "Failed to delete post" : "Failed to delete event");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredEntries = entries.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.name?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.phone?.toLowerCase().includes(q) ||
      e.instagram?.toLowerCase().includes(q)
    );
  });

  const filteredEvents = events.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.title?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q)
    );
  });

  const filteredBlogs = blogs.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.excerpt?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q)
    );
  });

  const TAB_DATA = {
    waitlist: { all: entries, items: filteredEntries, loading: entriesLoading, refresh: fetchEntries, total: "Total signups", empty: "No signups yet.", search: "Search by name, email, location..." },
    events: { all: events, items: filteredEvents, loading: eventsLoading, refresh: fetchEvents, total: "Total events", empty: "No events yet.", search: "Search by title, location..." },
    blogs: { all: blogs, items: filteredBlogs, loading: blogsLoading, refresh: fetchBlogs, total: "Total posts", empty: "No blog posts yet.", search: "Search by title, summary, author..." },
  };
  const tab = TAB_DATA[activeTab];
  const { loading, items } = tab;
  const TabIcon = TABS.find(({ key }) => key === activeTab).icon;

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F7F7F2]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={32} showWord />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#FF5C00] px-3 py-1 rounded-full border border-[#FF5C00]/20 bg-[#FF5C00]/5">
              Admin
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push("/admin/blogs/new")}
              className="inline-flex items-center gap-2 rounded-full border border-[#FF5C00]/20 bg-[#FF5C00]/5 px-4 py-2.5 text-sm font-semibold text-[#FF5C00] transition-colors hover:bg-[#FF5C00]/10"
              data-testid="admin-add-blog"
            >
              <FileText size={16} /> New post
            </button>
            <button
              onClick={() => router.push("/admin/events")}
              className="inline-flex items-center gap-2 rounded-full border border-[#FF5C00]/20 bg-[#FF5C00]/5 px-4 py-2.5 text-sm font-semibold text-[#FF5C00] transition-colors hover:bg-[#FF5C00]/10"
              data-testid="admin-add-event"
            >
              <Calendar size={16} /> Add Event
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F291E] transition-colors hover:border-red-300 hover:text-red-600"
              data-testid="admin-logout"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-center gap-2"
        >
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSearch(""); }}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === key
                  ? "bg-[#0F291E] text-[#F7F7F2]"
                  : "border border-black/10 bg-white text-[#0F291E] hover:border-[#FF5C00]/40 hover:text-[#FF5C00]"
              }`}
            >
              <Icon size={16} /> {label}
              <span className="ml-1 rounded-full bg-[#FF5C00] px-2 py-0.5 text-xs font-bold text-white">
                {TAB_DATA[key].all.length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Stats + Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5C00]/10 text-[#FF5C00]">
              <TabIcon size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#4A524A]">{tab.total}</p>
              <p className="text-xl font-display font-black text-[#0F291E]">{tab.all.length}</p>
            </div>
          </div>

          <button
            onClick={tab.refresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#0F291E] transition-colors hover:border-[#FF5C00]/40 hover:text-[#FF5C00] disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </motion.div>

        {/* Search */}
        <div className="mb-6 relative max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A524A]" />
          <input
            type="text"
            placeholder={tab.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-black/10 bg-white focus:border-[#FF5C00] outline-none text-[15px]"
            data-testid="admin-search"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF5C00] border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#4A524A] text-lg">
              {tab.all.length === 0 ? tab.empty : "No results match your search."}
            </p>
          </div>
        ) : activeTab === "waitlist" ? (
          <WaitlistTable entries={filteredEntries} />
        ) : activeTab === "events" ? (
          <EventsTable events={filteredEvents} onEdit={router.push} onDelete={(event) => setDeleteTarget({ ...event, kind: "event" })} onViewAttendees={setAttendeesEvent} />
        ) : (
          <BlogsTable posts={filteredBlogs} onEdit={router.push} onDelete={(post) => setDeleteTarget({ ...post, kind: "blog" })} />
        )}
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.kind === "blog" ? "post" : "event"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Attendees Dialog */}
      <Dialog open={Boolean(attendeesEvent)} onOpenChange={(o) => !o && setAttendeesEvent(null)}>
        <DialogContent className="sm:max-w-lg border-[#0F291E]/10 bg-white max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-[#0F291E]">
              {attendeesEvent?.title} — Attendees
            </DialogTitle>
            <DialogDescription className="text-[#4A524A]">
              {attendeesEvent?.attendees?.length || 0} people joined this event.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 overflow-y-auto flex-1 -mx-6 px-6">
            {!attendeesEvent?.attendees?.length ? (
              <div className="py-10 text-center text-sm text-[#4A524A]">
                No attendees yet.
              </div>
            ) : (
              <div className="space-y-3">
                {attendeesEvent.attendees.map((a, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#0F291E]/10 bg-[#F7F7F2] p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-[#0F291E]">{a.name}</p>
                        <p className="mt-1 text-sm text-[#4A524A]">{a.email}</p>
                        <p className="text-sm text-[#4A524A]">{a.phone}</p>
                      </div>
                      <span className="text-xs text-[#4A524A]">
                        {new Date(a.joined_at).toLocaleDateString("en-CA", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WaitlistTable({ entries }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-[1.5rem] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[15px]" data-testid="admin-table">
          <thead>
            <tr className="border-b border-black/10 bg-[#F7F7F2]">
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Name</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Location</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Email</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Phone</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Instagram</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry._id}
                className="border-b border-black/5 last:border-0 hover:bg-[#FF5C00]/[0.02] transition-colors"
              >
                <td className="px-5 py-4 font-semibold text-[#0F291E]">{entry.name}</td>
                <td className="px-5 py-4 text-[#4A524A]">{entry.location || "---"}</td>
                <td className="px-5 py-4 text-[#4A524A]">{entry.email}</td>
                <td className="px-5 py-4 text-[#4A524A]">{entry.phone || "---"}</td>
                <td className="px-5 py-4 text-[#4A524A]">{entry.instagram || "---"}</td>
                <td className="px-5 py-4 text-xs text-[#4A524A]">
                  {new Date(entry.createdAt).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function EventsTable({ events, onEdit, onDelete, onViewAttendees }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-[1.5rem] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[15px]" data-testid="events-table">
          <thead>
            <tr className="border-b border-black/10 bg-[#F7F7F2]">
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Title</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Location</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Difficulty</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Date</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Attendees</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event._id}
                className="border-b border-black/5 last:border-0 hover:bg-[#FF5C00]/[0.02] transition-colors"
              >
                <td className="px-5 py-4 font-semibold text-[#0F291E]">{event.title}</td>
                <td className="px-5 py-4 text-[#4A524A]">{event.location}</td>
                <td className="px-5 py-4">
                  <span className="inline-block rounded-full bg-[#FF5C00]/10 px-2.5 py-1 text-xs font-bold text-[#FF5C00]">
                    {event.difficulty}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-[#4A524A]">
                  {new Date(event.start_time).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => onViewAttendees(event)}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#0F291E] transition-colors hover:text-[#FF5C00]"
                  >
                    <Eye size={14} />
                    {event.attendees?.length || 0}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(`/admin/events/${event._id}/edit`)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F291E] transition-colors hover:border-[#FF5C00]/40 hover:text-[#FF5C00]"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(event)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F291E] transition-colors hover:border-red-300 hover:text-red-500"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function BlogsTable({ posts, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-[1.5rem] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[15px]" data-testid="blogs-table">
          <thead>
            <tr className="border-b border-black/10 bg-[#F7F7F2]">
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Title</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Status</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Author</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Published</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Updated</th>
              <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post._id}
                className="border-b border-black/5 last:border-0 hover:bg-[#FF5C00]/[0.02] transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-[#0F291E]">{post.title}</p>
                  <p className="mt-0.5 text-xs text-[#4A524A]">/blog/{post.slug}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
                    post.status === "published" ? "bg-[#1E6B45]/10 text-[#1E6B45]" : "bg-black/5 text-[#4A524A]"
                  }`}>
                    {post.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4 text-[#4A524A]">{post.author}</td>
                <td className="px-5 py-4 text-xs text-[#4A524A]">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
                    : "---"}
                </td>
                <td className="px-5 py-4 text-xs text-[#4A524A]">
                  {new Date(post.updatedAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {post.status === "published" && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F291E] transition-colors hover:border-[#FF5C00]/40 hover:text-[#FF5C00]"
                      >
                        <ExternalLink size={12} /> View
                      </a>
                    )}
                    <button
                      onClick={() => onEdit(`/admin/blogs/${post._id}/edit`)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F291E] transition-colors hover:border-[#FF5C00]/40 hover:text-[#FF5C00]"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(post)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F291E] transition-colors hover:border-red-300 hover:text-red-500"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
