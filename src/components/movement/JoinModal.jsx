"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const JoinModal = ({ event, open, onOpenChange, onJoin }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setError("");
  };

  const handleClose = (val) => {
    if (!submitting) {
      reset();
      onOpenChange(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    const canadianPhoneRegex = /^(?:\+?1)?[2-9]\d{9}$/;
    if (!canadianPhoneRegex.test(phoneDigits)) {
      setError("Please enter a valid Canadian phone number (e.g. +1 416 555 1234).");
      return;
    }

    setSubmitting(true);
    try {
      await onJoin(event._id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-[#0F291E]/10 bg-white">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-[#0F291E]">
            Join {event.title}
          </DialogTitle>
          <DialogDescription className="text-[#4A524A]">
            Fill in your details to confirm your spot. We&apos;ll send a confirmation to your email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="join-name" className="text-sm font-bold text-[#0F291E]">
              Full name
            </Label>
            <Input
              id="join-name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="border-black/10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="join-phone" className="text-sm font-bold text-[#0F291E]">
              Phone number
            </Label>
            <Input
              id="join-phone"
              type="tel"
              placeholder="+1 416 555 1234"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting}
              className="border-black/10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="join-email" className="text-sm font-bold text-[#0F291E]">
              Email address
            </Label>
            <Input
              id="join-email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="border-black/10"
              required
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#FF5C00] px-6 py-3 font-display text-sm font-bold text-white transition-colors hover:bg-[#e64f00] disabled:opacity-70"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirming...
              </span>
            ) : (
              "Confirm & Join"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
