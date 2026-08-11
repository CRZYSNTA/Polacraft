"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CursorImageTrail from "./originkit/ui/cursor-image-trail-custom-style";
import { posters as cmsPosters } from "@/lib/cms/products";
import { getCloudinaryResponsiveUrl } from "@/lib/cloudinary-client";
import { Sparkles, ArrowRight } from "lucide-react";

export default function BrandedPreloader() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [storePosters, setStorePosters] = useState<any[]>(cmsPosters);

  const handleDismiss = React.useCallback(() => {
    setIsVisible(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("polacraft_preloader_seen", "true");
    }
  }, []);

  useEffect(() => {
    // Fetch live catalog products from database
    fetch("/api/search")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          setStorePosters(data.products);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Desktop only check
    if (typeof window === "undefined") return;

    // Check if user is on mobile (<768px)
    if (window.innerWidth < 768) {
      return;
    }

    // Always show preloader on desktop view
    setIsVisible(true);
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const autoTimer = setTimeout(() => {
      handleDismiss();
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(autoTimer);
    };
  }, [isVisible, handleDismiss]);

  // Format real store posters for the cursor trail (optimized to w_320 thumbnails)
  const trailImages = (storePosters.length > 0 ? storePosters : []).map((p) => {
    const rawImg = typeof p === "string" ? p : (p.heroImage || p.galleryImages?.[0] || p.images?.[0]?.url);
    if (!rawImg || rawImg.includes("custom_grid_poster") || rawImg.includes("custom_single_poster")) return "";
    return getCloudinaryResponsiveUrl(rawImg, { width: 320, quality: "auto" });
  }).filter((url) => typeof url === "string" && url.trim() !== "");

  const finalTrailImages = trailImages.length > 0 ? trailImages : [
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749553/polacraft/products/gallery/ylrnc645hbsdz0qtzbso.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749525/polacraft/products/gallery/zvowpdluf7wwvni0mbsk.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749422/polacraft/products/gallery/rjszdp0hyjynj6mftfxl.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749368/polacraft/products/gallery/mgm8rfvwo5cdcao5gk7g.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749285/polacraft/products/gallery/jsvcud6oaxqmk3ciihiy.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749266/polacraft/products/gallery/ojpytfw4bn0abvn9mrye.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749228/polacraft/products/gallery/khtsmcgfwsg62mhatcrd.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749191/polacraft/products/gallery/mxtml0xdyif5auglh2nc.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749149/polacraft/products/gallery/pp8b5f2rvsiuyhcgxsej.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749103/polacraft/products/gallery/esjf6auafqj2wu1wiodk.jpg"
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="branded-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)", scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="desktop-only-preloader"
          onClick={handleDismiss}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            backgroundColor: "#0B0B0B",
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.08) 0%, rgba(11, 11, 11, 1) 75%)",
            color: "#FFFFFF",
            cursor: "none",
            userSelect: "none",
            overflow: "hidden"
          }}
        >
          <style jsx global>{`
            @media (max-width: 767px) {
              .desktop-only-preloader {
                display: none !important;
              }
            }
          `}</style>

          {/* CURSOR IMAGE TRAIL DECK LAYER */}
          <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <CursorImageTrail
              images={finalTrailImages}
              imageWidth={160}
              imageHeight={220}
              radius={8}
              fit="cover"
              position="center"
              frequency={42}
              visibleFor={0.35}
              showLabel={false}
              labelText=""
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* BRANDED CENTER CONTENT OVERLAY */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 10,
              padding: "2rem"
            }}
          >
            {/* BRAND LOGO MARK */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: "1.5rem" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/polacraft-white-logo-mark.png"
                alt="Polacraft"
                style={{ width: "72px", height: "72px", objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(255,255,255,0.2))" }}
              />
            </motion.div>

            {/* BADGE */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                padding: "0.35rem 0.9rem",
                borderRadius: "100px",
                marginBottom: "1.25rem"
              }}
            >
              <Sparkles size={13} style={{ color: "#D4AF37" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", color: "#EFECE6" }}>
                MALAYALAM CINEMA ARCHIVE
              </span>
            </div>

            {/* BRAND TITLE */}
            <h1
              style={{
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                fontWeight: "900",
                color: "#FFFFFF",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                margin: 0,
                lineHeight: 1,
                fontFamily: "var(--font-movault), 'Movault', var(--font-bebas-neue), 'Bebas Neue', sans-serif",
                textShadow: "0 0 30px rgba(0,0,0,0.8)"
              }}
            >
              POLACRAFT
            </h1>

            {/* INSTRUCTION CUE */}
            <p style={{ fontSize: "0.88rem", color: "#A1A1AA", marginTop: "1rem", letterSpacing: "0.05em", fontWeight: 600 }}>
              Move cursor to reveal cinema poster trail • Click anywhere to enter
            </p>

            {/* PROGRESS LOADER BAR */}
            <div
              style={{
                width: "220px",
                height: "3px",
                backgroundColor: "rgba(255,255,255,0.12)",
                borderRadius: "100px",
                marginTop: "2.25rem",
                overflow: "hidden",
                position: "relative"
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 0 10px rgba(255,255,255,0.8)"
                }}
              />
            </div>

            {/* ENTER BUTTON */}
            <button
              onClick={handleDismiss}
              style={{
                marginTop: "2rem",
                backgroundColor: "#FFFFFF",
                color: "#111111",
                padding: "0.75rem 1.85rem",
                borderRadius: "100px",
                fontSize: "0.85rem",
                fontWeight: "800",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                pointerEvents: "auto",
                boxShadow: "0 8px 25px rgba(255,255,255,0.15)",
                transition: "transform 0.2s ease"
              }}
            >
              Enter Store <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
