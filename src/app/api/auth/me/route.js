import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (!session) {
      return NextResponse.json({ ok: false, authenticated: false });
    }

    const token = verifyToken(session);
    if (!token) {
      return NextResponse.json({ ok: false, authenticated: false });
    }

    return NextResponse.json({ ok: true, authenticated: true });
  } catch (e) {
    return NextResponse.json({ ok: false, authenticated: false });
  }
}
