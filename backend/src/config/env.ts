import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  DATABASE_URL: process.env.DATABASE_URL || "",

  // Comma-separated list of allowed frontend origins (only used when the
  // frontend is deployed separately from this backend; not needed when
  // this server is serving the built frontend itself).
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "*",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
