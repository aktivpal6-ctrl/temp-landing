// Explicit allowlist: public HTML and responses must never contain contact details.
export function publicEvent(event) {
  return {
    _id: String(event._id),
    slug: event.slug || "",
    title: event.title,
    description: event.description,
    location: event.location,
    location_link: event.location_link || "",
    start_time: event.start_time ? new Date(event.start_time).toISOString() : null,
    join_deadline: event.join_deadline ? new Date(event.join_deadline).toISOString() : null,
    duration: event.duration,
    difficulty: event.difficulty,
    images: Array.isArray(event.images) ? event.images : [],
    attendeeCount: Array.isArray(event.attendees) ? event.attendees.length : 0,
    updatedAt: event.updatedAt ? new Date(event.updatedAt).toISOString() : null,
  };
}

// Events listed before slugs existed keep the legacy link, which redirects to the event page.
export function eventPath(event) {
  return event.slug ? `/movement/${event.slug}` : `/movement?event=${event._id}`;
}

const TIME_FORMATS = {
  short: { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" },
  long: { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" },
};

// Activities happen in British Columbia, so times read in Pacific time wherever the viewer is.
export function formatEventTime(value, style = "long") {
  return new Date(value).toLocaleString("en-CA", { ...TIME_FORMATS[style], timeZone: "America/Vancouver", timeZoneName: "short" });
}

// Durations are free text ("2 hours", "90 min", "1.5 hrs", "3h 30m"); anything else
// ("Half day") has no reliable end time.
export function eventEndTime(event) {
  const text = String(event.duration || "").toLowerCase();
  const hours = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)(?![a-z])/);
  const minutes = text.match(/(\d+)\s*(?:minutes?|mins?|m)(?![a-z])/);
  if (!event.start_time || (!hours && !minutes)) return null;
  const total = (hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0);
  return new Date(new Date(event.start_time).getTime() + total * 60_000);
}

export function isPastEvent(event, now = new Date()) {
  const end = eventEndTime(event) || (event.start_time && new Date(event.start_time));
  return Boolean(end) && end < now;
}
