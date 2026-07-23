import { Request, Response } from "express";
import { sql } from "../../config/db.js";
import { generateResourceId } from "../../utils/generateId.js";

export async function createResource(req: Request, res: Response) {
  // post /api/resources
  try {
    const { label, url, icon, departmentSlug } = req.body ?? {};

    if (!label || !String(label).trim()) {
      return res.status(400).json({ error: "'label' is required" });
    }

    if (departmentSlug) {
      const department = await sql`SELECT slug FROM departments WHERE slug = ${departmentSlug}`;
      if (department.length === 0) {
        return res.status(404).json({ error: "Department not found" });
      }
    }

    const resourceId = await generateResourceId();

    const result = await sql`
      INSERT INTO resources (resource_id, label, url, icon, department_slug)
      VALUES (
        ${resourceId},
        ${String(label).trim()},
        ${typeof url === "string" ? url.trim() : ""},
        ${typeof icon === "string" && icon.trim() ? icon.trim() : "FileText"},
        ${departmentSlug || null}
      )
      RETURNING *
    `;

    res.status(201).json({ resource: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
