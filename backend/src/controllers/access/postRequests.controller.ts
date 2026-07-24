import { Request, Response } from "express";
import { sql } from "../../config/db.js";

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
