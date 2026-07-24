import { neon } from "@neondatabase/serverless";

import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const sql = neon(DATABASE_URL);

export async function connectNeon(): Promise<void> {
  try {
    // -------------------------------------------------------
    // DEPARTMENTS
    // Fully dynamic - anyone can create one from the website.
    // slug is the business key other tables reference.
    // -------------------------------------------------------
    await sql`
      CREATE TABLE IF NOT EXISTS departments (
        id          SERIAL PRIMARY KEY,
        slug        VARCHAR(255) UNIQUE NOT NULL,
        name        VARCHAR(255) NOT NULL,
        description TEXT         NOT NULL DEFAULT '',
        icon        VARCHAR(100) NOT NULL DEFAULT 'Folder',
        color       VARCHAR(50)  NOT NULL DEFAULT 'teal',
        created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

    // -------------------------------------------------------
    // ARTICLES
    // article_id format: ART-YYMMDD-NNNN
    // Anyone can post - no login.
    // -------------------------------------------------------
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id              SERIAL PRIMARY KEY,
        article_id      VARCHAR(255) UNIQUE NOT NULL,
        title           VARCHAR(500) NOT NULL,
        content         TEXT         NOT NULL,
        author_name     VARCHAR(255) NOT NULL DEFAULT 'Anonymous',
        department_slug VARCHAR(255) NOT NULL REFERENCES departments(slug) ON DELETE CASCADE,
        created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

    // -------------------------------------------------------
    // ATTACHMENTS
    // Files/images uploaded alongside an article, stored on Cloudinary.
    // -------------------------------------------------------
    await sql`
      CREATE TABLE IF NOT EXISTS attachments (
        id            SERIAL PRIMARY KEY,
        attachment_id VARCHAR(255) UNIQUE NOT NULL,
        article_id    VARCHAR(255) NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
        url           TEXT         NOT NULL,
        public_id     VARCHAR(255) NOT NULL,
        resource_type VARCHAR(50)  NOT NULL DEFAULT 'raw',
        original_name VARCHAR(500) NOT NULL DEFAULT '',
        created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

    // -------------------------------------------------------
    // RESOURCES
    // Quick-link resources shown in "Additional resources".
    // department_slug is nullable - a resource can be global.
    // -------------------------------------------------------
    await sql`
      CREATE TABLE IF NOT EXISTS resources (
        id              SERIAL PRIMARY KEY,
        resource_id     VARCHAR(255) UNIQUE NOT NULL,
        label           VARCHAR(255) NOT NULL,
        url             TEXT         NOT NULL DEFAULT '',
        icon            VARCHAR(100) NOT NULL DEFAULT 'FileText',
        department_slug VARCHAR(255) REFERENCES departments(slug) ON DELETE SET NULL,
        created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

    // -------------------------------------------------------
    // CONTACT MESSAGES
    // -------------------------------------------------------
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id         SERIAL PRIMARY KEY,
        message_id VARCHAR(255) UNIQUE NOT NULL,
        name       VARCHAR(255) NOT NULL,
        email      VARCHAR(255) NOT NULL,
        message    TEXT         NOT NULL,
        created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

    // -------------------------------------------------------
    // ACCESS CODES
    // Single shared passcode that gates the site. Not a login system -
    // there's one row, and you edit the `code` column directly in the
    // database (Neon console) to change it.
    // -------------------------------------------------------
    await sql`
      CREATE TABLE IF NOT EXISTS access_codes (
        id         SERIAL PRIMARY KEY,
        code       VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;
    await sql`
    CREATE TABLE IF NOT EXISTS users_logs (
      id SERIAL PRIMARY KEY,
      ip_address VARCHAR(255) NOT NULL,
      user_agent TEXT NOT NULL,
      referer TEXT,
      language TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing DB", error);
    process.exit(1);
  }
}

