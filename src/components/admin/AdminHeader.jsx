"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/primitives";

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F7F7F2]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <Logo size={32} showWord />
          <span className="rounded-full border border-[#FF5C00]/20 bg-[#FF5C00]/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5C00]">
            Admin
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
  );
}
