'use client';

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, Heart, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import PosterRenderer from "../PosterRenderer";
import { Product } from "@/types";

interface BestSellersSectionProps {
  bestSellers: Product[];
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  openQuickView: (product: Product) => void;
  addToCart: (product: Product, size: string, frame: string, quantity: number) => void;
}

export default function BestSellersSection({
  bestSellers,
  wishlist,
  toggleWishlist,
  openQuickView,
  addToCart
}: BestSellersSectionProps) {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="best-sellers" style={{ padding: "8rem 0", backgroundColor: "#0D0D0F", position: "relative" }}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3.5rem" }}
        >
          <div>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#D4AF37", fontWeight: "700" }}>
              Most Coveted Art
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "900", color: "#FAFAFA", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>
              Best Sellers
            </h2>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollCarousel("left")}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                color: "#FAFAFA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <ArrowLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollCarousel("right")}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                backgroundColor: "rgba(212, 175, 55, 0.1)",
                color: "#D4AF37",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Carousel Viewport */}
        <div
          ref={carouselRef}
          style={{
            display: "flex",
            gap: "2rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: "2rem",
            scrollbarWidth: "none"
          }}
          className="carousel-viewport"
        >
          {bestSellers.map((poster, index) => {
            const isWish = wishlist.includes(poster.id);
            return (
              <motion.div
                key={poster.id}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                style={{
                  flex: "0 0 290px",
                  scrollSnapAlign: "start",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem"
                }}
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: "relative",
                    borderRadius: "20px",
                    overflow: "hidden",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "1.75rem 1.25rem",
                    cursor: "pointer"
                  }}
                  className="best-seller-art-wrapper"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.35 }}
                    onClick={() => router.push(`/product/${poster.slug}`)}
                  >
                    <PosterRenderer poster={poster} frame="unframed" />
                  </motion.div>

                  {/* Hover Buttons */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1.25rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "0.5rem",
                      zIndex: 10
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => openQuickView(poster)}
                      style={{
                        backgroundColor: "rgba(10, 10, 12, 0.85)",
                        backdropFilter: "blur(10px)",
                        color: "#FAFAFA",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      <Eye size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => addToCart(poster, "A4", "unframed", 1)}
                      style={{
                        backgroundColor: "#D4AF37",
                        color: "#0A0A0C",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontWeight: "700"
                      }}
                    >
                      <ShoppingBag size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => toggleWishlist(poster.id)}
                      style={{
                        backgroundColor: isWish ? "rgba(239, 68, 68, 0.2)" : "rgba(10, 10, 12, 0.85)",
                        backdropFilter: "blur(10px)",
                        color: isWish ? "#EF4444" : "#FAFAFA",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: isWish ? "1px solid #EF4444" : "1px solid rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      <Heart size={16} fill={isWish ? "#EF4444" : "none"} />
                    </motion.button>
                  </div>
                </motion.div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 0.25rem" }}>
                  <div>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#FAFAFA" }}>{poster.title}</h4>
                    <p style={{ fontSize: "0.8rem", color: "#A1A1AA" }}>{poster.collection}</p>
                  </div>
                  <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#D4AF37" }}>
                    ₹{poster.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
