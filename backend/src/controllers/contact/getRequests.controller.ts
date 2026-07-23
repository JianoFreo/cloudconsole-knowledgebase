import { Request, Response } from "express";
import { sql } from "../../config/db.js";

export async function getAllContactMessages(req: Request, res: Response) {
  // get /api/contact
  try {
    const messages = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;
    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
