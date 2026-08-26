import React, { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// AKTIVPAL logo mark — mountain peak + sun, dark green & orange
export const Logo = ({ size = 40, showWord = false, light = false }) => (
  <div className="flex items-center gap-2.5" data-testid="ap-logo">
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="AKTIVPAL">
      <circle cx="50" cy="24" r="11" fill="#FF5C00" />
      <path
        d="M50 30 L82 76 a4 4 0 0 1 -3.4 6 H63 L52 63 a2.4 2.4 0 0 0 -4 0 L37 82 H21.4 a4 4 0 0 1 -3.4 -6 Z"
        fill={light ? "#F7F7F2" : "#0F291E"}
      />
    </svg>
    {showWord && (
      <span
        className={`font-display font-extrabold tracking-tight text-xl ${light ? "text-[#F7F7F2]" : "text-[#0F291E]"}`}
      >
        AKTIVPAL
      </span>
    )}
  </div>
);

// Scroll reveal wrapper — CSS animation driven by IntersectionObserver (iOS-safe)
export const Reveal = ({ children, delay = 0, y = 28, x = 0, className = "", as = "div" }) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reduce || inView) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-80px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce, inView]);

  const revealClass = x > 0 ? "ap-reveal-right" : "ap-reveal";
  const motionClass = inView ? `${revealClass} ap-in-view` : revealClass;

  // Framer Motion still drives the spring feel when available;
  // CSS class is the fallback that guarantees visibility on iOS.
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      ref={ref}
      className={`${motionClass} ${className}`}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : undefined}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
};

// Staggered container/item — CSS + Framer Motion hybrid for iOS safety
export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
export const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Wrapper that ensures stagger children become visible via CSS even if
// Framer Motion's whileInView never fires on iOS in-app browsers.
export const Stagger = ({ children, className = "", margin = "-60px" }) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reduce || inView) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce, inView, margin]);

  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin }}
      className={className}
      style={
        inView
          ? undefined
          : reduce
            ? { opacity: 1 }
            : { opacity: 0 }
      }
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              className: `${child.props.className || ""} ap-stagger-item${inView ? " ap-in-view" : ""}`,
            })
          : child,
      )}
    </motion.div>
  );
};

// Line-by-line masked reveal for headlines — pure CSS animation for iOS reliability
export const MaskedLines = ({ lines, className = "", delay = 0 }) => {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span
            className="block"
            style={
              reduce
                ? { opacity: 1 }
                : {
                    transform: "translateY(110%)",
                    animation: `masked-reveal 0.75s ${delay + i * 0.11}s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                  }
            }
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
};

export const Marquee = ({ text, light = true }) => {
  const words = Array(8).fill(text);
  return (
    <div className="overflow-hidden py-2 select-none" aria-hidden>
      <div className="marquee-track">
        {words.concat(words).map((w, i) => (
          <span
            key={i}
            className={`font-display font-black text-6xl md:text-8xl px-6 ${light ? "stroke-text" : "stroke-text-green"}`}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
};

// Brand pill button with tactile motion
export const CTA = React.forwardRef(
  ({ children, variant = "orange", onClick, className = "", testId, type = "button", disabled }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold tracking-tight px-7 py-4 text-sm md:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/50";
    const styles = {
      orange: "bg-[#FF5C00] text-white hover:bg-[#e64f00]",
      green: "bg-[#0F291E] text-[#F7F7F2] hover:bg-[#16382A]",
      ghost: "bg-transparent text-[#0F291E] border-2 border-[#0F291E]/15 hover:border-[#0F291E]/40",
      lightGhost: "bg-white/10 text-white border border-white/25 hover:bg-white/20",
    };
    return (
      <motion.button
        ref={ref}
        type={type}
        data-testid={testId}
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className={`${base} ${styles[variant]} ${className}`}
      >
        {children}
      </motion.button>
    );
  }
);

export const scrollToWaitlist = () => {
  if (window.location.pathname !== "/waitlist") {
    window.location.assign("/waitlist");
    return;
  }
  const el = document.getElementById("waitlist");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};
