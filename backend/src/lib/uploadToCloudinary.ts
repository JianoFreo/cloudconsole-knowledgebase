import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: string;
};

export function uploadBufferToCloudinary(
  buffer: Buffer,
  options: { folder?: string; filename?: string } = {}
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder ?? "cloudconsole-knowledgebase",
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        ...(options.filename ? { filename_override: options.filename } : {}),
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Cloudinary upload failed"));
        }
        resolve(result as unknown as CloudinaryUploadResult);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}
