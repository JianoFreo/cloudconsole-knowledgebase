import { Request, Response } from "express";
import { sql } from "../../config/db.js";

export async function getAllResources(req: Request, res: Response) {
  // get /api/resources?department=slug
  try {
    const department = typeof req.query.department === "string" ? req.query.department.trim() : "";

    const resources = await sql`
      SELECT
        r.*,
        d.name AS department_name,
        d.slug AS department_slug_ref
      FROM resources r
      LEFT JOIN departments d ON d.slug = r.department_slug
      WHERE ${department} = '' OR r.department_slug = ${department}
      ORDER BY r.created_at DESC
    `;

    res.status(200).json({ resources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
