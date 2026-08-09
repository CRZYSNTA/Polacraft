'use client';

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Heart, ShoppingBag } from "lucide-react";
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
  const [activeSlide, setActiveSlide] = useState(1);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild?.clientWidth || 200;
      const scrollAmount = cardWidth + 12;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
      setActiveSlide((prev) => {
        if (direction === "left") return Math.max(1, prev - 1);
        return Math.min(bestSellers.length, prev + 1);
      });
    }
  };

  return (
    <section id="best-sellers" className="bestsellers-section" style={{ padding: "4rem 0 5rem 0", backgroundColor: "#FFFFFF", position: "relative" }}>
      <div className="container">
        
        {/* TOP CAROUSEL CONTROLLER COUNTER (< 1/8 >) */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", fontSize: "0.85rem", color: "#666666", fontWeight: "600" }}>
          <button 
            onClick={() => scroll("left")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: "4px" }}
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <span>{activeSlide}/{bestSellers.length || 8}</span>
          <button 
            onClick={() => scroll("right")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: "4px" }}
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* SECTION HEADER (BEST SELLING WITH DIAGONAL RED TAPE ACCENTS) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <div style={{ display: "inline-block", position: "relative" }}>
            <span style={{ position: "absolute", top: "-4px", left: "12px", width: "26px", height: "7px", backgroundColor: "#FF5533", opacity: 0.9, transform: "rotate(-18deg)", borderRadius: "1px" }} />
            <span style={{ position: "absolute", top: "-4px", right: "20px", width: "26px", height: "7px", backgroundColor: "#FF5533", opacity: 0.9, transform: "rotate(14deg)", borderRadius: "1px" }} />
            <h2 style={{ fontSize: "clamp(2.2rem, 6vw, 3.2rem)", fontWeight: "900", color: "#111111", letterSpacing: "0.06em", margin: 0, textTransform: "uppercase", fontFamily: "sans-serif" }}>
              BEST SELLING
            </h2>
          </div>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#666666", fontWeight: "700", marginTop: "0.5rem" }}>
            FAN FAVORITES : THE POSTERS EVERYONE'S TALKING ABOUT!
          </p>
        </motion.div>

        {/* CAROUSEL VIEWPORT (MATCHING POSTERIZED.IN EXACT MOBILE CARD RATIO & PEEK) */}
        <div ref={carouselRef} className="posterized-carousel-viewport">
          {bestSellers.map((poster, index) => {
            const isWish = wishlist.includes(poster.id);
            const originalPrice = Math.round(poster.price * 1.25);

            return (
              <div key={poster.id} className="posterized-card-item">
                <div className="posterized-image-container">
                  <Link href={`/product/${poster.slug}`} prefetch={true} style={{ display: "block", textDecoration: "none" }}>
                    <div style={{ transform: "scale(1.02)", transition: "transform 0.3s ease" }}>
                      <PosterRenderer poster={poster} frame="unframed" />
                    </div>
                  </Link>

                  {/* BLACK SALE BADGE (BOTTOM-LEFT OF IMAGE LIKE POSTERIZED.IN) */}
                  <span className="posterized-sale-badge">
                    Sale
                  </span>

                  {/* QUICK HOVER BUTTONS */}
                  <div className="quick-hover-actions">
                    <button onClick={() => openQuickView(poster)} title="Quick View">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => addToCart(poster, "A4", "unframed", 1)} title="Add to Cart">
                      <ShoppingBag size={14} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleWishlist(poster.id);
                      }} 
                      title="Wishlist"
                    >
                      <Heart size={14} fill={isWish ? "red" : "none"} color={isWish ? "red" : "#111"} />
                    </button>
                  </div>
                </div>

                {/* PRODUCT TITLE (CENTERED BELOW IMAGE) */}
                <h4 className="posterized-card-title">
                  <Link href={`/product/${poster.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    {poster.title}
                  </Link>
                </h4>

                {/* ORIGINAL & SALE PRICE (CENTERED LIKE POSTERIZED.IN) */}
                <div className="posterized-card-price">
                  <span className="original-price">Rs. {originalPrice}.00</span>
                  <span className="sale-price">From Rs. {poster.price}.00</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM PAGINATION COUNTER & VIEW ALL BUTTON */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", marginTop: "2.5rem" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.82rem", color: "#666666", fontWeight: "600" }}>
            <button 
              onClick={() => scroll("left")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: "4px" }}
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <span>{activeSlide}/24</span>
            <button 
              onClick={() => scroll("right")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: "4px" }}
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Link href="/shop" style={{ textDecoration: "none" }}>
            <button style={{
              backgroundColor: "#111111",
              color: "#FFFFFF",
              fontSize: "0.92rem",
              fontWeight: "700",
              padding: "0.85rem 2.5rem",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease"
            }}>
              View all
            </button>
          </Link>

        </div>

      </div>

      <style jsx>{`
        .posterized-carousel-viewport {
          display: flex;
          gap: 1.25rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 0.5rem 0 1.5rem 0;
          scrollbar-width: none;
        }
        .posterized-carousel-viewport::-webkit-scrollbar {
          display: none;
        }
        .posterized-card-item {
          flex: 0 0 280px;
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
        }
        .posterized-image-container {
          position: relative;
          background-color: #EFECE6;
          border-radius: 12px;
          overflow: hidden;
          padding: 1.5rem 1rem;
          border: 1px solid rgba(17,17,17,0.06);
        }
        .posterized-sale-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background-color: #111111;
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: 100px;
          z-index: 5;
        }
        .quick-hover-actions {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          gap: 0.35rem;
          z-index: 5;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .posterized-image-container:hover .quick-hover-actions {
          opacity: 1;
        }
        .quick-hover-actions button {
          background: #FFFFFF;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .posterized-card-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #111111;
          text-align: center;
          margin: 0.85rem 0 0.35rem 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .posterized-card-price {
          text-align: center;
          font-size: 0.85rem;
        }
        .original-price {
          text-decoration: line-through;
          color: #888888;
          font-size: 0.78rem;
          margin-right: 0.5rem;
        }
        .sale-price {
          color: #111111;
          font-weight: 700;
        }

        /* MOBILE VIEW (MATCHING POSTERIZED.IN SCREENSHOT: 2 FULL CARDS + 3RD PEEKING) */
        @media (max-width: 640px) {
          .posterized-carousel-viewport {
            gap: 0.75rem !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
          .posterized-card-item {
            flex: 0 0 45vw !important;
            min-width: 150px !important;
            max-width: 180px !important;
          }
          .posterized-image-container {
            padding: 0.75rem 0.5rem !important;
            border-radius: 8px !important;
          }
          .posterized-sale-badge {
            bottom: 8px !important;
            left: 8px !important;
            font-size: 0.65rem !important;
            padding: 0.2rem 0.5rem !important;
          }
          .posterized-card-title {
            font-size: 0.78rem !important;
            margin-top: 0.6rem !important;
          }
          .original-price {
            display: block !important;
            margin-right: 0 !important;
            font-size: 0.72rem !important;
          }
          .sale-price {
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </section>
  );
}
