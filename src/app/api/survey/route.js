import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Waitlist from "@/models/Waitlist";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { contact } = await request.json();

    if (!contact?.name?.trim() || !contact?.email?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name and email are required" },
        { status: 400 },
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());
    if (!emailOk) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    await Waitlist.create({
      name: contact.name.trim(),
      location: contact.location?.trim() || "",
      email: contact.email.trim().toLowerCase(),
      phone: contact.phone?.trim() || "",
      instagram: contact.instagram?.trim() || "",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Waitlist API error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
