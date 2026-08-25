"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Users, RefreshCw, Search } from "lucide-react";
import { Logo } from "@/components/primitives";

export default function AdminPage() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist");
      const data = await res.json();
      if (data.ok) setEntries(data.data);
      else router.replace("/login");
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(`/api/auth/me`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) router.replace("/login");
        else fetchEntries();
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.name?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.phone?.toLowerCase().includes(q) ||
      e.instagram?.toLowerCase().includes(q)
    );
  });

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
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F291E] transition-colors hover:border-red-300 hover:text-red-600"
            data-testid="admin-logout"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5C00]/10 text-[#FF5C00]">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#4A524A]">Total signups</p>
              <p className="text-xl font-display font-black text-[#0F291E]">
                {entries.length}
              </p>
            </div>
          </div>

          <button
            onClick={fetchEntries}
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
            placeholder="Search by name, email, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-black/10 bg-white focus:border-[#FF5C00] outline-none text-[15px]"
            data-testid="admin-search"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF5C00] border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#4A524A] text-lg">
              {entries.length === 0 ? "No signups yet." : "No results match your search."}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[1.5rem] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[15px]" data-testid="admin-table">
                <thead>
                  <tr className="border-b border-black/10 bg-[#F7F7F2]">
                    <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">
                      Name
                    </th>
                    <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">
                      Location
                    </th>
                    <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">
                      Email
                    </th>
                    <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">
                      Phone
                    </th>
                    <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">
                      Instagram
                    </th>
                    <th className="px-5 py-4 font-display font-bold text-sm text-[#0F291E]">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => (
                    <tr
                      key={entry._id}
                      className="border-b border-black/5 last:border-0 hover:bg-[#FF5C00]/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4 font-semibold text-[#0F291E]">
                        {entry.name}
                      </td>
                      <td className="px-5 py-4 text-[#4A524A]">
                        {entry.location || "—"}
                      </td>
                      <td className="px-5 py-4 text-[#4A524A]">{entry.email}</td>
                      <td className="px-5 py-4 text-[#4A524A]">
                        {entry.phone || "—"}
                      </td>
                      <td className="px-5 py-4 text-[#4A524A]">
                        {entry.instagram || "—"}
                      </td>
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
        )}
      </main>
    </div>
  );
}
