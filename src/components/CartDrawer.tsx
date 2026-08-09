'use client';

import React, { useContext, useState } from "react";
import { AppContext } from "../features/cart/AppContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, Tag, Gift } from "lucide-react";
import { calculateShippingFee, evaluatePromotionEngine } from "@/services/promotionEngine";
import { CartProgress } from "./cart/CartProgress";
import { RewardSelectorModal } from "./cart/RewardSelectorModal";

export const CartDrawer = () => {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateCartQty,
    cartSubtotal,
    siteSettings,
    selectedRewards,
    setSelectedRewards
  } = useContext(AppContext);

  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [rewardModalOpen, setRewardModalOpen] = useState(false);

  const promo = evaluatePromotionEngine(cartSubtotal, siteSettings);
  const shippingCost = cartSubtotal === 0 ? 0 : calculateShippingFee(cartSubtotal, siteSettings);
  const finalTotal = Math.max(0, cartSubtotal * (1 - discount / 100)) + shippingCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
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
    <>
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(2px)",
                zIndex: 2000,
                cursor: "pointer"
              }}
            />

            {/* Slide-over Cart Drawer Panel (Exact Posterized.in Design) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "100%",
                maxWidth: "420px",
                height: "100%",
                backgroundColor: "#FFFFFF",
                boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.12)",
                zIndex: 2001,
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* 1. HEADER ROW */}
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderBottom: "1px solid #F3F4F6"
                }}
              >
                <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#111111", margin: 0, letterSpacing: "-0.02em" }}>
                  Cart
                </h2>

                <button
                  onClick={() => setCartOpen(false)}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    padding: "0.35rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#111111",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                  }}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: "900" }}>✕</span> Close
                </button>
              </div>

              {/* 2. YELLOW SHIPPING & DISPATCH ANNOUNCEMENT BANNER */}
              <div
                style={{
                  backgroundColor: "#FEF08A",
                  padding: "0.65rem 1rem",
                  textAlign: "center",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  color: "#111111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  borderBottom: "1px solid #FDE047"
                }}
              >
                <span style={{ color: "#D97706" }}>⚡</span> Order now — dispatched within 24 hours
              </div>

              {/* 3. FREE REWARDS & MILESTONES PROGRESS BAR */}
              <div style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #F3F4F6" }}>
                <CartProgress subtotal={cartSubtotal} settings={siteSettings} />
              </div>

              {/* 4. CART CONTENT / ITEMS AREA */}
              <div
                style={{
                  flexGrow: 1,
                  overflowY: "auto",
                  padding: cart.length === 0 ? "0" : "1.25rem 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem"
                }}
              >
                {cart.length === 0 ? (
                  /* EMPTY CART VIEW (EXACT MATCHING POSTERIZED.IN SCREENSHOT) */
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      padding: "2rem"
                    }}
                  >
                    {/* Minimal Grey Cart Icon */}
                    <div style={{ marginBottom: "1.25rem" }}>
                      <svg 
                        width="72" 
                        height="72" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#D1D5DB" 
                        strokeWidth="1.2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </div>

                    <p style={{ fontSize: "0.95rem", color: "#666666", fontWeight: "500", margin: 0 }}>
                      No items in the cart
                    </p>

                    <button
                      onClick={() => {
                        setCartOpen(false);
                        router.push("/shop");
                      }}
                      style={{
                        marginTop: "1.75rem",
                        padding: "0.75rem 1.75rem",
                        borderRadius: "100px",
                        backgroundColor: "#111111",
                        color: "#FFFFFF",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      Start Shopping ➔
                    </button>
                  </div>
                ) : (
                  /* CART ITEMS LIST */
                  cart.map((item) => (
                    <div
                      key={item.cartId}
                      style={{
                        display: "flex",
                        gap: "1rem",
                        paddingBottom: "1.25rem",
                        borderBottom: "1px solid #F3F4F6",
                        alignItems: "center"
                      }}
                    >
                      {/* Product Image / Art Thumbnail */}
                      <div
                        style={{
                          width: "70px",
                          height: "95px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          position: "relative",
                          backgroundColor: item.bgColor || "#F4F3EF",
                          color: item.textColor || "#111111",
                          flexShrink: 0,
                          border: "1px solid rgba(17,17,17,0.08)",
                          padding: "8px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between"
                        }}
                      >
                        <span style={{ fontSize: "0.45rem", fontWeight: "700", opacity: 0.6 }}>POLACRAFT</span>
                        <span style={{ fontSize: "0.65rem", fontWeight: "800", lineHeight: 1.1, wordBreak: "break-word" }}>{item.title}</span>
                        <span style={{ fontSize: "0.4rem", opacity: 0.7 }}>{item.size}</span>
                      </div>

                      {/* Product Metadata */}
                      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#111111", margin: 0, lineHeight: "1.3" }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: "0.78rem", color: "#666666", margin: 0 }}>
                          Size: <strong>{item.size}</strong> • Frame: <strong>{item.frame.replace("unframed", "Print Only").replace("wood", "Wood Frame").replace("black", "Black Frame").replace("white", "White Frame")}</strong>
                        </p>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                          {/* Quantity Stepper */}
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              border: "1px solid #E5E7EB",
                              borderRadius: "6px",
                              backgroundColor: "#FFFFFF"
                            }}
                          >
                            <button
                              onClick={() => updateCartQty(item.cartId, item.quantity - 1)}
                              style={{ padding: "4px 8px", cursor: "pointer", border: "none", background: "none", color: "#111111" }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ fontSize: "0.8rem", fontWeight: "700", width: "20px", textAlign: "center" }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.cartId, item.quantity + 1)}
                              style={{ padding: "4px 8px", cursor: "pointer", border: "none", background: "none", color: "#111111" }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Item Subtotal Price & Delete */}
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111111" }}>
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.cartId)}
                              style={{ cursor: "pointer", color: "#9CA3AF", padding: "4px", border: "none", background: "none" }}
                              title="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 5. UNLOCKED FREE GIFT SELECTOR CALLOUT */}
              {promo.unlockedRewardCount > 0 && cart.length > 0 && (
                <div style={{ padding: "0 1.5rem 0.75rem 1.5rem" }}>
                  <button
                    onClick={() => setRewardModalOpen(true)}
                    style={{
                      width: "100%",
                      backgroundColor: "#111111",
                      color: "#FFFFFF",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Gift size={16} style={{ color: "#FACC15" }} />
                      <span style={{ fontSize: "0.82rem", fontWeight: "700" }}>
                        Free Reward Unlocked ({selectedRewards.length}/{promo.unlockedRewardCount})
                      </span>
                    </div>
                    <span style={{ fontSize: "0.75rem", textDecoration: "underline" }}>
                      Choose Free Prints →
                    </span>
                  </button>
                </div>
              )}

              {/* 6. STICKY FOOTER CHECKOUT BAR */}
              {cart.length > 0 && (
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    borderTop: "1px solid #F3F4F6",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem"
                  }}
                >
                  {/* Coupon Code Input */}
                  <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "0.5rem" }}>
                    <div style={{ position: "relative", flexGrow: 1 }}>
                      <Tag size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                      <input
                        type="text"
                        placeholder="Coupon Code (e.g. MOHANLAL)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.6rem 0.6rem 0.6rem 2.2rem",
                          fontSize: "0.8rem",
                          border: "1px solid #E5E7EB",
                          borderRadius: "10px",
                          outline: "none",
                          backgroundColor: "#FAFAF8"
                        }}
                        disabled={couponApplied}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        padding: "0.6rem 1.25rem",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                        borderRadius: "10px",
                        backgroundColor: "#2C2C2A",
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer"
                      }}
                      disabled={couponApplied}
                    >
                      {couponApplied ? "Applied ✓" : "Apply"}
                    </button>
                  </form>

                  {/* Summary Totals */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.88rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#666666" }}>
                      <span>Subtotal</span>
                      <span style={{ fontWeight: "600", color: "#111111" }}>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {discount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#16A34A" }}>
                        <span>Coupon Discount (20%)</span>
                        <span>- ₹{(cartSubtotal * 0.2).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#666666" }}>
                      <span>Shipping</span>
                      <span style={{ color: shippingCost === 0 ? "#16A34A" : "#111111", fontWeight: "700" }}>
                        {shippingCost === 0 ? "FREE 🎉" : `₹${shippingCost}`}
                      </span>
                    </div>
                    <div style={{ width: "100%", height: "1px", backgroundColor: "#F3F4F6", margin: "0.25rem 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: "900", color: "#111111" }}>
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Primary Checkout Button */}
                  <button
                    onClick={handleProceedToCheckout}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      fontSize: "0.95rem",
                      fontWeight: "700",
                      borderRadius: "100px",
                      backgroundColor: "#111111",
                      color: "#FFFFFF",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                  >
                    Proceed to Checkout ➔
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reward Selector Modal */}
      <RewardSelectorModal
        isOpen={rewardModalOpen}
        onClose={() => setRewardModalOpen(false)}
        rewardStatus={promo}
        selectedRewards={selectedRewards}
        onSaveRewards={(rewards) => setSelectedRewards(rewards)}
      />
    </>
  );
};

export default CartDrawer;
