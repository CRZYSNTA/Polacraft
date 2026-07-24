"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, Loader2, ShoppingBag } from "lucide-react";

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
    <div style={{ minHeight: "100vh", backgroundColor: "#0B0C10", color: "#F3F4F6", paddingTop: "120px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        <Link href="/account" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#D4AF37", textDecoration: "none", fontSize: "0.9rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#FFFFFF", marginBottom: "0.5rem" }}>
          My Saved Wishlist
        </h1>
        <p style={{ color: "#9CA3AF", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Curated selection of archival fine art cinema posters you have saved.
        </p>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
            <Loader2 size={32} className="animate-spin" style={{ color: "#D4AF37" }} />
          </div>
        ) : wishlistItems.length === 0 ? (
          <div style={{ backgroundColor: "#12141A", borderRadius: "24px", padding: "4rem 2rem", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Heart size={48} style={{ color: "#EF4444", marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.25rem", color: "#FFFFFF", fontWeight: 800, margin: "0 0 0.5rem 0" }}>Your Wishlist is Empty</h3>
            <p style={{ color: "#9CA3AF", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Tap the heart icon on any cinema poster in our gallery to save it here!</p>
            <Link href="/shop" style={{ padding: "0.8rem 1.5rem", borderRadius: "12px", backgroundColor: "#D4AF37", color: "#111", fontWeight: 800, textDecoration: "none", display: "inline-block" }}>
              Explore Gallery
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {wishlistItems.map((item) => (
              <div key={item.id} style={{ backgroundColor: "#12141A", borderRadius: "20px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h4 style={{ color: "#FFF", fontSize: "1rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>{item.product?.title}</h4>
                <Link href={`/product/${item.product?.slug}`} style={{ fontSize: "0.85rem", color: "#D4AF37", textDecoration: "none", fontWeight: 700 }}>
                  View Poster →
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
