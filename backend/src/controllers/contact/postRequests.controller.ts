import { Request, Response } from "express";
import { sql } from "../../config/db.js";
import { generateContactMessageId } from "../../utils/generateId.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactMessage(req: Request, res: Response) {
  // post /api/contact
  try {
    const { name, email, message } = req.body ?? {};

    if (!name || !String(name).trim()) return res.status(400).json({ error: "'name' is required" });
    if (!email || !EMAIL_RE.test(String(email).trim()))
      return res.status(400).json({ error: "A valid 'email' is required" });
    if (!message || !String(message).trim()) return res.status(400).json({ error: "'message' is required" });

    const messageId = await generateContactMessageId();

    const result = await sql`
      INSERT INTO contact_messages (message_id, name, email, message)
      VALUES (${messageId}, ${String(name).trim()}, ${String(email).trim()}, ${String(message).trim()})
      RETURNING *
    `;

    res.status(201).json({ ok: true, message: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
