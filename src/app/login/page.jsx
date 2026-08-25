"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Logo } from "@/components/primitives";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) router.replace("/admin");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.ok) {
        router.replace("/admin");
      } else {
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF5C00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Logo size={48} showWord className="mx-auto" />
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F291E] text-[#F7F7F2]">
              <Lock size={18} />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-[#0F291E]">
                Admin Login
              </h1>
              <p className="text-xs text-[#4A524A]">Enter the admin password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full p-4 rounded-2xl border-2 border-black/10 bg-[#F7F7F2] focus:border-[#FF5C00] outline-none text-[15px]"
              data-testid="login-password"
            />

            {error && (
              <p
                className="text-xs font-semibold text-red-600"
                data-testid="login-error"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full p-4 rounded-2xl bg-[#FF5C00] text-white font-display font-bold text-[15px] transition-colors hover:bg-[#e64f00] disabled:opacity-40 disabled:cursor-not-allowed"
              data-testid="login-submit"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
