"use client";

import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import PosterRenderer from "@/components/PosterRenderer";
import { AppContext } from "@/features/cart/AppContext";
import { posters as cmsPosters } from "@/lib/cms/products";

export default function AccountWishlistPage() {
  const context = useContext(AppContext);
  const wishlistIds = context?.wishlist || [];
  const toggleWishlist = context?.toggleWishlist;

  const [savedProducts, setSavedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const wishlistKey = wishlistIds.join(",");

  useEffect(() => {
    async function loadWishlistProducts() {
      try {
        setLoading(true);

        // Fetch public products from search API
        let allProducts: any[] = [];
        try {
          const res = await fetch("/api/search");
          if (res.ok) {
            const data = await res.json();
            allProducts = data.products || [];
          }
        } catch (e) {
          console.warn("[Search API Fetch Warning]:", e);
        }

        // Fallback/merge with local CMS posters if DB is empty or missing items
        const mergedCatalogMap = new Map();
        [...allProducts, ...cmsPosters].forEach((p) => {
          if (p && p.id && !mergedCatalogMap.has(p.id)) {
            mergedCatalogMap.set(p.id, p);
          }
          if (p && p.slug && !mergedCatalogMap.has(p.slug)) {
            mergedCatalogMap.set(p.slug, p);
          }
        });

        // Also check server user wishlist endpoint
        let dbProductIds: string[] = [];
        try {
          const dbRes = await fetch("/api/auth/wishlist");
          if (dbRes.ok) {
            const dbData = await dbRes.json();
            dbProductIds = (dbData.wishlists || []).map((w: any) => w.productId);
          }
        } catch (e) {
          console.warn("[Wishlist DB Load Warning]:", e);
        }

        const combinedIds = Array.from(new Set([...wishlistIds, ...dbProductIds]));
        const matched: any[] = [];
        const addedSet = new Set();

        combinedIds.forEach((id) => {
          const found = mergedCatalogMap.get(id);
          if (found && !addedSet.has(found.id || found.slug)) {
            addedSet.add(found.id || found.slug);
            matched.push(found);
          }
        });

        setSavedProducts(matched);
      } catch (e) {
        console.warn("[Wishlist Load Error]:", e);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistProducts();
  }, [wishlistKey]);

  const handleRemove = (productId: string) => {
    if (toggleWishlist) {
      toggleWishlist(productId);
    }
    setSavedProducts((prev) => prev.filter((p) => p && p.id !== productId && p.slug !== productId));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", color: "#111111", paddingTop: "110px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        <Link href="/account" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#111111", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#111111", margin: 0, letterSpacing: "-0.02em" }}>
              My Saved Wishlist
            </h1>
            <p style={{ color: "#666666", fontSize: "0.9rem", marginTop: "0.35rem" }}>
              Curated selection of archival fine art cinema posters you have saved.
            </p>
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", backgroundColor: "#FFFFFF", color: "#111111", border: "1px solid rgba(17,17,17,0.1)", padding: "0.35rem 0.85rem", borderRadius: "100px" }}>
            {savedProducts.length} {savedProducts.length === 1 ? "Saved Item" : "Saved Items"}
          </span>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "5rem 0" }}>
            <Loader2 size={32} className="animate-spin" style={{ color: "#111111" }} />
          </div>
        ) : savedProducts.length === 0 ? (
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "5rem 2rem", textAlign: "center", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#FFF5F5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem auto" }}>
              <Heart size={28} style={{ color: "#EF4444" }} />
            </div>
            <h3 style={{ fontSize: "1.25rem", color: "#111111", fontWeight: 800, margin: "0 0 0.5rem 0" }}>Your Wishlist is Empty</h3>
            <p style={{ color: "#666666", fontSize: "0.9rem", marginBottom: "1.75rem", maxWidth: "42ch", margin: "0 auto 1.75rem auto" }}>
              Tap the heart icon on any cinema poster in our gallery to save your favorite prints here.
            </p>
            <Link href="/shop" style={{ padding: "0.85rem 1.85rem", borderRadius: "14px", backgroundColor: "#111111", color: "#FFFFFF", fontWeight: 800, textDecoration: "none", fontSize: "0.9rem", display: "inline-block", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              Explore Gallery
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {savedProducts.map((poster) => {
              if (!poster) return null;

              const collectionName = poster.collection || poster.collectionName || poster.film || "Archival Collection";
              const releaseYear = poster.year || poster.releaseYear || "2024";
              const rawPrice = Number(poster.price ?? 499);
              const formattedPrice = isNaN(rawPrice) ? "499" : rawPrice.toLocaleString("en-IN");
              const posterKey = poster.id || poster.slug || Math.random().toString();

              return (
                <div 
                  key={posterKey} 
                  style={{ 
                    backgroundColor: "#FFFFFF", 
                    borderRadius: "20px", 
                    padding: "1.25rem", 
                    border: "1px solid rgba(17,17,17,0.08)",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative"
                  }}
                >
                  <div>
                    <div style={{ position: "relative", backgroundColor: "#EFECE6", borderRadius: "14px", overflow: "hidden", padding: "1.25rem 0.85rem", marginBottom: "1rem" }}>
                      <Link href={`/product/${poster.slug || poster.id}`} style={{ display: "block" }}>
                        <PosterRenderer poster={poster} frame="unframed" />
                      </Link>
                      <button
                        onClick={() => handleRemove(poster.id || poster.slug)}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          backgroundColor: "#FFFFFF",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                          color: "#EF4444"
                        }}
                        title="Remove from Wishlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <h4 style={{ color: "#111111", fontSize: "0.95rem", fontWeight: 800, margin: "0 0 0.25rem 0", lineHeight: "1.3" }}>
                      {poster.title || "Cinema Poster"}
                    </h4>
                    <p style={{ color: "#666666", fontSize: "0.78rem", margin: "0 0 0.85rem 0" }}>
                      {collectionName} • {releaseYear}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.85rem", borderTop: "1px solid #F3F4F6" }}>
                    <span style={{ fontSize: "1rem", fontWeight: "900", color: "#111111" }}>
                      ₹{formattedPrice}
                    </span>
                    <Link 
                      href={`/product/${poster.slug || poster.id}`} 
                      style={{ 
                        fontSize: "0.8rem", 
                        fontWeight: "800", 
                        backgroundColor: "#111111", 
                        color: "#FFFFFF", 
                        padding: "0.5rem 0.95rem", 
                        borderRadius: "100px", 
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem"
                      }}
                    >
                      <ShoppingBag size={13} /> View Print
                    </Link>
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
