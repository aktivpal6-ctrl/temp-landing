import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  return transporter;
}

export async function verifyMailConnection() {
  try {
    await getTransporter().verify();
    console.log("✓ Mail transporter verified");
    return true;
  } catch (err) {
    console.error("✗ Mail transporter failed:", err.message);
    return false;
  }
}

function formatEventDate(date) {
  return new Date(date).toLocaleString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function sendJoinConfirmation(event, attendee) {
  const transporter = getTransporter();

  const startLabel = formatEventDate(event.start_time);
  const deadlineLabel = event.join_deadline ? formatEventDate(event.join_deadline) : null;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#F7F7F2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="margin:0;font-size:28px;font-weight:900;color:#0F291E;letter-spacing:-0.5px;">You're In!</h1>
        </div>

        <div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid rgba(15,41,30,0.08);">
          <p style="margin:0 0 24px;font-size:16px;color:#4A524A;">
            Hey <strong>${attendee.name}</strong>,
          </p>
          <p style="margin:0 0 24px;font-size:16px;color:#4A524A;">
            You've successfully joined <strong>${event.title}</strong>. Here are the details:
          </p>

          ${event.description ? `
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4A524A;">
            ${event.description}
          </p>
          ` : ""}

          <div style="background:#F7F7F2;border-radius:12px;padding:24px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;font-size:13px;font-weight:700;color:#0F291E;text-transform:uppercase;letter-spacing:0.1em;">Location</td>
                <td style="padding:8px 0;font-size:15px;color:#4A524A;text-align:right;">
                  ${event.location_link
                    ? `<a href="${event.location_link}" style="color:#FF5C00;text-decoration:none;">${event.location} &#8599;</a>`
                    : event.location}
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:13px;font-weight:700;color:#0F291E;text-transform:uppercase;letter-spacing:0.1em;">Start Time</td>
                <td style="padding:8px 0;font-size:15px;color:#4A524A;text-align:right;">${startLabel}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:13px;font-weight:700;color:#0F291E;text-transform:uppercase;letter-spacing:0.1em;">Duration</td>
                <td style="padding:8px 0;font-size:15px;color:#4A524A;text-align:right;">${event.duration}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:13px;font-weight:700;color:#0F291E;text-transform:uppercase;letter-spacing:0.1em;">Difficulty</td>
                <td style="padding:8px 0;font-size:15px;color:#4A524A;text-align:right;">${event.difficulty}</td>
              </tr>
              ${deadlineLabel ? `
              <tr>
                <td style="padding:8px 0;font-size:13px;font-weight:700;color:#0F291E;text-transform:uppercase;letter-spacing:0.1em;">Join Deadline</td>
                <td style="padding:8px 0;font-size:15px;color:#4A524A;text-align:right;">${deadlineLabel}</td>
              </tr>
              ` : ""}
            </table>
          </div>

          <p style="margin:0 0 8px;font-size:14px;color:#4A524A;">
            See you there! 🏔️
          </p>
        </div>

        <p style="margin:32px 0 0;font-size:12px;color:#0F291E;text-align:center;opacity:0.5;">
          AKTIVPAL — Find your next move together.
        </p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.GOOGLE_EMAIL,
    to: attendee.email,
    subject: `You're in — ${event.title} | AKTIVPAL`,
    html,
  });
}
