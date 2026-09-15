import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import MovementPage from "@/views/MovementPage";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, pageSchema } from "@/lib/seo";
import { publicEvent } from "@/lib/public-event";

export const runtime = "nodejs";
// Database content must not become a permanent build-time snapshot.
export const dynamic = "force-dynamic";

export const metadata = pageMetadata("/movement");

async function getEvents() {
  try {
    await connectToDatabase();
    const events = await Event.find()
      .select("title description location location_link start_time join_deadline duration difficulty images attendees._id")
      .sort({ start_time: 1 }).lean();
    return { events: events.map(publicEvent), error: false };
  } catch {
    return { events: [], error: true };
  }
}

export default async function Page() {
  const { events, error } = await getEvents();
  return (
    <>
      <JsonLd data={pageSchema("/movement", "CollectionPage")} />
      <MovementPage initialEvents={events} initialLoadError={error} />
    </>
  );
}
