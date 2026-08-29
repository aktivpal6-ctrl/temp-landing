"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

export const JoinButton = ({ eventId, joined, onJoin, onOpenJoinModal, testid, className = "" }) => {
  const [joining, setJoining] = useState(false);

  const disabled = joined || joining;

  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (onOpenJoinModal) {
      onOpenJoinModal(eventId);
    }
  };

  return (
    <motion.button
      type="button"
      data-testid={testid}
      onClick={handleClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.04 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-bold tracking-tight transition-colors duration-300 ${
        joined
          ? "cursor-default bg-[#0F291E] text-[#F7F7F2]"
          : "bg-[#FF5C00] text-white hover:bg-[#e64f00] disabled:opacity-70"
      } ${className}`}
    >
      {joining ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Joining
        </>
      ) : joined ? (
        <>
          <Check className="h-4 w-4" />
          Joined
        </>
      ) : (
        "Join"
      )}
    </motion.button>
  );
};
