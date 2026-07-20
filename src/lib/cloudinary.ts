import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary SDK with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

export interface UploadResult {
  secure_url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
}

export type ContentFolderType =
  | "products/hero"
  | "products/gallery"
  | "products/wall-mockup"
  | "products/packaging"
  | "products/detail"
  | "products/mobile"
  | "blog/banners"
  | "collections"
  | "authors"
  | "homepage";

/**
 * Maps image type to appropriate Cloudinary folder path.
 */
export function getCloudinaryFolderPath(typeOrCategory?: string): string {
  const root = "polacraft";
  switch (typeOrCategory?.toUpperCase()) {
    case "HERO":
      return `${root}/products/hero`;
    case "WALL_MOCKUP":
      return `${root}/products/wall-mockup`;
    case "PACKAGING":
      return `${root}/products/packaging`;
    case "DETAIL":
      return `${root}/products/detail`;
    case "MOBILE":
      return `${root}/products/mobile`;
    case "BLOG":
      return `${root}/blog/banners`;
    case "COLLECTIONS":
      return `${root}/collections`;
    default:
      return `${root}/products/gallery`;
  }
}

/**
 * Uploads an image file buffer to Cloudinary with automatic optimization:
 * - auto quality
 * - auto format (WebP / AVIF)
 * - metadata stripping
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string = "upload",
  folderType: string = "products/gallery"
): Promise<UploadResult> {
  const hasCloudinary = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (!hasCloudinary) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Production Environment Error: Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are required."
      );
    }
    console.warn("[Cloudinary Not Configured]: Please set CLOUDINARY_* environment variables in .env");
  }

  const folderPath = getCloudinaryFolderPath(folderType);

  return new Promise<UploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
        resource_type: "image",
        fetch_format: "auto",
        quality: "auto",
        flags: "strip_profile",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Deletes an image asset from Cloudinary using its public_id.
 * Prevents orphaned files from accumulating when replacing or removing product media.
 */
export async function deleteCloudinaryAsset(publicId: string): Promise<boolean> {
  if (!publicId) return false;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (err) {
    console.error(`[Cloudinary Destroy Error for ${publicId}]:`, err);
    return false;
  }
}

/**
 * Responsive Cloudinary Delivery Helper
 * Transforms Cloudinary URLs on demand with custom width, quality, and formatting options for optimal srcset.
 */
export function getCloudinaryResponsiveUrl(
  url: string,
  options: { width?: number; height?: number; quality?: string | number; crop?: string } = {}
): string {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  const { width, height, quality = "auto", crop = "limit" } = options;

  const transformations: string[] = ["f_auto", `q_${quality}`];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);

  const transformString = transformations.join(",");

  return url.replace("/upload/", `/upload/${transformString}/`);
}
