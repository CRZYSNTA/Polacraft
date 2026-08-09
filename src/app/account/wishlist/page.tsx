"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import PosterRenderer from "@/components/PosterRenderer";

export default function AccountWishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch("/api/auth/me?t=" + Date.now(), { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.user?.wishlists) {
            setWishlistItems(data.user.wishlists);
          }
        }
      } catch (e) {
        console.warn("[Wishlist Fetch Error]:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

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
            {wishlistItems.length} {wishlistItems.length === 1 ? "Saved Item" : "Saved Items"}
          </span>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "5rem 0" }}>
            <Loader2 size={32} className="animate-spin" style={{ color: "#111111" }} />
          </div>
        ) : wishlistItems.length === 0 ? (
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
            {wishlistItems.map((item) => {
              const poster = item.product;
              if (!poster) return null;

              return (
                <div 
                  key={item.id} 
                  style={{ 
                    backgroundColor: "#FFFFFF", 
                    borderRadius: "20px", 
                    padding: "1.25rem", 
                    border: "1px solid rgba(17,17,17,0.08)",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ position: "relative", backgroundColor: "#EFECE6", borderRadius: "14px", overflow: "hidden", padding: "1.25rem 0.85rem", marginBottom: "1rem" }}>
                      <Link href={`/product/${poster.slug}`} style={{ display: "block" }}>
                        <PosterRenderer poster={poster} frame="unframed" />
                      </Link>
                    </div>

                    <h4 style={{ color: "#111111", fontSize: "0.95rem", fontWeight: 800, margin: "0 0 0.25rem 0", lineHeight: "1.3" }}>
                      {poster.title}
                    </h4>
                    <p style={{ color: "#666666", fontSize: "0.78rem", margin: "0 0 0.85rem 0" }}>
                      {poster.collection} • {poster.year}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.85rem", borderTop: "1px solid #F3F4F6" }}>
                    <span style={{ fontSize: "1rem", fontWeight: "900", color: "#111111" }}>
                      ₹{poster.price.toLocaleString("en-IN")}
                    </span>
                    <Link 
                      href={`/product/${poster.slug}`} 
                      style={{ 
                        fontSize: "0.8rem", 
                        fontWeight: "800", 
                        backgroundColor: "#111111", 
                        color: "#FFFFFF", 
                        padding: "0.5rem 0.95rem", 
                        borderRadius: "10px", 
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
