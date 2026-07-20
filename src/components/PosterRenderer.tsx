import React, { useState } from "react";
import Image from "next/image";

export const PosterRenderer = ({ poster, frame = "unframed", size = "A4" }: any) => {
  if (!poster) return null;

  const [imgError, setImgError] = useState(false);

  // Frame classes mapped from posters data
  let frameClass = "frame-unframed";
  if (frame === "black") frameClass = "frame-real-black";
  else if (frame === "white") frameClass = "frame-real-white";
  else if (frame === "wood") frameClass = "frame-real-wood";

  const rawSrc = poster.galleryImages?.[0] || poster.heroImage;
  const posterSrc = (rawSrc && typeof rawSrc === "string" && rawSrc.trim() !== "") 
    ? rawSrc 
    : null;

  const showFallbackTextCard = !posterSrc || imgError;
  const isFramed = frame === "black" || frame === "white" || frame === "wood";

  return (
    <div 
      className={`real-gallery-frame-container ${frameClass}`}
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: "1 / 1.414" // Standard A-size ratio
      }}
    >
      {/* If Framed, render Pass-partout Matboard Margin & Artwork Window */}
      {isFramed ? (
        <div className="frame-matboard">
          <div className="matboard-window">
            {!showFallbackTextCard ? (
              <Image
                src={posterSrc}
                alt={poster.title || "Poster"}
                fill
                unoptimized={posterSrc.startsWith("http")}
                sizes="(max-width: 768px) 100vw, 380px"
                priority={Boolean(poster.featured)}
                onError={() => setImgError(true)}
                style={{
                  objectFit: "cover"
                }}
              />
            ) : (
              /* Museum-quality Typographic Poster Fallback Card */
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: poster.palette?.primary || "#1E1E1E",
                  color: "#FAFAF8",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "2rem 1.5rem",
                  boxSizing: "border-box",
                  position: "relative",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.85 }}>
                  POLACRAFT STUDIO • {poster.year || 1993}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.6rem", fontWeight: "900", fontFamily: "var(--font-serif)", margin: 0, lineHeight: "1.1" }}>
                    {poster.title}
                  </h3>
                  <p style={{ fontSize: "0.8rem", fontStyle: "italic", opacity: 0.9, margin: 0 }}>
                    Dir. {poster.director}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.25)", paddingTop: "0.75rem", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.8 }}>
                  {poster.collection || "Classic Malayalam"}
                </div>
              </div>
            )}

            {/* Real Museum Protective Glass Reflection Glare */}
            <div 
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0) 65%)",
                zIndex: 3
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
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                zIndex: 2
              }} 
            />
          </div>
        </div>
      ) : (
        /* Unframed Print Direct Layout */
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            backgroundColor: poster.palette?.bg || "#EFECE6"
          }}
        >
          {!showFallbackTextCard ? (
            <Image
              src={posterSrc}
              alt={poster.title || "Poster"}
              fill
              unoptimized={posterSrc.startsWith("http")}
              sizes="(max-width: 768px) 100vw, 380px"
              priority={Boolean(poster.featured)}
              onError={() => setImgError(true)}
              style={{
                objectFit: "cover"
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: poster.palette?.primary || "#1E1E1E",
                color: "#FAFAF8",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "2rem 1.5rem",
                boxSizing: "border-box",
                position: "relative",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.85 }}>
                POLACRAFT STUDIO • {poster.year || 1993}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <h3 style={{ fontSize: "1.6rem", fontWeight: "900", fontFamily: "var(--font-serif)", margin: 0, lineHeight: "1.1" }}>
                  {poster.title}
                </h3>
                <p style={{ fontSize: "0.8rem", fontStyle: "italic", opacity: 0.9, margin: 0 }}>
                  Dir. {poster.director}
                </p>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.25)", paddingTop: "0.75rem", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.8 }}>
                {poster.collection || "Classic Malayalam"}
              </div>
            </div>
          )}

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
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
              zIndex: 2
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default PosterRenderer;
