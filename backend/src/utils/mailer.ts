// backend/src/utils/mailer.ts
import nodemailer from "nodemailer";
import type { GeoInfo } from "./geoLookup.js";

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

interface AccessEmailDetails extends GeoInfo {
  userAgent?: string;
  referer?: string;
  language?: string;
  time: string;
}

function row(label: string, value: string | number | null | undefined) {
  return `
    <tr>
      <td style="padding:6px 0; width:110px; color:#64748b;">${label}</td>
      <td style="padding:6px 0; color:#0f172a;">${value || "unknown"}</td>
    </tr>`;
}

function buildAccessEmailHtml(d: AccessEmailDetails) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:24px;">
    <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
      <div style="background:#115e59; padding:20px 24px;">
        <h1 style="margin:0; font-size:16px; color:#ffffff;">CloudConsole Knowledgebase</h1>
      </div>
      <div style="padding:24px;">
        <p style="margin:0 0 16px; font-size:15px; color:#0f172a;">
          The primary access code (<strong>id 1</strong>) was just used to unlock the site.
        </p>
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          ${row("IP Address", d.ip)}
          ${row("Country", d.country)}
          ${row("Region", d.region)}
          ${row("City", d.city)}
          ${row("Postal", d.postal)}
          ${row("Timezone", d.timezone)}
          ${row("ISP", d.isp)}
          ${row("Latitude", d.latitude)}
          ${row("Longitude", d.longitude)}
          ${row("User-Agent", d.userAgent)}
          ${row("Referer", d.referer)}
          ${row("Language", d.language)}
          ${row("Time", d.time)}
        </table>
      </div>
      <div style="background:#f8fafc; padding:14px 24px; border-top:1px solid #e5e7eb;">
        <p style="margin:0; font-size:11px; color:#94a3b8;">Automated notification — CloudConsole Knowledgebase</p>
      </div>
    </div>
  </div>`;
}

export async function sendAccessNotificationEmail(details: AccessEmailDetails) {
  const recipients = getRecipients();

  if (recipients.length === 0) {
    console.warn("ACCESS_NOTIFY_EMAIL is empty — skipping access notification email.");
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: recipients,
    subject: "Access code (id 1) was used",
    text: `Access code (id 1) used.
IP: ${details.ip}
Country: ${details.country}
Region: ${details.region}
City: ${details.city}
ISP: ${details.isp}
Time: ${details.time}`,
    html: buildAccessEmailHtml(details),
  });
}