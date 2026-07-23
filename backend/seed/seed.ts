import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sql, connectNeon } from "../src/config/db.js";
import { generateArticleId } from "../src/utils/generateId.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type SeedDepartment = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
};

type SeedArticle = {
  departmentSlug: string;
  title: string;
  content: string;
  authorName: string;
};

type SeedData = {
  departments: SeedDepartment[];
  articles: SeedArticle[];
};

async function main() {
  await connectNeon();

  const dataPath = path.join(__dirname, "seed-data.json");
  const seed: SeedData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  console.log(`Seeding ${seed.departments.length} departments...`);
  for (const dept of seed.departments) {
    const existing = await sql`SELECT slug FROM departments WHERE slug = ${dept.slug}`;
    if (existing.length > 0) {
      await sql`
        UPDATE departments
        SET name = ${dept.name}, description = ${dept.description}, icon = ${dept.icon}, color = ${dept.color}
        WHERE slug = ${dept.slug}
      `;
    } else {
      await sql`
        INSERT INTO departments (slug, name, description, icon, color)
        VALUES (${dept.slug}, ${dept.name}, ${dept.description}, ${dept.icon}, ${dept.color})
      `;
    }
  }

  console.log(`Seeding ${seed.articles.length} articles...`);
  let created = 0;
  for (const article of seed.articles) {
    const department = await sql`SELECT slug FROM departments WHERE slug = ${article.departmentSlug}`;
    if (department.length === 0) {
      console.warn(`Skipping "${article.title}" - unknown department ${article.departmentSlug}`);
      continue;
    }

    const existing = await sql`
      SELECT article_id FROM articles WHERE title = ${article.title} AND department_slug = ${article.departmentSlug}
    `;
    if (existing.length > 0) continue;

    const articleId = await generateArticleId();
    await sql`
      INSERT INTO articles (article_id, title, content, author_name, department_slug)
      VALUES (${articleId}, ${article.title}, ${article.content}, ${article.authorName}, ${article.departmentSlug})
    `;
    created++;
  }

  console.log(`Done. ${created} new articles created.`);

  const existingCode = await sql`SELECT id FROM access_codes LIMIT 1`;
  if (existingCode.length === 0) {
    await sql`INSERT INTO access_codes (code) VALUES ('cloudconsole2026')`;
    console.log('Default access code created: "cloudconsole2026" - change it directly in the DB.');
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
