"use client";

import React, { useState, useMemo, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "@/features/cart/AppContext";
import PosterRenderer from "@/components/PosterRenderer";
import Breadcrumb from "@/components/Breadcrumb";
import { Product } from "@/types";
import { sizes } from "@/lib/cms/products";
import { Search, Heart, ShoppingBag, Eye, SlidersHorizontal, Layers, CornerDownRight } from "lucide-react";

export interface SubCollectionObj {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  _count?: { products: number };
}

export interface CollectionObj {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  coverImage?: string | null;
  subCollections: SubCollectionObj[];
}

export default function CollectionClient({
  collection,
  initialPosters,
  activeSubSlug = "all",
}: {
  collection: CollectionObj;
  initialPosters: Product[];
  activeSubSlug?: string;
}) {
  const { addToCart, wishlist, toggleWishlist, openQuickView } = useContext(AppContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSubParam = searchParams.get("sub") || activeSubSlug;
  const [activeSub, setActiveSub] = useState<string>(currentSubParam.toLowerCase());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("default");
  const [cardSizes, setCardSizes] = useState<Record<string, string>>({});

  const handleCardSizeChange = (posterId: string, sizeId: string) => {
    setCardSizes((prev) => ({ ...prev, [posterId]: sizeId }));
  };

  const handleSubFilterClick = (subSlug: string) => {
    setActiveSub(subSlug);
    if (subSlug === "all") {
      router.push(`/collections/${collection.slug || collection.name.toLowerCase()}`, { scroll: false });
    } else {
      router.push(`/collections/${collection.slug || collection.name.toLowerCase()}?sub=${subSlug}`, { scroll: false });
    }
  };

  // Active sub-collection object if selected
  const activeSubObj = useMemo(() => {
    if (activeSub === "all") return null;
    return collection.subCollections.find(
      (s) => s.slug.toLowerCase() === activeSub.toLowerCase() || s.name.toLowerCase() === activeSub.toLowerCase()
    );
  }, [collection.subCollections, activeSub]);

  // Database-Level Filtered Posters
  const filteredPosters = useMemo(() => {
    return initialPosters
      .filter((poster) => {
        // Text Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            poster.title.toLowerCase().includes(q) ||
            poster.film.toLowerCase().includes(q) ||
            poster.director.toLowerCase().includes(q) ||
            poster.tagline.toLowerCase().includes(q);
          if (!match) return false;
        }

        // SubCollection Filter
        if (activeSub !== "all" && activeSubObj) {
          const posterCol = poster.collection.toLowerCase();
          const subName = activeSubObj.name.toLowerCase();
          const subSlugStr = activeSubObj.slug.toLowerCase();
          const matchSub = posterCol.includes(subName) || posterCol.includes(subSlugStr);
          if (!matchSub) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "price-low") return a.price - b.price;
        if (sortOption === "price-high") return b.price - a.price;
        if (sortOption === "year-desc") return b.year - a.year;
        if (sortOption === "year-asc") return a.year - b.year;
        return 0;
      });
  }, [initialPosters, searchQuery, activeSub, activeSubObj, sortOption]);

  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* HERO BANNER SECTION */}
      <section
        style={{
          paddingTop: "7.5rem",
          paddingBottom: "3rem",
          backgroundColor: "#111111",
          color: "#FAFAF8",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.15), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Breadcrumb
              items={[
                { label: "Collections", href: "/shop" },
                { label: collection.name },
                ...(activeSubObj ? [{ label: activeSubObj.name }] : []),
              ]}
            />
          </div>

          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "#D4AF37", fontWeight: "700" }}>
            Curated Vault Series
          </span>
          <h1 style={{ fontSize: "3.25rem", fontWeight: "900", letterSpacing: "-0.04em", margin: "0.5rem 0 1rem 0" }}>
            {activeSubObj ? `${activeSubObj.name} Posters` : `${collection.name} Collection`}
          </h1>
          <p style={{ maxWidth: "650px", margin: "0 auto", fontSize: "1rem", color: "#A0A0A0", lineHeight: "1.6" }}>
            {activeSubObj?.description || collection.description || `Explore museum-quality fine art posters curated in the ${collection.name} series.`}
          </p>
        </div>
      </section>

      {/* STICKY SUB COLLECTION FILTER BAR (Framed Motion Pills) */}
      {collection.subCollections.length > 0 && (
        <div
          style={{
            position: "sticky",
            top: "70px",
            zIndex: 40,
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(17,17,17,0.08)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            padding: "0.85rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: "1350px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            {/* Horizontal Scrollable Pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflowX: "auto", paddingBottom: "2px", scrollbarWidth: "none" }}>
              <button
                onClick={() => handleSubFilterClick("all")}
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  padding: "0.5rem 1.1rem",
                  borderRadius: "100px",
                  border: activeSub === "all" ? "1.5px solid #111" : "1px solid #E2E8F0",
                  backgroundColor: activeSub === "all" ? "#111" : "#FFF",
                  color: activeSub === "all" ? "#FFF" : "#475569",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                All {collection.name} ({initialPosters.length})
              </button>

              {collection.subCollections.map((sub) => {
                const isSelected = activeSub.toLowerCase() === sub.slug.toLowerCase() || activeSub.toLowerCase() === sub.name.toLowerCase();

                return (
                  <motion.button
                    key={sub.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSubFilterClick(sub.slug)}
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      padding: "0.5rem 1.1rem",
                      borderRadius: "100px",
                      border: isSelected ? "1.5px solid #D4AF37" : "1px solid #E2E8F0",
                      backgroundColor: isSelected ? "#111" : "#FFF",
                      color: isSelected ? "#D4AF37" : "#334155",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      boxShadow: isSelected ? "0 4px 12px rgba(212, 175, 55, 0.2)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <CornerDownRight size={13} style={{ color: isSelected ? "#D4AF37" : "#94A3B8" }} />
                    {sub.name}
                  </motion.button>
                );
              })}
            </div>

            {/* Poster Count Badge */}
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B" }}>
              Showing {filteredPosters.length} Artwork Prints
            </span>
          </div>
        </div>
      )}

      {/* CONTROLS BAR: SEARCH & SORT */}
      <div style={{ maxWidth: "1350px", margin: "2rem auto 0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 280px", maxWidth: "400px" }}>
            <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this collection..."
              style={{ width: "100%", padding: "0.65rem 1rem 0.65rem 2.5rem", borderRadius: "100px", border: "1px solid #E2E8F0", fontSize: "0.85rem", backgroundColor: "#FFF" }}
            />
          </div>

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ padding: "0.65rem 1rem", borderRadius: "100px", border: "1px solid #E2E8F0", fontSize: "0.85rem", backgroundColor: "#FFF", fontWeight: 600, cursor: "pointer" }}
          >
            <option value="default">Sort: Curated Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="year-desc">Release: Newest First</option>
            <option value="year-asc">Release: Vintage Classics</option>
          </select>
        </div>

        {/* PRODUCTS GRID */}
        {filteredPosters.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem", backgroundColor: "#FFF", borderRadius: "24px", border: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: "1.35rem", fontWeight: "800", marginBottom: "0.5rem" }}>No Artworks Found</h3>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Try resetting your search query or choosing another sub collection.</p>
            <button onClick={() => { setSearchQuery(""); handleSubFilterClick("all"); }} style={{ marginTop: "1rem", padding: "0.65rem 1.25rem", borderRadius: "100px", backgroundColor: "#111", color: "#FFF", border: "none", fontWeight: 700, cursor: "pointer" }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
            {filteredPosters.map((poster) => {
              const isWish = wishlist.includes(poster.id);
              const selectedSize = cardSizes[poster.id] || "A5";
              const currentSizeObj = sizes.find((s) => s.id === selectedSize) || sizes[0];
              const displayPrice = poster.price + currentSizeObj.priceModifier;

              return (
                <div
                  key={poster.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "20px",
                    padding: "1.25rem",
                    border: "1px solid rgba(17,17,17,0.06)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  className="hover-card"
                >
                  <div>
                    <div onClick={() => router.push(`/product/${poster.slug}`)} style={{ cursor: "pointer", position: "relative", marginBottom: "1.25rem", overflow: "hidden", borderRadius: "12px" }}>
                      <PosterRenderer poster={poster} selectedSize={selectedSize} />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(poster.id);
                        }}
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          right: "0.75rem",
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(255,255,255,0.9)",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: isWish ? "#EF4444" : "#111",
                        }}
                      >
                        <Heart size={18} fill={isWish ? "#EF4444" : "none"} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickView(poster);
                        }}
                        style={{
                          position: "absolute",
                          bottom: "0.75rem",
                          right: "0.75rem",
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(17,17,17,0.85)",
                          color: "#FFF",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Eye size={18} />
                      </button>
                    </div>

                    <Link href={`/product/${poster.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: "0 0 0.25rem 0", color: "#111" }}>
                        {poster.title}
                      </h3>
                    </Link>

                    <p style={{ fontSize: "0.85rem", color: "#666", margin: "0 0 1rem 0" }}>
                      {poster.film} ({poster.year}) • {poster.director}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem" }}>
                      {sizes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleCardSizeChange(poster.id, s.id)}
                          style={{
                            flex: 1,
                            padding: "0.35rem 0",
                            borderRadius: "8px",
                            border: selectedSize === s.id ? "1.5px solid #111" : "1px solid #E5E7EB",
                            backgroundColor: selectedSize === s.id ? "#111" : "#FFF",
                            color: selectedSize === s.id ? "#FFF" : "#444",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F3F3F0", paddingTop: "0.85rem" }}>
                      <div>
                        <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#888", display: "block", fontWeight: "700" }}>Price</span>
                        <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "#111" }}>₹{displayPrice}</span>
                      </div>

                      <button
                        onClick={() => addToCart(poster, selectedSize, "unframed", 1)}
                        style={{
                          padding: "0.65rem 1.1rem",
                          borderRadius: "100px",
                          border: "none",
                          backgroundColor: "#10B981",
                          color: "#FFF",
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <ShoppingBag size={15} /> Add to Order
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
