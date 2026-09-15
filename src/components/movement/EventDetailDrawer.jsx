"use client";

import { Clock, MapPin, Timer, Users, X, ExternalLink, Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { ImageCarousel } from "./ImageCarousel";
import { JoinButton } from "./JoinButton";
import { Kicker } from "@/components/about/motion";
import { DIFFICULTY_STYLES } from "./constants";
import { GoogleMapPreview } from "./GoogleMapPreview";

const DetailRow = ({ icon: Icon, label, value, testid }) => (
  <div data-testid={testid} className="flex items-start gap-3 border-b border-[#0F291E]/10 py-4">
    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#FF5C00]/10 text-[#FF5C00]">
      <Icon className="h-4 w-4" />
    </span>
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F291E]/50">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#0F291E]">{value}</p>
    </div>
  </div>
);

function ShareButton({ eventId }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/movement?event=${eventId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="absolute right-16 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-[#0F291E]/55 text-white backdrop-blur-md transition-colors duration-300 hover:bg-[#0F291E]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      aria-label="Share event"
    >
      {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
    </button>
  );
}

export const EventDetailDrawer = ({ event, open, onOpenChange, onOpenJoinModal, joined = false }) => {
  const fullDate = event
    ? new Date(event.start_time).toLocaleString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Vancouver",
        timeZoneName: "short",
      })
    : "";

  const deadlineLabel = event?.join_deadline
    ? new Date(event.join_deadline).toLocaleString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Vancouver",
        timeZoneName: "short",
      })
    : "";

  const deadline = event?.join_deadline || event?.start_time;
  const joinExpired = deadline && new Date(deadline) < new Date();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        data-testid="event-detail-drawer"
        data-lenis-prevent
        className="w-full overflow-y-auto border-l border-[#0F291E]/10 bg-[#F7F7F2] p-0 sm:max-w-md"
      >
        {event && (
          <div className="flex min-h-full flex-col">
            <SheetClose
              data-testid="detail-close-btn"
              className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-[#0F291E]/55 text-white backdrop-blur-md transition-colors duration-300 hover:bg-[#0F291E]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </SheetClose>
            <ShareButton eventId={event._id} />
            <div className="relative aspect-[4/3] w-full shrink-0">
              <ImageCarousel images={event.images} alt={event.title} testid={`detail-${event._id}-carousel`} />
              <span
                data-testid="detail-difficulty"
                className={`absolute left-5 top-5 z-10 rounded-full border px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.16em] backdrop-blur-sm ${DIFFICULTY_STYLES[event.difficulty]}`}
              >
                {event.difficulty}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <Kicker>Event details</Kicker>
              <SheetTitle
                data-testid="detail-title"
                className="mt-4 font-display text-3xl font-black leading-tight tracking-tight text-[#0F291E]"
              >
                {event.title}
              </SheetTitle>
              <SheetDescription data-testid="detail-description" className="mt-4 text-base leading-relaxed text-[#4A524A]">
                {event.description}
              </SheetDescription>

              <div className="mt-6">
                <DetailRow
                  icon={MapPin}
                  label="Location"
                  value={
                    event.location_link ? (
                      <a
                        href={event.location_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-[#FF5C00] transition-colors"
                      >
                        {event.location}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      event.location
                    )
                  }
                  testid="detail-location"
                />
                <DetailRow icon={Clock} label="Start time" value={fullDate} testid="detail-start-time" />
                <DetailRow icon={Timer} label="Duration" value={event.duration} testid="detail-duration" />
                <DetailRow
                  icon={Users}
                  label="Attendees"
                  value={
                    <span>
                      <span data-testid="detail-attendees-count">{event.attendeeCount || 0}</span> going
                    </span>
                  }
                  testid="detail-attendees"
                />
                {deadlineLabel && (
                  <DetailRow
                    icon={Clock}
                    label="Join deadline"
                    value={
                      <span className={joinExpired ? "text-red-500" : ""}>
                        {deadlineLabel}
                        {joinExpired && " (closed)"}
                      </span>
                    }
                    testid="detail-join-deadline"
                  />
                )}
                <GoogleMapPreview location={event.location} locationLink={event.location_link} />
              </div>

              <div className="mt-auto pt-8">
                {joinExpired ? (
                  <div data-testid="detail-join-closed" className="rounded-2xl bg-[#0F291E]/5 px-5 py-4 text-center">
                    <p className="text-sm font-semibold text-[#0F291E]/50">
                      Joining is closed for this event.
                    </p>
                    <p className="mt-1 text-xs text-[#0F291E]/35">
                      The deadline to join has passed.
                    </p>
                  </div>
                ) : (
                  <JoinButton
                    eventId={event._id}
                    joined={joined}
                    onOpenJoinModal={onOpenJoinModal}
                    testid="detail-join-btn"
                    className="w-full !py-4 !text-base"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
