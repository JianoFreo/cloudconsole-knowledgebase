# CloudConsole Knowledgebase

A single monorepo, monolithic deploy: one Express server serves both the API
and the built React frontend. Raw SQL via `@neondatabase/serverless` — no
ORM, no migrations tool. Tables are created automatically on server startup
(`CREATE TABLE IF NOT EXISTS ...` in `backend/src/config/db.ts`).

```
cc-knowledgebase-main/
├── backend/     # Express API + serves frontend/dist in production
├── frontend/    # React (Vite) app
└── package.json # root scripts that drive both
```

## Setup

1. **Backend env** — `cp backend/.env.example backend/.env` and fill in your
   Neon `DATABASE_URL` and Cloudinary credentials.
2. **Install everything and build:**
   ```bash
   npm run build
   ```
   This installs + builds the frontend first (`frontend/dist`), then
   installs + builds the backend (`backend/dist`).
3. **Start the server:**
   ```bash
   npm start
   ```
   On first boot it creates all tables automatically. Visit
   `http://localhost:5000` — the backend serves the frontend directly, so
   there's only one URL, one process, one deploy.

## Local development

```bash
npm run dev   # runs the backend only, with auto-reload (tsx watch)
```
While iterating on the frontend, run it separately for hot-reload:
```bash
cd frontend && npm run dev   # http://localhost:5173
```
and set `frontend/.env` → `VITE_API_BASE_URL="http://localhost:5000"` so it
calls the backend directly instead of expecting same-origin API calls.

## Seed the PDF content

`backend/seed/seed-data.json` holds 121 articles across 8 departments,
extracted from the original knowledgebase PDF. It's gitignored (contains
real names/contacts), so make sure it's actually sitting in
`backend/seed/` locally, then:
```bash
npm run seed
```
Safe to re-run — it upserts departments and skips articles that already
exist.

## The access code

There's no login system — one shared passcode gates the site, stored as a
single row in the `access_codes` table. Change it any time directly in
Neon's SQL console:
```sql
UPDATE access_codes SET code = 'your-new-code';
```
On the frontend, entering the correct code is remembered for that browser
tab across a page refresh (`sessionStorage`), but is forgotten the moment
the tab/browser is closed, or the browser's back button is pressed — either
way, the code has to be entered again.

## Deploying (Render, single service)

- **Build command:** `npm run build`
- **Start command:** `npm start`
- Set the backend's env vars (`DATABASE_URL`, `CLOUDINARY_*`) in Render's
  dashboard — `.env` files aren't deployed.
- `CLIENT_ORIGIN` isn't needed in this setup since frontend and backend are
  served from the same origin.
