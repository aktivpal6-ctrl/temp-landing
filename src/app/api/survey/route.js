import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import { buildSurveyEmailHtml } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    console.log(
      process.env.SMTP_USER,
      process.env.SMTP_PASS,
      process.env.MAIL_TO,
    );

    const payload = await request.json();

    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const html = buildSurveyEmailHtml(payload);
    const contactName = payload?.contact?.name || "Unknown";

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.MAIL_TO,
      replyTo: payload?.contact?.email || undefined,
      subject: `New AKTIVPAL survey response — ${contactName}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
