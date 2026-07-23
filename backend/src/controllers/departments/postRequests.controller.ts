import { Request, Response } from "express";
import { sql } from "../../config/db.js";
import { slugifyName } from "../../utils/generateId.js";

export async function createDepartment(req: Request, res: Response) {
  // post /api/departments
  try {
    const { name, description, icon, color } = req.body ?? {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "'name' is required" });
    }

    const slug = slugifyName(name);
    if (!slug) {
      return res.status(400).json({ error: "Could not derive a slug from that name" });
    }

    const existing = await sql`SELECT slug FROM departments WHERE slug = ${slug}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: "A department with that name already exists" });
    }

    const result = await sql`
      INSERT INTO departments (slug, name, description, icon, color)
      VALUES (
        ${slug},
        ${name.trim()},
        ${typeof description === "string" ? description.trim() : ""},
        ${typeof icon === "string" && icon.trim() ? icon.trim() : "Folder"},
        ${typeof color === "string" && color.trim() ? color.trim() : "teal"}
      )
      RETURNING *
    `;

    res.status(201).json({ department: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
