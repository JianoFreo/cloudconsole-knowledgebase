import { Request, Response } from "express";
import { sql } from "../../config/db.js";

export async function deleteArticle(req: Request, res: Response) {
  // delete /api/articles/:articleId
  try {
    const { articleId } = req.params;

    const existing = await sql`SELECT article_id FROM articles WHERE article_id = ${articleId}`;
    if (existing.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    // attachments cascade-delete via the FK constraint
    await sql`DELETE FROM articles WHERE article_id = ${articleId}`;

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
