import nodemailer from "nodemailer";

// SMTP transporter — configure via environment variables, don't hardcode credentials.
//   SMTP_HOST, SMTP_PORT, SMTP_SECURE ("true"/"false"), SMTP_USER, SMTP_PASS
//   MAIL_FROM (defaults to SMTP_USER), MAIL_TO (where responses land)
//
// Using Gmail? Swap this for:
//   nodemailer.createTransport({ service: "gmail", auth: { user, pass } })
// and use an App Password, not the account password — Gmail rejects plain
// SMTP auth from most setups now.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// This data comes straight from a public form — escape before it touches HTML.
const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatAnswer = answer => {
  if (Array.isArray(answer)) return answer.map(escapeHtml).join(", ");
  if (answer === "" || answer === null || answer === undefined) {
    return "<em>— no answer —</em>";
  }
  return escapeHtml(answer);
};

const CONTACT_FIELDS = ["name", "email", "phone", "instagram"];

export function buildSurveyEmailHtml({ answers = [], contact = {} }) {
  const answerRows = answers
    .map(
      a => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;font-weight:600;color:#0F291E;width:45%;vertical-align:top;">
          ${escapeHtml(a.question)}
        </td>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;color:#1A1D1A;vertical-align:top;">
          ${formatAnswer(a.answer)}
        </td>
      </tr>`,
    )
    .join("");

  const contactRows = CONTACT_FIELDS.filter(k => contact && contact[k])
    .map(
      k => `
      <tr>
        <td style="padding:8px 14px;font-weight:600;color:#0F291E;width:45%;">
          ${k.charAt(0).toUpperCase() + k.slice(1)}
        </td>
        <td style="padding:8px 14px;color:#1A1D1A;">${escapeHtml(contact[k])}</td>
      </tr>`,
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#F7F7F2;padding:24px;">
    <h2 style="color:#0F291E;margin:0 0 4px;">New AKTIVPAL survey response</h2>
    <p style="color:#4A524A;margin:0 0 20px;font-size:13px;">Submitted ${new Date().toLocaleString()}</p>

    <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td colspan="2" style="padding:10px 14px;background:#0F291E;color:#F7F7F2;font-weight:700;">
          Contact
        </td>
      </tr>
      ${contactRows || `<tr><td colspan="2" style="padding:10px 14px;color:#4A524A;">No contact info provided</td></tr>`}
    </table>

    <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;">
      <tr>
        <td colspan="2" style="padding:10px 14px;background:#FF5C00;color:#fff;font-weight:700;">
          Answers
        </td>
      </tr>
      ${answerRows}
    </table>
  </div>`;
}
