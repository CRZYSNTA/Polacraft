"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  const freeShippingThreshold = 3000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 2000,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={closeCart}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          height: "100%",
          backgroundColor: "#FFF",
          boxShadow: "-10px 0 25px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #EFECE6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShoppingBag size={20} />
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>Your Bag ({itemCount})</h3>
          </div>
          <button onClick={closeCart} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div style={{ backgroundColor: "#F9FAFB", padding: "0.85rem 1.5rem", borderBottom: "1px solid #EFECE6", fontSize: "0.8rem" }}>
          {amountNeeded > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#475569" }}>
              <Truck size={14} style={{ color: "#10B981" }} /> Add <strong>₹{amountNeeded}</strong> more for <strong>FREE Shipping</strong>
            </div>
          ) : (
            <div style={{ color: "#047857", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Truck size={14} /> You unlocked FREE Express Shipping!
            </div>
          )}
          <div style={{ width: "100%", height: "6px", backgroundColor: "#E2E8F0", borderRadius: "3px", marginTop: "0.5rem", overflow: "hidden" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", backgroundColor: "#10B981", transition: "width 0.3s ease" }} />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flexGrow: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#888" }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
              <p style={{ margin: 0, fontWeight: 700 }}>Your bag is empty</p>
              <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>Explore our fine art cinema posters to get started.</p>
              <button onClick={closeCart} style={{ marginTop: "1.5rem", padding: "0.6rem 1.25rem", borderRadius: "10px", border: "1px solid #1E1E1E", background: "#1E1E1E", color: "#FFF", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice = Math.round(item.price * item.sizeMultiplier + item.framePrice);

              return (
                <div key={item.id} style={{ display: "flex", gap: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #F1F5F9", alignItems: "center" }}>
                  <div style={{ width: "64px", height: "80px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#1E1E1E", flexShrink: 0 }}>
                    {item.image && <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>

                  <div style={{ flexGrow: 1 }}>
                    <strong style={{ fontSize: "0.9rem", color: "#0F172A", display: "block" }}>{item.title}</strong>
                    <span style={{ fontSize: "0.75rem", color: "#64748B", display: "block" }}>
                      {item.size} • {item.frame}
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0F172A", marginTop: "4px", display: "block" }}>
                      ₹{itemPrice}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #E2E8F0", borderRadius: "6px" }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{ background: "none", border: "none", padding: "2px 6px", cursor: "pointer" }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, padding: "0 6px" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{ background: "none", border: "none", padding: "2px 6px", cursor: "pointer" }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Checkout Button */}
        {cart.length > 0 && (
          <div style={{ padding: "1.5rem", borderTop: "1px solid #EFECE6", backgroundColor: "#FFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
              <span style={{ color: "#64748B" }}>Subtotal:</span>
              <strong style={{ fontSize: "1.1rem" }}>₹{subtotal}</strong>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#94A3B8", margin: "0 0 1rem 0" }}>
              Taxes and shipping calculated at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={closeCart}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.9rem",
                borderRadius: "14px",
                backgroundColor: "#10B981",
                color: "#FFF",
                fontWeight: 800,
                textDecoration: "none",
                fontSize: "0.95rem",
                boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
              }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
