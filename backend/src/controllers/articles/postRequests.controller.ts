import { Request, Response } from "express";
import { sql } from "../../config/db.js";
import { generateArticleId, generateAttachmentId } from "../../utils/generateId.js";
import { uploadBufferToCloudinary } from "../../lib/uploadToCloudinary.js";

export async function createArticle(req: Request, res: Response) {
  // post /api/articles  (multipart/form-data, field name "files" for attachments)
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

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const attachments = [];
    for (const file of files) {
      const uploaded = await uploadBufferToCloudinary(file.buffer, {
        folder: `cloudconsole-knowledgebase/${departmentSlug}`,
        filename: file.originalname,
      });
      const attachmentId = await generateAttachmentId();
      const inserted = await sql`
        INSERT INTO attachments (attachment_id, article_id, url, public_id, resource_type, original_name)
        VALUES (
          ${attachmentId},
          ${articleId},
          ${uploaded.secure_url},
          ${uploaded.public_id},
          ${uploaded.resource_type},
          ${file.originalname}
        )
        RETURNING *
      `;
      attachments.push(inserted[0]);
    }

    res.status(201).json({ article: { ...result[0], attachments } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
