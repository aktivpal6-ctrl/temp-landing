import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import MovementPage from "@/views/MovementPage";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, pageSchema } from "@/lib/seo";

export const runtime = "nodejs";

export const metadata = pageMetadata("/movement");

async function getEvents() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ start_time: 1 }).lean();
    return events.map((e) => ({
      ...e,
      _id: String(e._id),
      start_time: e.start_time?.toISOString() || null,
      join_deadline: e.join_deadline?.toISOString() || null,
      createdAt: e.createdAt?.toISOString() || null,
      updatedAt: e.updatedAt?.toISOString() || null,
      attendees: Array.isArray(e.attendees)
        ? e.attendees.map((a) => ({
            ...a,
            joined_at: a.joined_at?.toISOString() || null,
          }))
        : [],
    }));
  } catch {
    return [];
  }
}

export default async function Page() {
  const events = await getEvents();
  return (
    <>
      <JsonLd data={pageSchema("/movement", "CollectionPage")} />
      <MovementPage initialEvents={events} />
    </>
  );
}
