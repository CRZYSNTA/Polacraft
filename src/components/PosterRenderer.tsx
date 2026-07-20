import React from "react";
import Image from "next/image";

export const PosterRenderer = ({ poster, frame = "unframed", size = "A4" }: any) => {
  if (!poster) return null;

  // Frame classes mapped from posters data
  let frameClass = "";
  if (frame === "black") frameClass = "poster-framed-black";
  else if (frame === "white") frameClass = "poster-framed-white";
  else if (frame === "wood") frameClass = "poster-framed-wood";

  // Use primary graphic asset from database
  const rawSrc = poster.galleryImages?.[0] || poster.heroImage;
  const posterSrc = (rawSrc && typeof rawSrc === "string" && rawSrc.trim() !== "") 
    ? rawSrc 
    : "/assets/posters/manichitrathazhu-original-polacraft.png";

  return (
    <div 
      className={`poster-art-shadow ${frameClass}`}
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: "1 / 1.414", // Standard A-size ratio
        overflow: "hidden",
        backgroundColor: poster.palette?.bg || "#EFECE6",
        transition: "var(--transition-smooth)"
      }}
    >
      <Image
        src={posterSrc}
        alt={poster.title || "Poster"}
        fill
        unoptimized={posterSrc.startsWith("http")}
        sizes="(max-width: 768px) 100vw, 380px"
        priority={Boolean(poster.featured)}
        style={{
          objectFit: "cover"
        }}
      />
      
      {/* Paper texture glare overlay */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: "0.06",
          mixBlendMode: "multiply",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
        }} 
      />
    </div>
  );
};
export default PosterRenderer;
