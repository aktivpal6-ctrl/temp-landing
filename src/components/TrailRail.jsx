import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";

// Chapters map to section data-testids in reading order.
const CHAPTERS = [
  { id: "problem" },
  { id: "match-criteria" },
  { id: "how-it-works" },
  { id: "product-moment" },
  { id: "community" },
  { id: "activities" },
  { id: "safety" },
  { id: "final-cta" },
];

// Gentle serpentine "trail" path from top -> bottom of the viewport.
function buildTrail(h) {
  const top = 30;
  const bottom = h - 34;
  const cx = 22;
  const amp = 11;
  const seg = Math.max(5, Math.round((bottom - top) / 120));
  let d = `M ${cx} ${top}`;
  for (let i = 1; i <= seg; i++) {
    const y = top + (bottom - top) * (i / seg);
    const my = top + (bottom - top) * ((i - 0.5) / seg);
    const x = cx + (i % 2 ? amp : -amp);
    d += ` Q ${x.toFixed(1)} ${my.toFixed(1)} ${cx} ${y.toFixed(1)}`;
  }
  return d;
}

export const TrailRail = ({ chapters = CHAPTERS }) => {
  const reduce = useReducedMotion();
  const [vh, setVh] = useState(820);
  const pathRef = useRef(null);
  const [len, setLen] = useState(0);
  const [pt, setPt] = useState({ x: 22, y: 30 });
  const [progress, setProgress] = useState(0);
  const [waypoints, setWaypoints] = useState([]);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const set = () => setVh(window.innerHeight);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  const d = useMemo(() => buildTrail(vh), [vh]);

  useLayoutEffect(() => {
    if (pathRef.current) {
      const total = pathRef.current.getTotalLength();
      setLen(total);
      setPt(pathRef.current.getPointAtLength(scrollYProgress.get() * total));
    }
  }, [d]); // eslint-disable-line

  // Compute waypoint positions along the trail from each section's scroll offset.
  useEffect(() => {
    const compute = () => {
      const p = pathRef.current;
      if (!p) return;
      const total = p.getTotalLength();
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const wps = chapters.map((c) => {
        const el = document.querySelector(`[data-testid="${c.id}"]`);
        if (!el) return null;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const frac = Math.min(0.985, Math.max(0.01, top / maxScroll));
        const point = p.getPointAtLength(frac * total);
        return { ...c, frac, x: point.x, y: point.y };
      }).filter(Boolean);
      setWaypoints(wps);
    };
    const t1 = setTimeout(compute, 500);
    const t2 = setTimeout(compute, 1600);
    window.addEventListener("resize", compute);
    window.addEventListener("load", compute);
    return () => {
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener("resize", compute);
      window.removeEventListener("load", compute);
    };
  }, [d, vh]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setProgress(p);
    if (pathRef.current && len) setPt(pathRef.current.getPointAtLength(p * len));
  });

  return (
    <div
      className="pointer-events-none fixed right-3 top-0 z-40 h-screen w-[44px] hidden lg:block"
      aria-hidden data-testid="trail-rail"
    >
      <svg width="44" height={vh} viewBox={`0 0 44 ${vh}`} className="overflow-visible">
        {/* summit marker */}
        <path d="M22 12 L28 24 L16 24 Z" fill="rgba(15,41,30,0.35)" />
        {/* track */}
        <path ref={pathRef} d={d} fill="none" stroke="rgba(15,41,30,0.12)" strokeWidth="2" strokeLinecap="round" />
        <path d={d} fill="none" stroke="rgba(15,41,30,0.10)" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
        {/* traced progress */}
        <motion.path
          d={d} fill="none" stroke="#FF5C00" strokeWidth="2.6" strokeLinecap="round"
          pathLength={1} style={{ pathLength: scrollYProgress }}
        />
        {/* destination flag */}
        <g transform={`translate(22 ${vh - 30})`}>
          <line x1="0" y1="0" x2="0" y2="-14" stroke="rgba(15,41,30,0.35)" strokeWidth="1.5" />
          <path d="M0 -14 L9 -11 L0 -8 Z" fill="rgba(15,41,30,0.35)" />
        </g>
        {/* waypoint dots on the trail */}
        {waypoints.map((w) => {
          const active = progress >= w.frac - 0.008;
          return (
            <g key={w.id}>
              {active && (
                <circle cx={w.x} cy={w.y} r="7" fill="none" stroke="#FF5C00" strokeWidth="1.5" opacity="0.35" />
              )}
              <circle
                cx={w.x} cy={w.y} r="3.6"
                fill={active ? "#FF5C00" : "#F7F7F2"}
                stroke={active ? "#FF5C00" : "rgba(15,41,30,0.30)"}
                strokeWidth="1.5"
                style={{ transition: "fill 0.35s ease, stroke 0.35s ease" }}
              />
            </g>
          );
        })}
      </svg>

      {/* walking marker */}
      <motion.div
        className="absolute"
        style={{ left: pt.x - 7, top: pt.y - 7 }}
        animate={reduce ? {} : { scale: [1, 1.12, 1] }}
        transition={reduce ? {} : { repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <div className="w-3.5 h-3.5 rounded-full bg-[#FF5C00] ring-2 ring-white shadow-[0_0_12px_rgba(255,92,0,0.6)]" />
      </motion.div>
    </div>
  );
};
