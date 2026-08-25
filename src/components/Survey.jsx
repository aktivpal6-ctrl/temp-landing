"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CTA } from "./primitives";

const Ic = ({ name, ...p }) => {
  const C = Icons[name] || Icons.Circle;
  return <C {...p} />;
};

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  location: Yup.string().trim().required("Location is required"),
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  phone: Yup.string()
    .trim()
    .test("phone", "Enter a valid US or Canadian phone number", (value) => {
      if (!value) return true;
      const digits = value.replace(/\D/g, "");
      if (digits.length === 10) {
        return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
      }
      if (digits.length === 11 && digits.startsWith("1")) {
        return /^1[2-9]\d{2}[2-9]\d{6}$/.test(digits);
      }
      return false;
    }),
  instagram: Yup.string().trim(),
});

export const Survey = ({ onComplete, standalone = false }) => {
  const reduce = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      location: "",
      email: "",
      phone: "",
      instagram: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setError(false);

      try {
        const res = await fetch("/api/survey", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact: values }),
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
    },
  });

  const resetForm = () => {
    formik.resetForm();
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

  const fields = [
    { name: "name", placeholder: "Name *", type: "text" },
    { name: "location", placeholder: "Location *", type: "text" },
    { name: "email", placeholder: "Email *", type: "email" },
    { name: "phone", placeholder: "Phone number (optional)", type: "tel" },
    { name: "instagram", placeholder: "Instagram (optional)", type: "text" },
  ];

  return (
    <section id="survey" className={sectionClasses} data-testid="survey">
      <div className={containerClasses}>
        {/* ---- Form ---- */}
        {!done && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">
              Join the movement
            </span>
            <h3 className="mt-4 font-display font-black text-3xl md:text-4xl tracking-tight text-[#0F291E] leading-tight">
              Sign up to be an early member
            </h3>
            <p className="mt-3 text-[15px] text-[#4A524A] leading-relaxed max-w-lg">
              Enter your details below. We'll keep you updated on the launch and
              invite you to be one of the first to try AKTIVPAL.
            </p>

            <form onSubmit={formik.handleSubmit} className="mt-8 space-y-3" noValidate>
              {fields.map((f) => (
                <div key={f.name}>
                  <input
                    id={f.name}
                    name={f.name}
                    placeholder={f.placeholder}
                    type={f.type}
                    value={formik.values[f.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={submitting}
                    className="w-full p-4 rounded-2xl border-2 bg-white outline-none text-[15px] transition-colors focus:border-[#FF5C00] disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid={`contact-${f.name}`}
                  />
                  {formik.touched[f.name] && formik.errors[f.name] && (
                    <p
                      className="mt-1.5 text-xs font-semibold text-red-600"
                      data-testid={`error-${f.name}`}
                    >
                      {formik.errors[f.name]}
                    </p>
                  )}
                </div>
              ))}

              {error && (
                <p
                  className="text-sm font-semibold text-red-600 text-center"
                  data-testid="survey-error"
                >
                  Something went wrong. Please try again.
                </p>
              )}

              <div className="pt-4">
                <CTA
                  testId="survey-submit-btn"
                  type="submit"
                  disabled={submitting || !formik.isValid}
                  className={
                    submitting || !formik.isValid
                      ? "opacity-40 pointer-events-none"
                      : ""
                  }
                >
                  {submitting ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit <Ic name="Send" size={16} />
                    </>
                  )}
                </CTA>
              </div>
            </form>

            {/* ---- Loading Overlay ---- */}
            {submitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm"
              >
                <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#FF5C00] border-t-transparent" />
                <p className="mt-4 text-sm font-semibold text-[#0F291E]">
                  Submitting your details…
                </p>
                <p className="mt-1 text-xs text-[#4A524A]">
                  Hang tight, this won't take long.
                </p>
              </motion.div>
            )}
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
              You're officially on our radar.
            </h2>
            <p className="mt-5 text-lg text-[#4A524A] max-w-lg mx-auto leading-relaxed">
              Thanks for signing up. We're starting in Canada with a simple
              idea: you shouldn't have to choose between staying home and going
              alone.
            </p>
            <p className="mt-8 font-display font-black text-2xl md:text-3xl text-[#0F291E]">
              You're one step closer to finding your{" "}
              <span className="text-[#FF5C00]">AKTIVPAL.</span>
            </p>
            <p className="mt-6 text-sm font-semibold tracking-wide text-[#4A524A]">
              "Movement is better together." — AKTIVPAL
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
                  onClick={resetForm}
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
