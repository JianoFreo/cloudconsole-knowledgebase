import { sql } from "../config/db.js";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function slugifyName(value: string): string {
  return slugify(value);
}

export async function generateArticleId(): Promise<string> {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const prefix = `${year}${month}${day}`;

  const createdToday = await sql`
    SELECT article_id
    FROM articles
    WHERE article_id LIKE ${`ART-${prefix}-%`}
    ORDER BY article_id DESC
    LIMIT 1
  `;

  let nextNumber = 1;
  const last = createdToday[0]?.article_id as string | undefined;
  if (last) {
    nextNumber = Number(last.slice(-4)) + 1;
  }
  const sequence = String(nextNumber).padStart(4, "0");
  return `ART-${prefix}-${sequence}`;
}

export async function generateAttachmentId(): Promise<string> {
  const now = new Date();
  const stamp = now.getTime().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ATT-${stamp}-${random}`;
}

export async function generateResourceId(): Promise<string> {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `${year}${month}`;

  const createdThisMonth = await sql`
    SELECT resource_id
    FROM resources
    WHERE resource_id LIKE ${`RES-${prefix}-%`}
    ORDER BY resource_id DESC
    LIMIT 1
  `;

  let nextNumber = 1;
  const last = createdThisMonth[0]?.resource_id as string | undefined;
  if (last) {
    nextNumber = Number(last.slice(-3)) + 1;
  }
  const sequence = String(nextNumber).padStart(3, "0");
  return `RES-${prefix}-${sequence}`;
}

export async function generateContactMessageId(): Promise<string> {
  const now = new Date();
  const stamp = now.getTime().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MSG-${stamp}-${random}`;
}
