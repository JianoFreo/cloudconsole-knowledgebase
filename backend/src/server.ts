import dns from "dns";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectNeon } from "./config/db.js";
import { ENV } from "./config/env.js";
import apiRoutes from "./routes/index.route.js";

// Render's outbound network can resolve IPv6 addresses (e.g. for Gmail's
// SMTP servers) but sometimes fails to route to them (ENETUNREACH), even
// though IPv4 works fine. Prefer IPv4 results globally for any outgoing
// connection this server makes (SMTP, axios/ipapi.co, etc.).
dns.setDefaultResultOrder("ipv4first");

// FIX __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("trust proxy", true);

// CORS
const allowedOrigins = ENV.CLIENT_ORIGIN.split(",").map((origin) =>
  origin.trim()
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin header (Postman, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(ENV.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

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