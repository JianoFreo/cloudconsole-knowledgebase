import { Request, Response } from "express";
import { sql } from "../../config/db.js";

export async function getAllDepartments(req: Request, res: Response) {
  // get /api/departments
  try {
    const departments = await sql`
      SELECT
        d.*,
        COUNT(a.id) AS article_count
      FROM departments d
      LEFT JOIN articles a ON a.department_slug = d.slug
      GROUP BY d.id
      ORDER BY d.created_at ASC
    `;
    res.status(200).json({ departments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getDepartmentBySlug(req: Request, res: Response) {
  // get /api/departments/:slug
  try {
    const { slug } = req.params;
    const result = await sql`
      SELECT
        d.*,
        COUNT(a.id) AS article_count
      FROM departments d
      LEFT JOIN articles a ON a.department_slug = d.slug
      WHERE d.slug = ${slug}
      GROUP BY d.id
    `;
    const department = result[0];
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.status(200).json({ department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
