import { Request, Response } from "express";
import { sql } from "../../config/db.js";
import axios from "axios";

export async function verifyAccessCode(req: Request, res: Response) {
  // post /api/access/verify   { code: string }  ->  { valid: boolean }
  try {
     console.log({
        ip: req.ip,
        userAgent: req.get("user-agent"),
        referer: req.get("referer"),
        language: req.get("accept-language"),
        time: new Date().toISOString(),
    });
    const { code } = req.body ?? {};

    if (!code || !String(code).trim()) {
      return res.status(400).json({ valid: false, error: "'code' is required" });
    }

    const result = await sql`
        SELECT code 
        FROM access_codes 
        ORDER BY updated_at 
        DESC LIMIT 1`;
    const record = result[0];

    if (!record) {
      return res.status(503).json({ valid: false, error: "No access code has been set up yet" });
    }

    const valid = String(code).trim() === record.code;
    res.status(200).json({ valid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ valid: false, error: "Internal Server Error" });
  }
}

export async function postIpAddress(req: Request, res: Response) {
  try {
    const ip = req.ip!;

    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`); // or you can just use fecth, but axios is more convenient for JSON parsing and its more boujee

    await sql`
      INSERT INTO users_logs (
        ip_address,
        user_agent,
        referer,
        language,
        country,
        region,
        city,
        postal,
        timezone,
        isp,
        latitude,
        longitude
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