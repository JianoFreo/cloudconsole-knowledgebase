import { Request, Response } from "express";
import { sql } from "../../config/db.js";

export async function updateArticle(req: Request, res: Response) {
  // patch /api/articles/:articleId
  try {
    const { articleId } = req.params;
    const { title, content } = req.body ?? {};

    const existing = await sql`SELECT article_id FROM articles WHERE article_id = ${articleId}`;
    if (existing.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    const result = await sql`
      UPDATE articles
      SET
        title      = COALESCE(${title ? String(title).trim() : null}, title),
        content    = COALESCE(${content ? String(content).trim() : null}, content),
        updated_at = CURRENT_TIMESTAMP
      WHERE article_id = ${articleId}
      RETURNING *
    `;

    res.status(200).json({ article: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
