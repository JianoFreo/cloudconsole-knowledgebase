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

type AccessEmailDetails = {
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  postal?: string;
  timezone?: string;
  isp?: string;
  latitude?: number | null;
  longitude?: number | null;
  userAgent?: string;
  referer?: string;
  language?: string;
  time: string;
};

function buildAccessEmailHtml(details: AccessEmailDetails) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:24px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
      <div style="background:#115e59; padding:20px 24px;">
        <h1 style="margin:0; font-size:16px; color:#ffffff;">
          CloudConsole Knowledgebase
        </h1>
      </div>

      <div style="padding:24px;">
        <p style="margin:0 0 16px; font-size:15px; color:#0f172a;">
          The primary access code (<strong>id 1</strong>) was just used to unlock the site.
        </p>

        <table style="width:100%; border-collapse:collapse; font-size:13px; color:#475569;">
          <tr><td style="padding:6px 0;">IP Address</td><td>${details.ip ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">Country</td><td>${details.country ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">Region</td><td>${details.region ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">City</td><td>${details.city ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">Postal Code</td><td>${details.postal ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">Timezone</td><td>${details.timezone ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">ISP</td><td>${details.isp ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">Latitude</td><td>${details.latitude ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">Longitude</td><td>${details.longitude ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">User-Agent</td><td>${details.userAgent ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">Referer</td><td>${details.referer ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">Language</td><td>${details.language ?? "Unknown"}</td></tr>
          <tr><td style="padding:6px 0;">Time</td><td>${details.time}</td></tr>
        </table>
      </div>

      <div style="background:#f8fafc; padding:14px 24px; border-top:1px solid #e5e7eb;">
        <p style="margin:0; font-size:11px; color:#94a3b8;">
          Automated notification — CloudConsole Knowledgebase
        </p>
      </div>
    </div>
  </div>`;
}

export async function sendAccessNotificationEmail(
  details: AccessEmailDetails
) {
  const recipients = getRecipients();

  if (recipients.length === 0) {
    console.warn(
      "ACCESS_NOTIFY_EMAIL is empty — skipping access notification email."
    );
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: recipients,
    subject: "Access code (id 1) was used",

    text: `
The primary access code (id 1) was used.

IP: ${details.ip ?? "Unknown"}
Country: ${details.country ?? "Unknown"}
Region: ${details.region ?? "Unknown"}
City: ${details.city ?? "Unknown"}
Postal: ${details.postal ?? "Unknown"}
Timezone: ${details.timezone ?? "Unknown"}
ISP: ${details.isp ?? "Unknown"}
Latitude: ${details.latitude ?? "Unknown"}
Longitude: ${details.longitude ?? "Unknown"}
User-Agent: ${details.userAgent ?? "Unknown"}
Referer: ${details.referer ?? "Unknown"}
Language: ${details.language ?? "Unknown"}
Time: ${details.time}
`,

    html: buildAccessEmailHtml(details),
  });
}