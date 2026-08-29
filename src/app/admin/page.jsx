"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Users, RefreshCw, Search, Calendar, Pencil, Trash2, Eye,
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
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("waitlist");

  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
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

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) router.replace("/login");
        else {
          fetchEntries();
          fetchEvents();
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
    setDeleting(true);
    try {
      const res = await fetch(`/api/events/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setEvents((prev) => prev.filter((e) => e._id !== deleteTarget._id));
      toast.success("Event deleted");
    } catch {
      toast.error("Failed to delete event");
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

  const loading = activeTab === "waitlist" ? entriesLoading : eventsLoading;
  const items = activeTab === "waitlist" ? filteredEntries : filteredEvents;

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F7F7F2]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={32} showWord />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#FF5C00] px-3 py-1 rounded-full border border-[#FF5C00]/20 bg-[#FF5C00]/5">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
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
          className="mb-6 flex items-center gap-2"
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
              {key === "events" && (
                <span className="ml-1 rounded-full bg-[#FF5C00] px-2 py-0.5 text-xs font-bold text-white">
                  {events.length}
                </span>
              )}
              {key === "waitlist" && (
                <span className="ml-1 rounded-full bg-[#FF5C00] px-2 py-0.5 text-xs font-bold text-white">
                  {entries.length}
                </span>
              )}
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
              {activeTab === "waitlist" ? <Users size={18} /> : <Calendar size={18} />}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#4A524A]">
                {activeTab === "waitlist" ? "Total signups" : "Total events"}
              </p>
              <p className="text-xl font-display font-black text-[#0F291E]">
                {activeTab === "waitlist" ? entries.length : events.length}
              </p>
            </div>
          </div>

          <button
            onClick={activeTab === "waitlist" ? fetchEntries : fetchEvents}
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
            placeholder={activeTab === "waitlist" ? "Search by name, email, location..." : "Search by title, location..."}
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
              {activeTab === "waitlist"
                ? (entries.length === 0 ? "No signups yet." : "No results match your search.")
                : (events.length === 0 ? "No events yet." : "No results match your search.")}
            </p>
          </div>
        ) : activeTab === "waitlist" ? (
          <WaitlistTable entries={filteredEntries} />
        ) : (
          <EventsTable events={filteredEvents} onEdit={router.push} onDelete={setDeleteTarget} onViewAttendees={setAttendeesEvent} />
        )}
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event</AlertDialogTitle>
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
