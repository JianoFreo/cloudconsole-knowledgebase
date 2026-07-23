import { Request, Response } from "express";
import { sql } from "../../config/db.js";

export async function getAllArticles(req: Request, res: Response) {
  // get /api/articles?search=&department=&page=&pageSize=
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const department = typeof req.query.department === "string" ? req.query.department.trim() : "";
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 12));
    const offset = (page - 1) * pageSize;
    const likeTerm = `%${search}%`;

    const items = await sql`
      SELECT
        a.*,
        d.name  AS department_name,
        d.slug  AS department_slug,
        d.icon  AS department_icon,
        d.color AS department_color
      FROM articles a
      JOIN departments d ON d.slug = a.department_slug
      WHERE
        (${department} = '' OR d.slug = ${department})
        AND (
          ${search} = ''
          OR a.title ILIKE ${likeTerm}
          OR a.content ILIKE ${likeTerm}
        )
      ORDER BY a.created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) AS total
      FROM articles a
      JOIN departments d ON d.slug = a.department_slug
      WHERE
        (${department} = '' OR d.slug = ${department})
        AND (
          ${search} = ''
          OR a.title ILIKE ${likeTerm}
          OR a.content ILIKE ${likeTerm}
        )
    `;

    const total = Number(countResult[0]?.total ?? 0);

    res.status(200).json({
      items,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getArticleById(req: Request, res: Response) {
  // get /api/articles/:articleId
  try {
    const { articleId } = req.params;

    const result = await sql`
      SELECT
        a.*,
        d.name  AS department_name,
        d.slug  AS department_slug,
        d.icon  AS department_icon,
        d.color AS department_color,
        COALESCE(
          json_agg(att.*) FILTER (WHERE att.id IS NOT NULL),
          '[]'
        ) AS attachments
      FROM articles a
      JOIN departments d ON d.slug = a.department_slug
      LEFT JOIN attachments att ON att.article_id = a.article_id
      WHERE a.article_id = ${articleId}
      GROUP BY a.id, d.name, d.slug, d.icon, d.color
    `;

    const article = result[0];
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json({ article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
