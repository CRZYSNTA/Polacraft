import React, { useState } from "react";
import Image from "next/image";

export const PosterRenderer = ({ poster, frame = "unframed", size = "A4", isHovered: externalHovered }: any) => {
  const [imgError, setImgError] = useState(false);
  const [internalHovered, setInternalHovered] = useState(false);

  const isHovered = externalHovered !== undefined ? externalHovered : internalHovered;

  if (!poster) return null;

  // Frame classes mapped from posters data
  let frameClass = "frame-unframed";
  if (frame === "black") frameClass = "frame-real-black";
  else if (frame === "white") frameClass = "frame-real-white";
  else if (frame === "wood") frameClass = "frame-real-wood";

  const rawSrc = poster.heroImage || poster.galleryImages?.[0];
  const posterSrc = (rawSrc && typeof rawSrc === "string" && rawSrc.trim() !== "") 
    ? rawSrc 
    : null;

  const showFallbackTextCard = !posterSrc || imgError;
  const isFramed = frame === "black" || frame === "white" || frame === "wood";

  return (
    <div 
      className={`real-gallery-frame-container ${frameClass}`}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: "1 / 1.414", // Standard A-size ratio
        overflow: "hidden"
      }}
    >
      {/* STANDARD POSTER VIEW */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? "scale(0.97)" : "scale(1)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          zIndex: 1
        }}
      >
        {isFramed ? (
          <div 
            className="frame-matboard"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box"
            }}
          >
            <div className="matboard-window" style={{ flexGrow: 1, position: "relative", width: "100%", height: "100%" }}>
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
                    position: "absolute",
                    inset: 0,
                    backgroundColor: poster.palette?.primary || "#1E1E1E",
                    color: "#FAFAF8",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    boxSizing: "border-box",
                    textAlign: "center"
                  }}
                >
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "900", fontFamily: "var(--font-serif)", margin: 0, lineHeight: "1.1" }}>
                    {poster.title}
                  </h3>
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
              position: "absolute",
              inset: 0,
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
                  position: "absolute",
                  inset: 0,
                  backgroundColor: poster.palette?.primary || "#1E1E1E",
                  color: "#FAFAF8",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5rem 1rem",
                  boxSizing: "border-box",
                  textAlign: "center"
                }}
              >
                <h3 style={{ fontSize: "1.5rem", fontWeight: "900", fontFamily: "var(--font-serif)", margin: 0, lineHeight: "1.1" }}>
                  {poster.title}
                </h3>
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

      {/* HOVER: WALL HANGING MOCKUP VIEW */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scale(1)" : "scale(1.04)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          zIndex: 2,
          pointerEvents: "none"
        }}
      >
        {/* Room Wall Background Image */}
        <Image
          src="/assets/wall_hanging_mockup.jpg"
          alt="Poster Hanging on Room Wall"
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          style={{ objectFit: "cover" }}
        />

        {/* Dynamic Poster Projected Inside Wall Frame */}
        <div
          style={{
            position: "absolute",
            top: "15.2%",
            left: "21.8%",
            width: "56.4%",
            height: "53.8%",
            overflow: "hidden",
            borderRadius: "2px",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)"
          }}
        >
          {!showFallbackTextCard ? (
            <Image
              src={posterSrc}
              alt={poster.title || "Poster on Wall"}
              fill
              unoptimized={posterSrc.startsWith("http")}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: poster.palette?.primary || "#1E1E1E",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.5rem",
                textAlign: "center"
              }}
            >
              <span style={{ fontSize: "0.8rem", fontWeight: "800" }}>{poster.title}</span>
            </div>
          )}

          {/* Glass Glare Overlay on Wall Frame */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.05) 100%)",
              pointerEvents: "none"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PosterRenderer;
