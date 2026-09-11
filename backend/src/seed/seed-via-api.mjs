// Seeds departments + articles into the Knowledge Base over its public HTTP
// API — does NOT touch Postgres directly. Use this when you only have the
// backend's URL (e.g. a Cloudflare tunnel) and no direct DB connection.
//
// Data lives in a separate, git-ignored JSON file (see scripts/seed-data.example.json
// for the shape) so the actual content never gets committed to the repo.
//
// Usage:
//   BACKEND_URL=https://your-tunnel-url.trycloudflare.com \
//   SEED_DATA_PATH=./scripts/seed-data.json \
//   node scripts/seed-via-api.mjs
//
// Both env vars have sane local defaults (see below), so for local dev you
// can usually just run:
//   node scripts/seed-via-api.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BACKEND_URL = (process.env.BACKEND_URL || "https://lending-hats-functioning-nam.trycloudflare.com").replace(/\/+$/, "");
const DATA_PATH = process.env.SEED_DATA_PATH || path.join(__dirname, "seed-data.json");

async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Seed data file not found: ${DATA_PATH}`);
    console.error(`Copy scripts/seed-data.example.json to scripts/seed-data.json and fill in real content, or set SEED_DATA_PATH.`);
    process.exitCode = 1;
    return;
  }

  /** @type {{departments: any[], articles: any[]}} */
  const seed = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

  console.log(`Backend: ${BACKEND_URL}`);
  console.log(`Data file: ${DATA_PATH}`);

  await pingBackend();

  const slugByDeptSlug = await seedDepartments(seed.departments ?? []);
  await seedArticles(seed.articles ?? [], slugByDeptSlug);

  console.log("Done.");
}

async function pingBackend() {
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    if (!res.ok) throw new Error(`status ${res.status}`);
    console.log("Backend reachable.");
  } catch (err) {
    console.error(`Could not reach ${BACKEND_URL}/health — is BACKEND_URL correct and the server up?`);
    console.error(err.message);
    process.exitCode = 1;
    throw new Error("aborting: backend not reachable");
  }
}

async function seedDepartments(departments) {
  console.log(`Seeding ${departments.length} department(s)...`);

  const existingRes = await fetch(`${BACKEND_URL}/api/departments`);
  const existingBody = existingRes.ok ? await existingRes.json() : { departments: [] };
  const existingSlugs = new Set((existingBody.departments ?? []).map((d) => d.slug));

  const slugSet = new Set();
  for (const dept of departments) {
    const clientSlug = slugify(dept.name);
    slugSet.add(clientSlug);

    if (existingSlugs.has(clientSlug)) {
      console.log(`  - ${dept.name} (already exists, skipping)`);
      continue;
    }

    const res = await fetch(`${BACKEND_URL}/api/departments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: dept.name,
        description: dept.description ?? "",
        icon: dept.icon ?? "Folder",
        color: dept.color ?? "slate",
      }),
    });

    if (res.status === 409) {
      console.log(`  - ${dept.name} (already exists, skipping)`);
      continue;
    }
    if (!res.ok) {
      const body = await safeJson(res);
      console.warn(`  ! Failed to create department "${dept.name}": ${res.status} ${body?.error ?? ""}`);
      continue;
    }
    console.log(`  + ${dept.name}`);
  }

  return slugSet;
}

async function seedArticles(articles, knownDeptSlugs) {
  console.log(`Seeding ${articles.length} article(s)...`);

  const existingTitlesByDept = new Map();
  async function existingTitlesFor(deptSlug) {
    if (existingTitlesByDept.has(deptSlug)) return existingTitlesByDept.get(deptSlug);
    const titles = new Set();
    let page = 1;
    let totalPages = 1;
    do {
      const res = await fetch(
        `${BACKEND_URL}/api/articles?department=${encodeURIComponent(deptSlug)}&page=${page}&pageSize=50`
      );
      if (!res.ok) break;
      const body = await res.json();
      for (const item of body.items ?? []) titles.add(item.title);
      totalPages = body.pagination?.totalPages ?? 1;
      page++;
    } while (page <= totalPages);
    existingTitlesByDept.set(deptSlug, titles);
    return titles;
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const article of articles) {
    const deptSlug = article.departmentSlug;

    if (!knownDeptSlugs.has(deptSlug)) {
      console.warn(`  ! Skipping "${article.title}" — department "${deptSlug}" wasn't seeded`);
      failed++;
      continue;
    }

    const titles = await existingTitlesFor(deptSlug);
    if (titles.has(article.title)) {
      skipped++;
      continue;
    }

    const res = await fetch(`${BACKEND_URL}/api/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: article.title,
        content: article.content,
        departmentSlug: deptSlug,
        authorName: article.authorName ?? "Knowledge Base Import",
      }),
    });

    if (!res.ok) {
      const body = await safeJson(res);
      console.warn(`  ! Failed "${article.title}": ${res.status} ${body?.error ?? ""}`);
      failed++;
      continue;
    }

    titles.add(article.title);
    created++;
  }

  console.log(`Articles: ${created} created, ${skipped} skipped (already existed), ${failed} failed.`);
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

main()
  .catch((err) => {
    console.error(err.message ?? err);
    process.exitCode = 1;
  });