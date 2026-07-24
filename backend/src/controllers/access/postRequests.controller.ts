import { Request, Response } from "express";
import { sql } from "../../config/db.js";
import axios from "axios";
import { sendAccessNotificationEmail } from "../../utils/mailer.js";
import { lookupGeo } from "../../utils/geoLookup.js";

export async function verifyAccessCode(req: Request, res: Response) {
  // post /api/access/verify   { code: string }  ->  { valid: boolean }
  try {
    const time = new Date().toISOString();
    const { code } = req.body ?? {};

    if (!code || !String(code).trim()) {
      return res.status(400).json({ valid: false, error: "'code' is required" });
    }

    const trimmedCode = String(code).trim();

    const total = await sql`SELECT COUNT(*)::int AS count FROM access_codes`;
    if (!total[0] || total[0].count === 0) {
      return res.status(503).json({ valid: false, error: "No access code has been set up yet" });
    }

    const result = await sql`
        SELECT id, code
        FROM access_codes
        WHERE code = ${trimmedCode}
        LIMIT 1`;

    const record = result[0];
    const valid = !!record;

    // This is the part that actually connects it to the access gate:
    // fires automatically whenever the id=1 code is used to unlock the site.
if (valid && record.id === 1) {
  try {
    const geo = await lookupGeo(req.ip ?? "");
    await sendAccessNotificationEmail({
      ...geo,
      userAgent: req.get("user-agent"),
      referer: req.get("referer"),
      language: req.get("accept-language"),
      time,
    });
  } catch (mailError) {
    console.error("Failed to send access notification email:", mailError);
  }
}

    res.status(200).json({ valid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ valid: false, error: "Internal Server Error" });
  }
}

export async function postIpAddress(req: Request, res: Response) {
  try {
    const ip = req.ip!;

    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`);

    await sql`
      INSERT INTO users_logs (
        ip_address, user_agent, referer, language,
        country, region, city, postal, timezone, isp,
        latitude, longitude
      )
      VALUES (
        ${ip},
        ${req.get("user-agent") ?? ""},
        ${req.get("referer") ?? ""},
        ${req.get("accept-language") ?? ""},
        ${data.country_name ?? ""},
        ${data.region ?? ""},
        ${data.city ?? ""},
        ${data.postal ?? ""},
        ${data.timezone ?? ""},
        ${data.org ?? ""},
        ${data.latitude ?? null},
        ${data.longitude ?? null}
      )
    `;

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}