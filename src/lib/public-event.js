// Explicit allowlist: public HTML and responses must never contain contact details.
export function publicEvent(event) {
  return {
    _id: String(event._id),
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
  };
}
