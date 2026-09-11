import { Request, Response } from "express";
import { sql } from "../../config/db.js";
import { generateArticleId } from "../../utils/generateId.js";

export async function createArticle(req: Request, res: Response) {
  // post /api/articles  (multipart/form-data; file attachments are no longer
  // uploaded anywhere - Cloudinary support was removed, so any files sent
  // under the "files" field are accepted by multer for parsing but discarded)
  try {
    const { title, content, departmentSlug, authorName } = req.body ?? {};

    if (!title || !String(title).trim()) return res.status(400).json({ error: "'title' is required" });
    if (!content || !String(content).trim()) return res.status(400).json({ error: "'content' is required" });
    if (!departmentSlug) return res.status(400).json({ error: "'departmentSlug' is required" });

    const department = await sql`SELECT slug FROM departments WHERE slug = ${departmentSlug}`;
    if (department.length === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    const articleId = await generateArticleId();

    const result = await sql`
      INSERT INTO articles (article_id, title, content, author_name, department_slug)
      VALUES (
        ${articleId},
        ${String(title).trim()},
        ${String(content).trim()},
        ${authorName && String(authorName).trim() ? String(authorName).trim() : "Anonymous"},
        ${departmentSlug}
      )
      RETURNING *
    `;

    // File attachments are no longer stored; any files posted alongside the
    // article are ignored (multer still parses the multipart body so
    // title/content/etc. come through correctly).
    res.status(201).json({ article: { ...result[0], attachments: [] } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}