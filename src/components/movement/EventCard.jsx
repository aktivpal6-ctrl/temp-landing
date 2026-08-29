"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Timer, Users, ExternalLink } from "lucide-react";
import { ImageCarousel } from "./ImageCarousel";
import { JoinButton } from "./JoinButton";
import { DIFFICULTY_STYLES } from "./constants";

const EASE = [0.22, 1, 0.36, 1];

const MetaRow = ({ icon: Icon, children, testid }) => (
  <div data-testid={testid} className="flex items-center gap-2.5 text-sm font-medium text-[#4A524A]">
    <Icon className="h-4 w-4 shrink-0 text-[#FF5C00]" />
    <span>{children}</span>
  </div>
);

export const EventCard = ({ event, onOpenJoinModal, onOpen, joined = false, index = 0 }) => {
  const startLabel = new Date(event.start_time).toLocaleString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const deadline = event.join_deadline || event.start_time;
  const joinExpired = deadline && new Date(deadline) < new Date();

  return (
    <motion.article
      data-testid={`event-card-${event._id}`}
      onClick={() => onOpen(event._id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(event._id)}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: EASE }}
      className="flex cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-[#0F291E]/10 bg-white shadow-[0_18px_50px_rgba(15,41,30,0.08)] transition-shadow duration-500 hover:shadow-[0_28px_70px_rgba(15,41,30,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
    >
      <div className="relative aspect-[16/10] w-full">
        <ImageCarousel images={event.images} alt={event.title} testid={`event-${event._id}-carousel`} />
        <span
          data-testid={`event-${event._id}-difficulty`}
          className={`absolute left-4 top-4 z-10 rounded-full border px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.16em] backdrop-blur-sm ${DIFFICULTY_STYLES[event.difficulty]}`}
        >
          {event.difficulty}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3
          data-testid={`event-${event._id}-title`}
          className="font-display text-2xl font-extrabold leading-tight tracking-tight text-[#0F291E]"
        >
          {event.title}
        </h3>
        <p data-testid={`event-${event._id}-description`} className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#4A524A]">
          {event.description}
        </p>

        <div className="mt-6 space-y-3">
          <MetaRow icon={MapPin} testid={`event-${event._id}-location`}>
            {event.location_link ? (
              <a
                href={event.location_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 hover:text-[#FF5C00] transition-colors"
              >
                {event.location}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              event.location
            )}
          </MetaRow>
          <MetaRow icon={Clock} testid={`event-${event._id}-start-time`}>
            {startLabel}
          </MetaRow>
          <MetaRow icon={Timer} testid={`event-${event._id}-duration`}>
            {event.duration}
          </MetaRow>
        </div>

        <div className="mt-7 flex items-center justify-between border-t border-[#0F291E]/10 pt-5">
          <div data-testid={`event-${event._id}-attendees`} className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#0F291E]" />
            <span className="font-display text-lg font-extrabold text-[#0F291E]" data-testid={`event-${event._id}-attendees-count`}>
              {event.attendees?.length || 0}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0F291E]/50">going</span>
          </div>

          {joinExpired ? (
            <span data-testid={`event-${event._id}-join-closed`} className="text-sm font-semibold text-[#0F291E]/40">
              Joining closed
            </span>
          ) : (
            <JoinButton
              eventId={event._id}
              joined={joined}
              onOpenJoinModal={onOpenJoinModal}
              testid={`event-${event._id}-join-btn`}
            />
          )}
        </div>
      </div>
    </motion.article>
  );
};
