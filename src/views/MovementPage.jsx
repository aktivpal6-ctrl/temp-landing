"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Lenis from "lenis";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Compass } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/about/Footer";
import { Kicker, MaskedLines } from "@/components/about/motion";
import { EventCard } from "@/components/movement/EventCard";
import { EventDetailDrawer } from "@/components/movement/EventDetailDrawer";
import { JoinModal } from "@/components/movement/JoinModal";

const HERO_IMG =
  "https://images.unsplash.com/photo-1627289496743-8a9a08bb228a?crop=entropy&cs=srgb&fm=jpg&w=2000&q=85";

const CardSkeleton = () => (
  <div className="overflow-hidden rounded-[1.75rem] border border-[#0F291E]/10 bg-white shadow-[0_18px_50px_rgba(15,41,30,0.08)]">
    <div className="aspect-[16/10] w-full animate-pulse bg-[#0F291E]/10" />
    <div className="space-y-4 p-6">
      <div className="h-6 w-3/4 animate-pulse rounded-full bg-[#0F291E]/10" />
      <div className="h-4 w-full animate-pulse rounded-full bg-[#0F291E]/10" />
      <div className="h-4 w-1/2 animate-pulse rounded-full bg-[#0F291E]/10" />
    </div>
  </div>
);

export default function MovementPage({ initialEvents = [] }) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(initialEvents.length === 0);
  const [loadError, setLoadError] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [joinedIds, setJoinedIds] = useState(() => new Set());
  const [joinModalEventId, setJoinModalEventId] = useState(null);
  const [initialEventId, setInitialEventId] = useState(null);

  useEffect(() => {
    setInitialEventId(new URLSearchParams(window.location.search).get("event"));
  }, []);

  const openDrawer = useCallback((id) => {
    setSelectedId(id);
    router.replace(`/movement?event=${id}`, { scroll: false });
  }, [router]);

  const closeDrawer = useCallback(() => {
    setSelectedId(null);
    router.replace("/movement", { scroll: false });
  }, [router]);

  const selectedEvent = events.find((e) => e._id === selectedId) || null;
  const joinModalEvent = events.find((e) => e._id === joinModalEventId) || null;

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let rafId;
    const loop = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (initialEvents.length > 0) {
      setLoading(false);
      return;
    }
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) throw new Error("Event feed unavailable");
        setEvents(data);
      } catch {
        setLoadError(true);
        toast.error("Couldn't load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [initialEvents.length]);

  useEffect(() => {
    if (!loading && initialEventId && events.length > 0) {
      const exists = events.some((e) => e._id === initialEventId);
      if (exists) {
        setSelectedId(initialEventId);
      }
    }
  }, [loading, initialEventId, events]);

  const handleJoin = async (id, { name, phone, email } = {}) => {
    if (joinedIds.has(id)) return;
    const res = await fetch(`/api/events/${id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Couldn't join event. Please try again.");
    }
    setEvents((prev) => prev.map((e) => (e._id === id ? data : e)));
    setJoinedIds((prev) => new Set(prev).add(id));
    toast.success("You're in — see you there! Check your email for confirmation.");
  };

  return (
    <div className="relative min-h-screen bg-[#F7F7F2] text-[#1A1D1A]">
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[1]" />
      <Nav />
      <main>
        <section data-testid="movement-hero" className="relative flex min-h-[70vh] items-end overflow-hidden bg-[#0F291E]">
          <motion.img
            src={HERO_IMG}
            alt="A group of hikers crossing an open mountain meadow"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F291E]/70 via-[#0F291E]/55 to-[#0F291E]" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-40">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Kicker>Movement — Events</Kicker>
            </motion.div>
            <h1 className="mt-6 font-display text-5xl font-black leading-[1.02] tracking-tight text-[#F7F7F2] sm:text-6xl md:text-7xl">
              <MaskedLines lines={["Find your next", "move together."]} delay={0.35} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-[#F7F7F2]/65"
            >
              Explore walks, hikes and runs in British Columbia, Canada. Check each activity for its location, pace and meeting details before joining.
            </motion.p>
          </div>
        </section>

        <section data-testid="events-section" className="relative py-20 md:py-28">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="mb-12 flex items-center gap-3">
              <Compass className="h-5 w-5 text-[#FF5C00]" />
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-[#0F291E] md:text-3xl">
                Upcoming activities in British Columbia
              </h2>
            </div>

            <p className="mb-8 max-w-2xl leading-relaxed text-[#4A524A]">
              AKTIVPAL is starting in British Columbia. Browse listed activities below,{" "}
              <Link href="/waitlist" className="underline underline-offset-4">join early access in Canada</Link>
              {" or "}
              <Link href="/about" className="underline underline-offset-4">read our story</Link>.
            </p>
            <div data-testid="events-grid" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                : events.map((event, i) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onOpenJoinModal={setJoinModalEventId}
                      onOpen={openDrawer}
                      joined={joinedIds.has(event._id)}
                      index={i}
                    />
                  ))}
            </div>

            {loadError && (
              <p role="status" className="py-16 text-center text-[#4A524A]">
                Event details are loading. Please refresh the page to see the latest activities.
              </p>
            )}
            {!loading && !loadError && events.length === 0 && (
              <p data-testid="events-empty" className="py-16 text-center text-base font-medium text-[#4A524A]">
                New activities in British Columbia are added regularly. Check back soon or join the waitlist to be notified when new events are announced.
              </p>
            )}

            <noscript>
              <p className="py-16 text-center text-[#4A524A]">
                AKTIVPAL organises outdoor activities including walks, hikes and runs in British Columbia, Canada.
                Enable JavaScript to view upcoming events and join activities.
              </p>
            </noscript>
          </div>
        </section>
      </main>
      <Footer />

      <EventDetailDrawer
        event={selectedEvent}
        open={Boolean(selectedId)}
        onOpenChange={(o) => !o && closeDrawer()}
        onOpenJoinModal={setJoinModalEventId}
        joined={selectedId ? joinedIds.has(selectedId) : false}
      />

      <JoinModal
        event={joinModalEvent}
        open={Boolean(joinModalEventId)}
        onOpenChange={(o) => {
          if (!o) setJoinModalEventId(null);
        }}
        onJoin={handleJoin}
      />
    </div>
  );
}
