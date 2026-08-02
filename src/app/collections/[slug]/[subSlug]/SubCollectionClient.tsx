"use client";

import React, { useState, useMemo, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "@/features/cart/AppContext";
import PosterRenderer from "@/components/PosterRenderer";
import Breadcrumb from "@/components/Breadcrumb";
import { Product } from "@/types";
import { sizes } from "@/lib/cms/products";
import { Search, Heart, ShoppingBag, Eye, CornerDownRight, ArrowUpDown } from "lucide-react";

export interface SubCollectionDetailObj {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  parentCollection: {
    id: string;
    name: string;
    slug?: string | null;
  };
}

export default function SubCollectionClient({
  subCollection,
  initialPosters,
}: {
  subCollection: SubCollectionDetailObj;
  initialPosters: Product[];
}) {
  const { addToCart, wishlist, toggleWishlist, openQuickView } = useContext(AppContext);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("default");
  const [cardSizes, setCardSizes] = useState<Record<string, string>>({});

  const handleCardSizeChange = (posterId: string, sizeId: string) => {
    setCardSizes((prev) => ({ ...prev, [posterId]: sizeId }));
  };

  const filteredPosters = useMemo(() => {
    return initialPosters
      .filter((poster) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            poster.title.toLowerCase().includes(q) ||
            poster.film.toLowerCase().includes(q) ||
            poster.director.toLowerCase().includes(q) ||
            poster.tagline.toLowerCase().includes(q)
          );
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
  }, [initialPosters, searchQuery, sortOption]);

  const parentSlug =
    subCollection.parentCollection.slug ||
    subCollection.parentCollection.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* HERO BANNER SECTION */}
      <section
        style={{
          paddingTop: "7.5rem",
          paddingBottom: "3.5rem",
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
            backgroundImage: "radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.18), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Breadcrumb
              items={[
                { label: "Collections", href: "/shop" },
                { label: subCollection.parentCollection.name, href: `/collections/${parentSlug}` },
                { label: subCollection.name },
              ]}
            />
          </div>

          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "#D4AF37", fontWeight: "700" }}>
            {subCollection.parentCollection.name} Sub Collection
          </span>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "900", letterSpacing: "-0.04em", margin: "0.5rem 0 1rem 0" }}>
            {subCollection.name} Movie Posters
          </h1>
          <p style={{ maxWidth: "650px", margin: "0 auto", fontSize: "1.05rem", color: "#A0A0A0", lineHeight: "1.6" }}>
            {subCollection.description || `Premium handcrafted ${subCollection.name} cinema posters printed on 250 GSM cotton fine art paper.`}
          </p>
        </div>
      </section>

      {/* CONTROLS TOOLBAR: BREADCRUMB METRICS & SORT */}
      <div style={{ maxWidth: "1350px", margin: "2.5rem auto 0 auto", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2.5rem",
            backgroundColor: "#FFFFFF",
            padding: "1.25rem 1.75rem",
            borderRadius: "20px",
            border: "1px solid rgba(17,17,17,0.08)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          }}
        >
          {/* Poster Count Metric */}
          <div>
            <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "#0F172A" }}>
              {filteredPosters.length} Posters Found
            </span>
            <p style={{ fontSize: "0.8rem", color: "#64748B", margin: "2px 0 0 0" }}>
              Curated under {subCollection.parentCollection.name} → {subCollection.name}
            </p>
          </div>

          {/* Search & Sort Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", minWidth: "260px" }}>
              <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search inside ${subCollection.name}...`}
                style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "100px", border: "1px solid #E2E8F0", fontSize: "0.85rem", backgroundColor: "#FAFAFA" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ArrowUpDown size={14} style={{ color: "#64748B" }} />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ padding: "0.65rem 1rem", borderRadius: "100px", border: "1px solid #E2E8F0", fontSize: "0.85rem", backgroundColor: "#FFF", fontWeight: 600, cursor: "pointer" }}
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-desc">Release: Newest</option>
                <option value="year-asc">Release: Vintage</option>
              </select>
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {filteredPosters.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem", backgroundColor: "#FFF", borderRadius: "24px", border: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: "1.35rem", fontWeight: "800", marginBottom: "0.5rem" }}>No Artworks in {subCollection.name}</h3>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>No posters currently match your filter criteria.</p>
            <Link
              href={`/collections/${parentSlug}`}
              style={{ display: "inline-block", marginTop: "1rem", padding: "0.65rem 1.25rem", borderRadius: "100px", backgroundColor: "#111", color: "#FFF", textDecoration: "none", fontWeight: 700 }}
            >
              Return to {subCollection.parentCollection.name} Collection
            </Link>
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
