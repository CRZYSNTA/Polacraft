/**
 * Client-safe Responsive Cloudinary Delivery Helper
 * Pure string transformation — does NOT import server-side Node.js Cloudinary SDK or 'fs' module.
 */
export function getCloudinaryResponsiveUrl(
  url: string,
  options: { width?: number; height?: number; quality?: string | number; crop?: string } = {}
): string {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
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
