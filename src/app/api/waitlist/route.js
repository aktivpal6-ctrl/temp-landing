import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import Waitlist from "@/models/Waitlist";

export const runtime = "nodejs";

export async function GET() {
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

    await connectToDatabase();

    const entries = await Waitlist.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, data: entries });
  } catch (e) {
    console.error("Waitlist fetch error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
