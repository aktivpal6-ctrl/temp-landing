import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";

export const runtime = "nodejs";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) return null;
  const { verifyToken } = await import("@/lib/auth");
  return verifyToken(session);
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const event = await Event.findById(id).lean();
    if (!event) {
      return NextResponse.json({ ok: false, error: "Event not found" }, { status: 404 });
    }

    event.attendees = Array.isArray(event.attendees) ? event.attendees : [];

    return NextResponse.json(event);
  } catch (e) {
    console.error("Event fetch error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const token = await requireAdmin();
    if (!token) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, location, location_link, start_time, duration, difficulty, images, join_deadline } = body;

    if (!title?.trim() || !description?.trim() || !location?.trim() || !start_time || !duration?.trim() || !difficulty) {
      return NextResponse.json(
        { ok: false, error: "Title, description, location, start time, duration, and difficulty are required" },
        { status: 400 },
      );
    }

    const validDifficulties = ["Beginner", "Moderate", "Expert"];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { ok: false, error: "Difficulty must be Beginner, Moderate, or Expert" },
        { status: 400 },
      );
    }

    const startDate = new Date(start_time);
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { ok: false, error: "Invalid start time" },
        { status: 400 },
      );
    }

    const joinDeadline = join_deadline && join_deadline.trim() ? new Date(join_deadline) : null;
    if (joinDeadline && isNaN(joinDeadline.getTime())) {
      return NextResponse.json(
        { ok: false, error: "Invalid join deadline" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const event = await Event.findByIdAndUpdate(
      id,
      {
        $set: {
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          location_link: location_link?.trim() || "",
          start_time: startDate,
          duration: duration.trim(),
          difficulty,
          images: Array.isArray(images) ? images.filter((img) => typeof img === "string" && img.trim()) : [],
          join_deadline: joinDeadline,
        },
      },
      { new: true },
    ).lean();

    if (!event) {
      return NextResponse.json({ ok: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: event });
  } catch (e) {
    console.error("Event update error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const token = await requireAdmin();
    if (!token) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const event = await Event.findByIdAndDelete(id).lean();
    if (!event) {
      return NextResponse.json({ ok: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Event delete error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
