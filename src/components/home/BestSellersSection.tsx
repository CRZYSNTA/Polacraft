'use client';

import React, { useRef } from "react";
import Link from "next/link";
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
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="best-sellers" className="bestsellers-section" style={{ padding: "6rem 0", backgroundColor: "#FAFAFA", position: "relative" }}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <div style={{ display: "inline-block", position: "relative" }}>
            <span style={{ position: "absolute", top: "-5px", left: "15px", width: "28px", height: "8px", backgroundColor: "#FF6B6B", opacity: 0.85, transform: "rotate(-15deg)" }} />
            <span style={{ position: "absolute", top: "-5px", right: "25px", width: "28px", height: "8px", backgroundColor: "#FF6B6B", opacity: 0.85, transform: "rotate(12deg)" }} />
            <h2 style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)", fontWeight: "900", color: "#111111", letterSpacing: "0.04em", margin: 0, textTransform: "uppercase" }}>
              BEST SELLING
            </h2>
          </div>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#666666", fontWeight: "700", marginTop: "0.4rem" }}>
            FAN FAVORITES: THE POSTERS EVERYONE'S TALKING ABOUT!
          </p>
        </motion.div>

        {/* Carousel Viewport (2+ Visible Cards on Mobile View) */}
        <div
          ref={carouselRef}
          style={{
            display: "flex",
            gap: "1.5rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: "1.5rem",
            scrollbarWidth: "none"
          }}
          className="bestsellers-carousel"
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
                className="bestseller-item"
                style={{
                  flex: "0 0 260px",
                  scrollSnapAlign: "start",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem"
                }}
              >
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "#EFECE6",
                    border: "1px solid rgba(17, 17, 17, 0.08)",
                    padding: "1.25rem 0.85rem",
                    cursor: "pointer"
                  }}
                  className="best-seller-art-wrapper"
                >
                  <Link href={`/product/${poster.slug}`} prefetch={true} style={{ display: "block", textDecoration: "none" }}>
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PosterRenderer poster={poster} frame="unframed" />
                    </motion.div>
                  </Link>

                  {/* Quick Actions overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.85rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "0.4rem",
                      zIndex: 10
                    }}
                  >
                    <button
                      onClick={() => openQuickView(poster)}
                      style={{
                        backgroundColor: "#FAFAF8",
                        color: "#111111",
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                      title="Quick View"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => addToCart(poster, "A4", "unframed", 1)}
                      style={{
                        backgroundColor: "#111111",
                        color: "#FAFAF8",
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontWeight: "700"
                      }}
                      title="Add to Cart"
                    >
                      <ShoppingBag size={14} />
                    </button>
                    <button
                      onClick={() => toggleWishlist(poster.id)}
                      style={{
                        backgroundColor: isWish ? "#FFF5F5" : "#FAFAF8",
                        color: isWish ? "red" : "#111111",
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                      title="Add to Wishlist"
                    >
                      <Heart size={14} fill={isWish ? "red" : "none"} />
                    </button>
                  </div>
                </motion.div>

                {/* Metadata Title & Price */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 0.25rem" }}>
                  <div style={{ minWidth: 0, flexGrow: 1, paddingRight: "0.5rem" }}>
                    <h4 style={{ fontSize: "0.88rem", fontWeight: "700", color: "#111111", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {poster.title}
                    </h4>
                    <p style={{ fontSize: "0.72rem", color: "#666666", margin: "2px 0 0 0" }}>{poster.collection}</p>
                  </div>
                  <span style={{ fontSize: "0.92rem", fontWeight: "800", color: "#111111", flexShrink: 0 }}>
                    ₹{poster.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .bestsellers-section {
            padding: 4rem 0 !important;
          }
          .bestsellers-carousel {
            gap: 0.75rem !important;
          }
          .bestseller-item {
            flex: 0 0 calc(48% - 0.25rem) !important;
            min-width: 150px !important;
          }
          .best-seller-art-wrapper {
            padding: 0.75rem 0.5rem !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
