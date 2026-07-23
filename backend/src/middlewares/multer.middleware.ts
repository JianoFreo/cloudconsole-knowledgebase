import multer from "multer";

// Files are kept in memory and streamed straight to Cloudinary -
// nothing is ever written to disk on the server.
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB per file
});
