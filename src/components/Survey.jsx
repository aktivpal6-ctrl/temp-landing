"use client";

import React, { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import Link from "next/link";
import { CTA } from "./primitives";
import { SURVEY } from "../data/survey";
const Ic = ({ name, ...p }) => {
  const C = Icons[name] || Icons.Circle;
  return <C {...p} />;
};

// Build the visible step list given current answers (conditional logic)
const buildSteps = answers => {
  return SURVEY.filter(q => {
    if (!q.condition) return true;
    const val = answers[q.condition.q];
    return q.condition.in.includes(val);
  });
};

const ChoiceCard = ({ label, selected, onClick, testId }) => (
  <motion.button
    type="button"
    data-testid={testId}
    onClick={onClick}
    whileTap={{ scale: 0.98 }}
    className={`w-full text-left flex items-center gap-4 p-5 rounded-2xl border-2 transition-colors ${
      selected
        ? "border-[#FF5C00] bg-[#FF5C00]/10"
        : "border-black/10 bg-white hover:border-[#FF5C00]/40 hover:bg-[#FF5C00]/[0.04]"
    }`}
  >
    <span
      className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
        selected ? "border-[#FF5C00] bg-[#FF5C00]" : "border-black/20"
      }`}
    >
      {selected && <Ic name="Check" size={14} className="text-white" />}
    </span>
    <span
      className={`font-semibold text-[15px] ${selected ? "text-[#0F291E]" : "text-[#1A1D1A]"}`}
    >
      {label}
    </span>
  </motion.button>
);

const Scale = ({ value, low, high, onChange, testId }) => (
  <div className="mt-2">
    <div className="flex items-center justify-between gap-2">
      {[1, 2, 3, 4, 5].map(n => (
        <motion.button
          key={n}
          type="button"
          data-testid={`${testId}-${n}`}
          onClick={() => onChange(n)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`flex-1 aspect-square max-w-[72px] rounded-2xl border-2 font-display font-black text-xl md:text-2xl flex items-center justify-center transition-colors ${
            value === n
              ? "border-[#FF5C00] bg-[#FF5C00] text-white"
              : "border-black/10 bg-white text-[#0F291E] hover:border-[#FF5C00]/40"
          }`}
        >
          {n}
        </motion.button>
      ))}
    </div>
    <div className="flex justify-between mt-3 text-xs font-semibold text-[#4A524A]">
      <span>{low}</span>
      <span>{high}</span>
    </div>
  </div>
);

export const Survey = ({ onComplete, standalone = false }) => {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [contactConfirmed, setContactConfirmed] = useState(false);
  const [answers, setAnswers] = useState({});
  const [others, setOthers] = useState({});
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    instagram: "",
  });
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const steps = useMemo(() => buildSteps(answers), [answers]);
  const total = steps.length;
  const q = steps[idx];
  const progress = done ? 100 : Math.round((idx / total) * 100);

  const setAns = useCallback(
    (id, val) => setAnswers(a => ({ ...a, [id]: val })),
    [],
  );

  const toggleMulti = (id, opt, max) => {
    setAnswers(a => {
      const cur = Array.isArray(a[id]) ? a[id] : [];
      if (cur.includes(opt)) return { ...a, [id]: cur.filter(x => x !== opt) };
      if (max && cur.length >= max) return a;
      return { ...a, [id]: [...cur, opt] };
    });
  };

  // Name, email and phone are required to enter the survey at all.
  // Instagram stays optional.
  const isContactValid = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());
    const phoneOk = /^[0-9+()\-\s]{7,}$/.test(contact.phone.trim());
    return contact.name.trim().length > 0 && emailOk && phoneOk;
  };

  const canProceed = () => {
    if (!q) return false;
    if (q.type === "textarea") return true; // optional-ish, allow skip
    if (q.type === "scale") return !!answers[q.id];
    if (q.type === "single") return !!answers[q.id];
    if (q.type === "multi")
      return Array.isArray(answers[q.id]) && answers[q.id].length > 0;
    return true;
  };

  const next = () => {
    if (idx < total - 1) {
      setDir(1);
      setIdx(i => i + 1);
    } else submit();
  };
  const back = () => {
    if (idx > 0) {
      setDir(-1);
      setIdx(i => i - 1);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setError(false);
    const payload = {
      answers: SURVEY.filter(s =>
        buildSteps(answers).find(v => v.id === s.id),
      ).map(s => {
        let ans = answers[s.id];
        if (s.allowOther && others[s.id]) {
          ans = Array.isArray(ans) ? [...ans, `Other: ${others[s.id]}`] : ans;
        }
        return { question: s.label, answer: ans ?? "" };
      }),
      contact,
    };
    // include q6 followup
    if (answers.q6b)
      payload.answers.push({
        question: SURVEY.find(x => x.id === "q6").followup.label,
        answer: answers.q6b,
      });

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setSubmitting(false);
      setDone(true);
      onComplete && onComplete();
    } catch (e) {
      console.log(e);

      setSubmitting(false);
      setError(true);
    }
  };

  const variants = {
    enter: d => (reduce ? { opacity: 0 } : { x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: d => (reduce ? { opacity: 0 } : { x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  const resetSurvey = () => {
    setStarted(false);
    setContactConfirmed(false);
    setAnswers({});
    setOthers({});
    setContact({ name: "", email: "", phone: "", instagram: "" });
    setIdx(0);
    setDir(1);
    setSubmitting(false);
    setDone(false);
    setError(false);
  };

  const sectionClasses = standalone
    ? "relative overflow-hidden"
    : "relative bg-[#F7F7F2] py-24 md:py-32 scroll-mt-4 overflow-hidden";

  const containerClasses = standalone
    ? "max-w-2xl mx-auto px-6 py-8 md:px-8 md:py-10 relative z-10"
    : "max-w-2xl mx-auto px-6 relative z-10";

  return (
    <section id="survey" className={sectionClasses} data-testid="survey">
      <div className={containerClasses}>
        {/* ---- Intro ---- */}
        {!started && !done && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">
              Help Build AKTIVPAL
            </span>
            <h2 className="mt-4 font-display font-black text-4xl md:text-6xl tracking-tighter text-[#1A1D1A] leading-[0.95]">
              We want to build this around what people actually need.
            </h2>
            <p className="mt-8 text-[15px] md:text-base text-[#4A524A] leading-relaxed max-w-xl mx-auto">
              We're building AKTIVPAL to help people find the right people to be
              active with—whether that's a hiking partner, running buddy, ski
              partner, cycling group, climbing partner, or simply someone who
              wants to get outside. Your answers will help us understand whether
              this is a problem worth solving—and what AKTIVPAL should actually
              become.
            </p>
            {standalone && (
              <p
                className="mt-4 text-sm font-semibold text-[#0F291E]"
                data-testid="survey-page-intro-note"
              >
                You can take the full survey here without leaving the rest of
                the landing page in the background.
              </p>
            )}
            <div className="mt-10">
              <CTA testId="survey-start-btn" onClick={() => setStarted(true)}>
                Tell us what you need <Ic name="ArrowRight" size={18} />
              </CTA>
            </div>
          </motion.div>
        )}

        {/* ---- Contact gate (required before the survey starts) ---- */}
        {started && !contactConfirmed && !done && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            data-testid="survey-contact-gate"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">
              Before we start
            </span>
            <h3 className="mt-3 font-display font-bold text-2xl md:text-3xl tracking-tight text-[#0F291E] leading-tight">
              How can we reach you?
            </h3>
            <p className="mt-2 text-sm font-semibold text-[#4A524A]">
              Name, email and phone are required. Instagram is optional.
            </p>

            <div className="mt-6 space-y-3">
              {[
                { k: "name", ph: "Name *", type: "text" },
                { k: "email", ph: "Email *", type: "email" },
                { k: "phone", ph: "Phone number *", type: "tel" },
                { k: "instagram", ph: "Instagram (optional)", type: "text" },
              ].map(f => (
                <input
                  key={f.k}
                  data-testid={`contact-${f.k}`}
                  placeholder={f.ph}
                  type={f.type}
                  value={contact[f.k]}
                  onChange={e =>
                    setContact(c => ({ ...c, [f.k]: e.target.value }))
                  }
                  className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white focus:border-[#FF5C00] outline-none text-[15px]"
                />
              ))}
              {!isContactValid() &&
                (contact.name || contact.email || contact.phone) && (
                  <p
                    className="text-xs font-semibold text-red-600"
                    data-testid="contact-validation-msg"
                  >
                    Enter a name, a valid email, and a valid phone number to
                    continue.
                  </p>
                )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                data-testid="survey-contact-back-btn"
                onClick={() => setStarted(false)}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F291E] hover:text-[#FF5C00] transition-colors"
              >
                <Ic name="ArrowLeft" size={16} /> Back
              </button>
              <CTA
                testId="survey-contact-continue-btn"
                onClick={() => {
                  if (isContactValid()) setContactConfirmed(true);
                }}
                className={
                  !isContactValid() ? "opacity-40 pointer-events-none" : ""
                }
              >
                Continue <Ic name="ArrowRight" size={16} />
              </CTA>
            </div>
          </motion.div>
        )}

        {/* ---- Form ---- */}
        {started && contactConfirmed && !done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-bold uppercase tracking-widest text-[#4A524A]"
                  data-testid="survey-progress-label"
                >
                  Question {idx + 1} of {total}
                </span>
                <span className="text-xs font-bold text-[#FF5C00]">
                  {progress}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-black/10 overflow-hidden">
                <motion.div
                  className="h-full bg-[#FF5C00] rounded-full"
                  animate={{ width: `${(idx / total) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="relative min-h-[360px]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={q.id}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {q.section && (
                    <div className="mb-4 rounded-xl bg-[#0F291E] text-[#F7F7F2] px-4 py-3 text-sm font-semibold flex items-center gap-2">
                      <Ic
                        name="ShieldCheck"
                        size={16}
                        className="text-[#FF5C00]"
                      />{" "}
                      {q.section}
                    </div>
                  )}
                  <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-[#0F291E] leading-tight">
                    {q.label}
                  </h3>
                  {q.hint && (
                    <p className="mt-2 text-sm font-semibold text-[#FF5C00]">
                      {q.hint}
                    </p>
                  )}

                  <motion.div
                    className="mt-6 space-y-3"
                    initial="hidden"
                    animate="show"
                    variants={{
                      show: { transition: { staggerChildren: 0.04 } },
                    }}
                  >
                    {/* SINGLE */}
                    {q.type === "single" &&
                      q.options.map(opt => (
                        <motion.div
                          key={opt}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            show: { opacity: 1, y: 0 },
                          }}
                        >
                          <ChoiceCard
                            label={opt}
                            selected={answers[q.id] === opt}
                            onClick={() => setAns(q.id, opt)}
                            testId={`survey-option-${q.id}-${opt.slice(0, 8)}`}
                          />
                        </motion.div>
                      ))}

                    {/* MULTI */}
                    {q.type === "multi" && (
                      <>
                        {q.options.map(opt => (
                          <motion.div
                            key={opt}
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              show: { opacity: 1, y: 0 },
                            }}
                          >
                            <ChoiceCard
                              label={opt}
                              selected={(answers[q.id] || []).includes(opt)}
                              onClick={() => toggleMulti(q.id, opt, q.max)}
                              testId={`survey-option-${q.id}-${opt.slice(0, 8)}`}
                            />
                          </motion.div>
                        ))}
                        {q.allowOther && (
                          <input
                            data-testid={`survey-other-${q.id}`}
                            placeholder="Other (optional)…"
                            value={others[q.id] || ""}
                            onChange={e =>
                              setOthers(o => ({ ...o, [q.id]: e.target.value }))
                            }
                            className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white focus:border-[#FF5C00] outline-none text-[15px]"
                          />
                        )}
                      </>
                    )}

                    {/* SCALE */}
                    {q.type === "scale" && (
                      <Scale
                        value={answers[q.id]}
                        low={q.low}
                        high={q.high}
                        onChange={n => setAns(q.id, n)}
                        testId={`survey-scale-${q.id}`}
                      />
                    )}

                    {/* TEXTAREA */}
                    {q.type === "textarea" && (
                      <textarea
                        data-testid={`survey-text-${q.id}`}
                        rows={q.emphasis ? 5 : 4}
                        placeholder="Type your answer…"
                        value={answers[q.id] || ""}
                        onChange={e => setAns(q.id, e.target.value)}
                        className={`w-full p-4 rounded-2xl border-2 bg-white outline-none text-[15px] leading-relaxed resize-none focus:border-[#FF5C00] ${
                          q.emphasis ? "border-[#FF5C00]/40" : "border-black/10"
                        }`}
                      />
                    )}

                    {/* q6 followup */}
                    {q.followup && (
                      <div className="pt-2">
                        <label className="block text-sm font-bold text-[#0F291E] mb-2">
                          {q.followup.label}
                        </label>
                        <textarea
                          data-testid="survey-text-q6b"
                          rows={3}
                          value={answers.q6b || ""}
                          onChange={e => setAns("q6b", e.target.value)}
                          placeholder="Optional, but really helpful…"
                          className="w-full p-4 rounded-2xl border-2 border-[#FF5C00]/40 bg-white outline-none text-[15px] resize-none focus:border-[#FF5C00]"
                        />
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* nav */}
            {error && (
              <p
                className="mt-4 text-sm font-semibold text-red-600 text-center"
                data-testid="survey-error"
              >
                Something went wrong sending your answers. Please tap Submit to
                try again.
              </p>
            )}
            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                data-testid="survey-back-btn"
                onClick={back}
                disabled={idx === 0}
                className={`inline-flex items-center gap-1.5 text-sm font-bold transition-colors ${
                  idx === 0
                    ? "text-black/20 cursor-not-allowed"
                    : "text-[#0F291E] hover:text-[#FF5C00]"
                }`}
              >
                <Ic name="ArrowLeft" size={16} /> Back
              </button>
              <CTA
                testId="survey-next-btn"
                onClick={next}
                className={
                  !canProceed() ? "opacity-40 pointer-events-none" : ""
                }
              >
                {submitting
                  ? "Sending…"
                  : idx === total - 1
                    ? "Submit"
                    : "Next"}
                {!submitting && (
                  <Ic
                    name={idx === total - 1 ? "Send" : "ArrowRight"}
                    size={16}
                  />
                )}
              </CTA>
            </div>
          </motion.div>
        )}

        {/* ---- Success ---- */}
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
            data-testid="survey-success"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="w-24 h-24 rounded-full bg-[#FF5C00] mx-auto flex items-center justify-center"
            >
              <motion.svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M4 12l5 5L20 6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                />
              </motion.svg>
            </motion.div>
            <h2 className="mt-8 font-display font-black text-4xl md:text-5xl tracking-tighter text-[#1A1D1A]">
              You're officially on our radar. 👋
            </h2>
            <p className="mt-5 text-lg text-[#4A524A] max-w-lg mx-auto leading-relaxed">
              Thanks for helping us build AKTIVPAL. We're starting in Canada
              with a simple idea: you shouldn't have to choose between staying
              home and going alone.
            </p>
            <p className="mt-4 text-[15px] text-[#4A524A] max-w-lg mx-auto">
              We'll use what we learn from this community to shape the first
              version of AKTIVPAL.
            </p>
            <p className="mt-8 font-display font-black text-2xl md:text-3xl text-[#0F291E]">
              You're one step closer to finding your{" "}
              <span className="text-[#FF5C00]">AKTIVPAL.</span>
            </p>
            <p className="mt-6 text-sm font-semibold tracking-wide text-[#4A524A]">
              "Find your people. Move together." — AKTIVPAL
            </p>
            {standalone && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0F291E]/12 px-6 py-3 text-sm font-bold text-[#0F291E] transition-colors hover:border-[#FF5C00]/40 hover:text-[#FF5C00]"
                  data-testid="survey-success-home-link"
                >
                  <Ic name="ArrowLeft" size={16} /> Back to landing page
                </Link>
                <button
                  type="button"
                  onClick={resetSurvey}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5C00] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e64f00]"
                  data-testid="survey-success-reset-btn"
                >
                  Submit another response <Ic name="RotateCcw" size={16} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};
