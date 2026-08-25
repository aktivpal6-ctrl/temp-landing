import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signToken, createToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { ok: false, error: "Password is required" },
        { status: 400 },
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { ok: false, error: "Admin not configured" },
        { status: 500 },
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { ok: false, error: "Invalid password" },
        { status: 401 },
      );
    }

    const token = createToken();
    const signed = signToken(token);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", signed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Login error:", e.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
