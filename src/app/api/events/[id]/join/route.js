import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import { sendJoinConfirmation } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ ok: false, error: "Event ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { name, phone, email } = body;

    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name, phone, and email are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    const phoneDigits = phone.replace(/\D/g, "");
    const canadianPhoneRegex = /^(?:\+?1)?[2-9]\d{9}$/;
    if (!canadianPhoneRegex.test(phoneDigits)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid Canadian phone number (e.g. +1 416 555 1234)" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const event = await Event.findById(id).lean();
    if (!event) {
      return NextResponse.json({ ok: false, error: "Event not found" }, { status: 404 });
    }

    if (event.join_deadline && new Date(event.join_deadline) < new Date()) {
      return NextResponse.json(
        { ok: false, error: "Joining is closed for this event" },
        { status: 410 },
      );
    }

    const attendees = Array.isArray(event.attendees) ? event.attendees : [];

    if (!Array.isArray(event.attendees)) {
      await Event.findByIdAndUpdate(id, { $set: { attendees: [] } });
    }

    const emailExists = attendees.some(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (emailExists) {
      return NextResponse.json(
        { ok: false, error: "You have already joined with this email" },
        { status: 409 },
      );
    }

    const phoneExists = attendees.some(
      (a) => a.phone === phone.trim(),
    );
    if (phoneExists) {
      return NextResponse.json(
        { ok: false, error: "You have already joined with this phone number" },
        { status: 409 },
      );
    }

    const attendee = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      joined_at: new Date(),
    };

    const updated = await Event.findByIdAndUpdate(
      id,
      { $push: { attendees: attendee } },
      { new: true },
    ).lean();

    sendJoinConfirmation(
      { ...event, _id: event._id.toString() },
      attendee,
    ).catch((err) => console.error("Failed to send join confirmation email:", err.message));

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Event join error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
