import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();

    const events = await Event.find()
      .sort({ start_time: 1 })
      .lean();

    const normalized = events.map((e) => ({
      ...e,
      attendees: Array.isArray(e.attendees) ? e.attendees : [],
    }));

    return NextResponse.json(normalized);
  } catch (e) {
    console.error("Events fetch error:", e.message);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (!session) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { verifyToken } = await import("@/lib/auth");
    const token = verifyToken(session);
    if (!token) {
      return NextResponse.json({ ok: false, error: "Invalid session" }, { status: 401 });
    }

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

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      location_link: location_link?.trim() || "",
      start_time: startDate,
      duration: duration.trim(),
      difficulty,
      images: Array.isArray(images) ? images.filter((img) => typeof img === "string" && img.trim()) : [],
      join_deadline: joinDeadline,
    });

    return NextResponse.json({ ok: true, data: event }, { status: 201 });
  } catch (e) {
    console.error("Event create error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
