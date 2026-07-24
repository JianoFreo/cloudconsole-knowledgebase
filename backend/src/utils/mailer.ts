// backend/src/utils/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function getRecipients(): string[] {
  return (process.env.ACCESS_NOTIFY_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

function buildAccessEmailHtml(details: { ip?: string; userAgent?: string; time: string }) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:24px;">
    <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
      <div style="background:#115e59; padding:20px 24px;">
        <h1 style="margin:0; font-size:16px; color:#ffffff;">CloudConsole Knowledgebase</h1>
      </div>
      <div style="padding:24px;">
        <p style="margin:0 0 12px; font-size:15px; color:#0f172a;">
          The primary access code (<strong>id 1</strong>) was just used to unlock the site.
        </p>
        <table style="width:100%; border-collapse:collapse; font-size:13px; color:#475569;">
          <tr>
            <td style="padding:6px 0; width:100px;">IP Address</td>
            <td style="padding:6px 0; color:#0f172a;">${details.ip ?? "unknown"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;">User-Agent</td>
            <td style="padding:6px 0; color:#0f172a;">${details.userAgent ?? "unknown"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;">Time</td>
            <td style="padding:6px 0; color:#0f172a;">${details.time}</td>
          </tr>
        </table>
      </div>
      <div style="background:#f8fafc; padding:14px 24px; border-top:1px solid #e5e7eb;">
        <p style="margin:0; font-size:11px; color:#94a3b8;">Automated notification — CloudConsole Knowledgebase</p>
      </div>
    </div>
  </div>`;
}

export async function sendAccessNotificationEmail(details: {
  ip?: string;
  userAgent?: string;
  time: string;
}) {
  const recipients = getRecipients();

  if (recipients.length === 0) {
    console.warn("ACCESS_NOTIFY_EMAIL is empty — skipping access notification email.");
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: recipients,
    subject: "Access code (id 1) was used",
    text: `The primary access code (id 1) was used to unlock the site.

IP: ${details.ip ?? "unknown"}
User-Agent: ${details.userAgent ?? "unknown"}
Time: ${details.time}`,
    html: buildAccessEmailHtml(details),
  });
}