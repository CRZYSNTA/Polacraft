'use client';

import React, { useContext, useState } from "react";
import { AppContext } from "../features/cart/AppContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, Tag, Truck } from "lucide-react";
import { calculateShippingFee, FREE_SHIPPING_THRESHOLD } from "../lib/commerce";

export const CartDrawer = () => {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateCartQty,
    cartSubtotal,
  } = useContext(AppContext);

  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // in percentage
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const shippingCost = cartSubtotal === 0 ? 0 : calculateShippingFee(cartSubtotal);
  const finalTotal = Math.max(0, cartSubtotal * (1 - discount / 100)) + shippingCost;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "MAMMOOTTY" || code === "MOHANLAL" || code === "POLACRAFT20") {
      setDiscount(20);
      setCouponApplied(true);
      setCouponError("");
    } else if (code === "") {
      setCouponError("Please enter a code");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const handleProceedToCheckout = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#000000",
              zIndex: 2000,
              cursor: "pointer"
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "100%",
              maxWidth: "480px",
              height: "100%",
              backgroundColor: "var(--bg-warm)",
              boxShadow: "-10px 0 30px rgba(0,0,0,0.05)",
              zIndex: 2001,
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid var(--border-color)"
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--border-color)"
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Your Gallery Bag</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                style={{
                  cursor: "pointer",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "var(--accent-beige)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "var(--transition-fast)"
                }}
                className="close-drawer-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div
              style={{
                flexGrow: 1,
                overflowY: "auto",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem"
              }}
            >
              {cart.length === 0 ? (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "1rem"
                  }}
                >
                  <span style={{ fontSize: "3rem" }}>🖼️</span>
                  <h4 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Your gallery wall is empty</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "25ch" }}>
                    Explore our cinematic poster collections to start styling your home.
                  </p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      router.push("/shop");
                    }}
                    className="btn-magnetic btn-primary"
                    style={{ padding: "0.8rem 1.8rem", fontSize: "0.9rem", marginTop: "1rem" }}
                  >
                    Start Curating
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartId}
                    style={{
                      display: "flex",
                      gap: "1.25rem",
                      paddingBottom: "1.5rem",
                      borderBottom: "1px solid rgba(17, 17, 17, 0.04)"
                    }}
                  >
                    {/* Poster Thumbnail */}
                    <div
                      style={{
                        width: "80px",
                        height: "113px",
                        backgroundColor: item.bgColor,
                        color: item.textColor,
                        borderRadius: "8px",
                        padding: "8px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                        flexShrink: 0,
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      <span style={{ fontSize: "0.45rem", fontWeight: "700", opacity: 0.6 }}>POLACRAFT</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: "800", lineHeight: 1.1, wordBreak: "break-word" }}>
                        {item.title}
                      </span>
                      <span style={{ fontSize: "0.35rem", opacity: 0.5 }}>{item.size}</span>
                      
                      {/* Mini Paper texture overlay */}
                      <div style={{
                        position: "absolute",
                        top: 0, left: 0, width: "100%", height: "100%",
                        opacity: "0.08", pointerEvents: "none",
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
                      }} />
                    </div>

                    {/* Details */}
                    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: "600", letterSpacing: "-0.01em" }}>{item.title}</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                          {item.film}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                          Size: <strong>{item.size}</strong> • Frame: <strong>{item.frame.replace("unframed", "Print Only").replace("wood", "Oak Frame").replace("black", "Black Frame").replace("gold", "Gold Frame")}</strong>
                        </p>
                      </div>

                      {/* Controls */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "var(--accent-beige)",
                            borderRadius: "15px",
                            padding: "2px 6px"
                          }}
                        >
                          <button
                            onClick={() => updateCartQty(item.cartId, item.quantity - 1)}
                            style={{ cursor: "pointer", padding: "4px" }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: "0.85rem", fontWeight: "600", width: "24px", textAlign: "center" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.cartId, item.quantity + 1)}
                            style={{ cursor: "pointer", padding: "4px" }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{ fontSize: "0.95rem", fontWeight: "600" }}>
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            style={{ cursor: "pointer", color: "var(--text-muted)", padding: "4px" }}
                            className="trash-btn"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary (Sticky at bottom) */}
            {cart.length > 0 && (
              <div
                style={{
                  padding: "2rem",
                  borderTop: "1px solid var(--border-color)",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem"
                }}
              >
                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ position: "relative", flexGrow: 1 }}>
                    <Tag size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      placeholder="ENTER COUPON (e.g. MOHANLAL)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.6rem 0.6rem 2.2rem",
                        fontSize: "0.75rem",
                        border: "1px solid var(--border-color)",
                        borderRadius: "15px",
                        backgroundColor: "var(--bg-warm)"
                      }}
                      disabled={couponApplied}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-secondary"
                    style={{
                      padding: "0.6rem 1.2rem",
                      fontSize: "0.75rem",
                      borderRadius: "15px",
                      cursor: "pointer"
                    }}
                    disabled={couponApplied}
                  >
                    Apply
                  </button>
                </form>

                {couponApplied && (
                  <p style={{ fontSize: "0.75rem", color: "var(--accent-charcoal)", fontWeight: "600", marginTop: "-8px" }}>
                    ✓ 20% discount applied successfully!
                  </p>
                )}
                {couponError && (
                  <p style={{ fontSize: "0.75rem", color: "red", fontWeight: "500", marginTop: "-8px" }}>
                    {couponError}
                  </p>
                )}

                {/* Shipping Free Notice */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)", backgroundColor: "var(--accent-beige)", padding: "0.6rem 1rem", borderRadius: "10px" }}>
                  <Truck size={14} />
                  {cartSubtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span>Your order ships <strong>FREE</strong> across India!</span>
                  ) : (
                    <span>Add <strong>₹{(FREE_SHIPPING_THRESHOLD - cartSubtotal).toLocaleString("en-IN")}</strong> more for free shipping.</span>
                  )}
                </div>

                {/* Subtotals & Taxes */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                    <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-charcoal)" }}>
                      <span>Discount (20%)</span>
                      <span>- ₹{(cartSubtotal * 0.2).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Shipping</span>
                    <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
                  </div>
                  <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(17, 17, 17, 0.04)", margin: "0.25rem 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: "700" }}>
                    <span>Total Cost</span>
                    <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Checkout Trigger Button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="btn-magnetic btn-primary"
                  style={{
                    width: "100%",
                    padding: "1.1rem",
                    fontSize: "0.95rem",
                    borderRadius: "20px",
                    fontWeight: "600",
                    marginTop: "0.5rem"
                  }}
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
      <style>{`
        .close-drawer-btn:hover {
          background-color: var(--accent-muted) !important;
          transform: rotate(90deg);
        }
        .trash-btn:hover {
          color: red !important;
        }
      `}</style>
    </AnimatePresence>
  );
};
export default CartDrawer;
