'use client';

import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from "lucide-react";
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

  return (
    <section id="best-sellers" className="bestsellers-section" style={{ padding: "5rem 0", backgroundColor: "#FAFAFA", position: "relative" }}>
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

        {/* Carousel Viewport */}
        <div ref={carouselRef} className="bestsellers-carousel">
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
              >
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="best-seller-art-wrapper"
                  style={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "#EFECE6",
                    border: "1px solid rgba(17, 17, 17, 0.08)",
                    cursor: "pointer"
                  }}
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
                  <div className="quick-actions-overlay">
                    <button
                      onClick={() => openQuickView(poster)}
                      className="quick-action-btn"
                      title="Quick View"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => addToCart(poster, "A4", "unframed", 1)}
                      className="quick-action-btn dark-btn"
                      title="Add to Cart"
                    >
                      <ShoppingBag size={14} />
                    </button>
                    <button
                      onClick={() => toggleWishlist(poster.id)}
                      className={`quick-action-btn ${isWish ? "wish-active" : ""}`}
                      title="Add to Wishlist"
                    >
                      <Heart size={14} fill={isWish ? "red" : "none"} />
                    </button>
                  </div>
                </motion.div>

                {/* Metadata Title & Price */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 0.2rem", marginTop: "0.5rem" }}>
                  <div style={{ minWidth: 0, flexGrow: 1, paddingRight: "0.4rem" }}>
                    <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111111", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {poster.title}
                    </h4>
                    <p style={{ fontSize: "0.72rem", color: "#666666", margin: "2px 0 0 0" }}>{poster.collection}</p>
                  </div>
                  <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "#111111", flexShrink: 0 }}>
                    ₹{poster.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .bestsellers-carousel {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 1.5rem;
          scrollbar-width: none;
        }
        .bestsellers-carousel::-webkit-scrollbar {
          display: none;
        }
        .bestseller-item {
          flex: 0 0 250px;
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
        }
        .best-seller-art-wrapper {
          padding: 1.25rem 0.85rem;
        }
        .quick-actions-overlay {
          position: absolute;
          bottom: 0.85rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.4rem;
          z-index: 10;
        }
        .quick-action-btn {
          background-color: #FAFAF8;
          color: #111111;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .quick-action-btn.dark-btn {
          background-color: #111111;
          color: #FAFAF8;
        }
        .quick-action-btn.wish-active {
          background-color: #FFF5F5;
          color: red;
        }

        @media (max-width: 640px) {
          .bestsellers-section {
            padding: 3rem 0 !important;
          }
          .bestsellers-carousel {
            gap: 0.6rem !important;
            padding: 0 0.5rem 1rem 0.5rem !important;
          }
          .bestseller-item {
            flex: 0 0 calc(50% - 0.3rem) !important;
            width: calc(50% - 0.3rem) !important;
            min-width: 140px !important;
            max-width: 190px !important;
          }
          .best-seller-art-wrapper {
            padding: 0.6rem 0.4rem !important;
            border-radius: 12px !important;
          }
          .quick-action-btn {
            width: 28px !important;
            height: 28px !important;
          }
        }
      `}</style>
    </section>
  );
}
