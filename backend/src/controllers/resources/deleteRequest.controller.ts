import { Request, Response } from "express";
import { sql } from "../../config/db.js";

export async function deleteResource(req: Request, res: Response) {
  // delete /api/resources/:resourceId
  try {
    const { resourceId } = req.params;

    const existing = await sql`SELECT resource_id FROM resources WHERE resource_id = ${resourceId}`;
    if (existing.length === 0) {
      return res.status(404).json({ error: "Resource not found" });
    }

    await sql`DELETE FROM resources WHERE resource_id = ${resourceId}`;
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
