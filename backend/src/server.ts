import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectNeon } from "./config/db.js";
import { ENV } from "./config/env.js";
import apiRoutes from "./routes/index.route.js";

// FIX __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = ENV.CLIENT_ORIGIN.split(",").map((o) => o.trim());
app.use(cors({ origin: allowedOrigins.includes("*") ? true : allowedOrigins }));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(ENV.NODE_ENV === "production" ? "combined" : "dev"));
app.get("/", (req, res) => {
    console.log({
        ip: req.ip,
        userAgent: req.get("user-agent"),
        referer: req.get("referer"),
        language: req.get("accept-language"),
        time: new Date().toISOString(),
    });
});
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// API routes
app.use("/api", apiRoutes);

// Serve the built frontend (monolithic - one server, one deploy)
const frontendPath = path.resolve(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// IMPORTANT: Render needs process.env.PORT
connectNeon().then(() => {
  app.listen(ENV.PORT, () => {
    console.log(`Server is up and running on http://localhost:${ENV.PORT}`);
  });
});
