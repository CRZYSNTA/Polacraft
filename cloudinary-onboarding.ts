#!/usr/bin/env tsx

import { v2 as cloudinary } from "cloudinary";

async function main() {
  // ================================
  // Cloudinary Configuration
  // ================================
  cloudinary.config({
    cloud_name: "virvu4jm",
    api_key: "593832791183545",
    api_secret: "GTC2wA0HkDgoCGgiPhBqNpkNzBo",
  });

  console.log("Uploading sample image...");

  // Upload a sample image from Cloudinary's demo account
  const uploaded = await cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    {
      folder: "polacraft/onboarding",
    }
  );

  console.log("\n=== Upload Complete ===");
  console.log("Secure URL:", uploaded.secure_url);
  console.log("Public ID :", uploaded.public_id);

  // Retrieve metadata
  const details = await cloudinary.api.resource(uploaded.public_id);

  console.log("\n=== Image Details ===");
  console.log("Width     :", details.width);
  console.log("Height    :", details.height);
  console.log("Format    :", details.format);
  console.log("File Size :", details.bytes, "bytes");

  // f_auto = automatically serves the best image format for the visitor's browser.
  // q_auto = automatically chooses the optimal compression quality.
  const optimizedUrl = cloudinary.url(uploaded.public_id, {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log("\nDone! Click the link below to see the optimized version.");
  console.log("Check the size and the format.");
  console.log(optimizedUrl);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});