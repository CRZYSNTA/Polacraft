"use client";

import React, { useState } from "react";
import { useApp } from "@/features/cart/AppContext";
import { ShoppingBag, ShieldCheck, Tag, Lock, CheckCircle2, Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useApp();

  // Address & Contact inputs
  const [shippingName, setShippingName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingStreet, setShippingStreet] = useState("");
  const [shippingCity, setShippingCity] = useState("Kochi");
  const [shippingState, setShippingState] = useState("Kerala");
  const [shippingZip, setShippingZip] = useState("682001");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Financial Calculations
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const subtotalAfterDiscount = Math.max(0, cartSubtotal - discount);
  const shippingCost = cartSubtotal >= 3000 ? 0 : 150;
  const total = subtotalAfterDiscount + shippingCost;

  // Apply Coupon Action
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponError("");
    setValidatingCoupon(true);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal: cartSubtotal }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setAppliedCoupon(data);
      } else {
        setCouponError(data.error || "Invalid coupon code.");
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error("[Coupon Error]:", err);
      setCouponError("Failed to apply coupon.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePlaceOrderWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      setIsProcessing(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingName,
          email,
          phone,
          shippingStreet,
          shippingCity,
          shippingState,
          shippingZip,
          shippingCountry: "India",
          paymentMethod: "WHATSAPP_UPI",
          couponCode: appliedCoupon?.code || "",
          discount,
          subtotal: cartSubtotal,
          shippingCost,
          total,
          items: cart.map((item) => ({
            productId: item.posterId,
            productTitle: item.title,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            frame: item.frame,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.order && data.whatsappUrl) {
        setCompletedOrder(data.order);
        clearCart();

        // Redirect immediately to WhatsApp with pre-filled order message
        window.location.href = data.whatsappUrl;
      } else {
        alert("Checkout Error: " + (data.error || "Failed to place order"));
      }
    } catch (err) {
      console.error("[Checkout Error]:", err);
      alert("An unexpected error occurred during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (completedOrder) {
    return (
      <div style={{ maxWidth: "650px", margin: "4rem auto", padding: "2.5rem", backgroundColor: "#FFF", borderRadius: "24px", border: "1px solid #EFECE6", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", textAlign: "center" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#ECFDF5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto" }}>
          <CheckCircle2 size={36} />
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: "900", margin: "0 0 0.5rem 0" }}>Order Received!</h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
          Your order <strong>#{completedOrder.orderNumber}</strong> has been saved. WhatsApp has opened to confirm details and complete payment via UPI.
        </p>

        <div style={{ padding: "1.25rem", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #E2E8F0", textAlign: "left", fontSize: "0.85rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#64748B" }}>Order Reference:</span>
            <strong>#{completedOrder.orderNumber}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#64748B" }}>Destination:</span>
            <span>{completedOrder.shippingCity}, {completedOrder.shippingState}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#64748B" }}>Total Payable:</span>
            <strong style={{ color: "#10B981" }}>₹{completedOrder.total}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#64748B" }}>Order Status:</span>
            <span style={{ fontWeight: 800, color: "#2563EB", backgroundColor: "#DBEAFE", padding: "2px 8px", borderRadius: "6px" }}>
              WHATSAPP_PENDING
            </span>
          </div>
        </div>

        <Link href="/shop" style={{ display: "inline-block", padding: "0.85rem 2rem", borderRadius: "12px", backgroundColor: "#1E1E1E", color: "#FFF", textDecoration: "none", fontWeight: 800, fontSize: "0.9rem" }}>
          Back to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#64748B", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700, marginBottom: "2rem" }}>
        <ArrowLeft size={16} /> Return to Storefront
      </Link>

      <h1 style={{ fontSize: "2.25rem", fontWeight: "900", margin: "0 0 2rem 0", letterSpacing: "-0.03em" }}>
        Express WhatsApp Checkout
      </h1>

      <form onSubmit={handlePlaceOrderWhatsApp} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2.5rem" }}>
        {/* Shipping & Contact Information */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "2rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.1rem", fontWeight: "800" }}>1. Customer & Contact Info</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Full Name *</label>
                <input type="text" required value={shippingName} onChange={(e) => setShippingName(e.target.value)} placeholder="John Doe" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.9rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>WhatsApp Phone # *</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.9rem" }} />
              </div>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.9rem" }} />
            </div>
          </div>

          <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "2rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.1rem", fontWeight: "800" }}>2. Delivery Address</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Street / Building Address *</label>
                <input type="text" required value={shippingStreet} onChange={(e) => setShippingStreet(e.target.value)} placeholder="ABC House, Palakkad Road" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.9rem" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>City *</label>
                  <input type="text" required value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.9rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>State *</label>
                  <input type="text" required value={shippingState} onChange={(e) => setShippingState(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.9rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Pincode *</label>
                  <input type="text" required value={shippingZip} onChange={(e) => setShippingZip(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.9rem" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Coupon Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Coupon Code Card */}
          <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Tag size={16} style={{ color: "#10B981" }} /> Apply Discount Coupon
            </h4>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="Try WELCOME10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ flexGrow: 1, padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", textTransform: "uppercase" }}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={validatingCoupon || !couponCode.trim()}
                style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "none", backgroundColor: "#1E1E1E", color: "#FFF", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
              >
                {validatingCoupon ? "Checking..." : "Apply"}
              </button>
            </div>

            {appliedCoupon && (
              <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#047857", backgroundColor: "#ECFDF5", padding: "0.5rem 0.75rem", borderRadius: "6px", fontWeight: 700 }}>
                ✓ Coupon "{appliedCoupon.code}" applied! Saved ₹{appliedCoupon.discountAmount}.
              </div>
            )}

            {couponError && (
              <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#DC2626", backgroundColor: "#FEE2E2", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
                {couponError}
              </div>
            )}
          </div>

          {/* Order Totals Card */}
          <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "2rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.1rem", fontWeight: "800" }}>Order Summary</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {cart.map((item) => (
                <div key={item.cartId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                  <div>
                    <strong>{item.title}</strong>
                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{item.size} • {item.frame} x{item.quantity}</div>
                  </div>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Subtotal:</span>
                <span>₹{cartSubtotal}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#10B981", fontWeight: 700 }}>
                  <span>Coupon Discount ({appliedCoupon?.code}):</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Shipping Fee:</span>
                <span>{shippingCost === 0 ? <strong style={{ color: "#10B981" }}>FREE</strong> : `₹${shippingCost}`}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #0F172A", paddingTop: "0.75rem", marginTop: "0.5rem", fontWeight: 900, fontSize: "1.15rem" }}>
                <span>Final Total:</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || cart.length === 0}
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "1rem",
                borderRadius: "14px",
                border: "none",
                backgroundColor: "#25D366", // WhatsApp Green
                color: "#FFF",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: isProcessing ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 14px rgba(37, 211, 102, 0.3)",
              }}
            >
              {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <MessageSquare size={20} />}
              {isProcessing ? "Saving Order..." : "Place Order via WhatsApp"}
            </button>

            <p style={{ fontSize: "0.75rem", color: "#64748B", textAlign: "center", marginTop: "0.75rem", margin: "0.75rem 0 0 0" }}>
              Saves order `#POLA-...` to database & opens pre-filled WhatsApp message.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
