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
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="best-sellers" style={{ padding: "8rem 0", backgroundColor: "#FAFAFA", position: "relative" }}>
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
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: "900", color: "#111111", letterSpacing: "0.04em", margin: 0, textTransform: "uppercase" }}>
              BEST SELLING
            </h2>
          </div>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#666666", fontWeight: "700", marginTop: "0.4rem" }}>
            FAN FAVORITES: THE POSTERS EVERYONE'S TALKING ABOUT!
          </p>
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
                    backgroundColor: "#EFECE6",
                    border: "1px solid rgba(17, 17, 17, 0.08)",
                    padding: "1.75rem 1.25rem",
                    cursor: "pointer"
                  }}
                  className="best-seller-art-wrapper"
                >
                  <Link href={`/product/${poster.slug}`} prefetch={true} style={{ display: "block", textDecoration: "none" }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PosterRenderer poster={poster} frame="unframed" />
                    </motion.div>
                  </Link>

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
                        backgroundColor: "#FAFAF8",
                        color: "#111111",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
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
                        backgroundColor: "#111111",
                        color: "#FAFAF8",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
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
                        backgroundColor: isWish ? "#FFF5F5" : "#FAFAF8",
                        color: isWish ? "red" : "#111111",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      <Heart size={16} fill={isWish ? "red" : "none"} />
                    </motion.button>
                  </div>
                </motion.div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 0.25rem" }}>
                  <div>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#111111" }}>{poster.title}</h4>
                    <p style={{ fontSize: "0.8rem", color: "#666666" }}>{poster.collection}</p>
                  </div>
                  <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#111111" }}>
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
