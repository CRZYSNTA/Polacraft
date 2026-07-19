'use client';

import React, { useContext, useState } from "react";
import { AppContext } from "../../features/cart/AppContext";
import { CheckCircle, ArrowLeft, CreditCard, Landmark, Shield } from "lucide-react";
import confetti from "canvas-confetti";
import { createPaymentSession } from "../../services/payment";
import { useRouter } from "next/navigation";
import { trackPurchase } from "../../services/analytics";

export default function Checkout() {
  const { cart, cartSubtotal, clearCart } = useContext(AppContext);
  const router = useRouter();

  const [step, setStep] = useState("form"); // "form", "processing", "success"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "upi",
    upiId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: ""
  });

  const [orderId] = useState(() => `POLA-${Math.floor(100000 + Math.random() * 900000)}`);
  
  // Calculate discount based on coupons applied in cart storage
  const discount = 0; // standard checkout discount
  const shippingCost = cartSubtotal > 3000 || cartSubtotal === 0 ? 0 : 150;
  const finalTotal = Math.max(0, cartSubtotal * (1 - discount)) + shippingCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setStep("processing");

    try {
      // Connect to Stripe/Razorpay endpoint wrapper (Point 4)
      await createPaymentSession({
        totalAmount: finalTotal,
        paymentMethod: formData.paymentMethod,
        email: formData.email
      });

      // Track purchase event in analytics (Point 6)
      try {
        trackPurchase({
          orderId,
          totalAmount: finalTotal,
          items: cart
        });
      } catch (err) {
        console.error("Purchase tracking error", err);
      }

      setStep("success");
      clearCart();
      
      triggerConfetti();
      setTimeout(triggerConfetti, 400);
    } catch (err) {
      console.error(err);
      setStep("form");
      alert("Payment authentication failed. Please try again.");
    }
  };

  if (step === "success") {
    return (
      <div style={{ paddingTop: "160px", paddingBottom: "100px", minHeight: "85vh", display: "flex", alignItems: "center" }}>
        <div className="container" style={{ maxWidth: "600px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ color: "var(--accent-charcoal)" }}>
            <CheckCircle size={64} strokeWidth={1.5} />
          </div>
          <h1 style={{ fontSize: "2.75rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
            Order Placed Successfully!
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "45ch", lineHeight: "1.6" }}>
            Thank you for supporting handcrafted Malayalam cinema posters. Your order has been placed in our print queue and will begin production shortly.
          </p>

          {/* Receipt details */}
          <div className="glass-card" style={{ width: "100%", padding: "2rem", backgroundColor: "var(--accent-beige)", textAlign: "left", display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Order Reference</span>
              <strong>#{orderId}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Shipping Name</span>
              <strong>{formData.name}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Delivery Destination</span>
              <strong>{formData.address}, {formData.city} - {formData.zip}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Contact Email</span>
              <strong>{formData.email}</strong>
            </div>
            <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(17,17,17,0.06)", margin: "0.25rem 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem", fontWeight: "700" }}>
              <span>Total Charged</span>
              <span>₹{finalTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button onClick={() => router.push("/")} className="btn-magnetic btn-primary" style={{ marginTop: "1rem", padding: "1rem 2.5rem" }}>
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div style={{ paddingTop: "140px", paddingBottom: "100px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
          <div className="spinner" />
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Processing Order Securely</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "30ch" }}>
            Verifying your delivery coordinate points and connecting to secure Stripe/Razorpay payment nodes. Do not refresh.
          </p>
          <style>{`
            .spinner {
              width: 50px;
              height: 50px;
              border: 4px solid var(--accent-beige);
              border-top: 4px solid var(--accent-charcoal);
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      <div className="container">
        
        <button 
          onClick={() => router.push("/shop")}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)", cursor: "pointer", marginBottom: "2.5rem" }}
          className="underline-hover"
        >
          <ArrowLeft size={16} /> Return to Store
        </button>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <h2>Your Bag is empty</h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Add some artworks before checking out.
            </p>
            <button onClick={() => router.push("/shop")} className="btn-magnetic btn-primary" style={{ marginTop: "1.5rem" }}>
              Browse Collection
            </button>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmitOrder}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "4rem",
              alignItems: "start"
            }}
            className="checkout-grid"
          >
            {/* LEFT COLUMN: CONTACT & SHIPPING */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              <div>
                <h2 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.02em" }}>Shipping Details</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Provide delivery address within India.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="checkout-inputs-row">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="Gowtham Krishnan" 
                      style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="gowtham@domain.com" 
                      style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>Street Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    required 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    placeholder="Studio 42, 2nd Floor, Panampilly Nagar" 
                    style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="checkout-inputs-row">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>City / Town</label>
                    <input 
                      type="text" 
                      name="city" 
                      required 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      placeholder="Kochi, Kerala" 
                      style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>Postal PIN Code</label>
                    <input 
                      type="text" 
                      name="zip" 
                      required 
                      value={formData.zip} 
                      onChange={handleInputChange} 
                      placeholder="682036" 
                      style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT SEGMENT */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "2.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Secure Payment</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>All transactions are encrypted and mock-validated.</p>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "upi" }))}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      borderRadius: "15px",
                      border: formData.paymentMethod === "upi" ? "1.5px solid var(--text-dark)" : "1.5px solid var(--border-color)",
                      backgroundColor: formData.paymentMethod === "upi" ? "var(--accent-beige)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    <Landmark size={18} /> UPI (Instant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "card" }))}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      borderRadius: "15px",
                      border: formData.paymentMethod === "card" ? "1.5px solid var(--text-dark)" : "1.5px solid var(--border-color)",
                      backgroundColor: formData.paymentMethod === "card" ? "var(--accent-beige)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    <CreditCard size={18} /> Debit/Credit Card
                  </button>
                </div>

                {formData.paymentMethod === "upi" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>UPI ID (VPA)</label>
                    <input 
                      type="text" 
                      name="upiId" 
                      required 
                      value={formData.upiId} 
                      onChange={handleInputChange} 
                      placeholder="gowtham@okaxis" 
                      style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
                    />
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>Card Number</label>
                      <input 
                        type="text" 
                        name="cardNumber" 
                        required 
                        value={formData.cardNumber} 
                        onChange={handleInputChange} 
                        placeholder="4321 •••• •••• 8765" 
                        style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>Expiry MM/YY</label>
                        <input 
                          type="text" 
                          name="cardExpiry" 
                          required 
                          value={formData.cardExpiry} 
                          onChange={handleInputChange} 
                          placeholder="12/28" 
                          style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>CVV Code</label>
                        <input 
                          type="text" 
                          name="cardCvv" 
                          required 
                          value={formData.cardCvv} 
                          onChange={handleInputChange} 
                          placeholder="883" 
                          style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: SUMMARY */}
            <div 
              className="glass-card"
              style={{
                position: "sticky",
                top: "120px",
                padding: "2.5rem",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem"
              }}
            >
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
                Order Summary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {cart.map((item) => (
                  <div key={item.cartId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem" }}>
                    <div>
                      <span style={{ fontWeight: "600" }}>{item.title}</span>{" "}
                      <span style={{ color: "var(--text-muted)" }}>
                        x{item.quantity} ({item.size})
                      </span>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                        {item.frame === "unframed" ? "Print Only" : "Framed"}
                      </p>
                    </div>
                    <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                  </div>
                ))}
              </div>

              <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(17,17,17,0.06)", margin: "0.5rem 0" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Item Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Estimated Delivery</span>
                  <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
                </div>
                <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(17,17,17,0.04)", margin: "0.25rem 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: "700" }}>
                  <span>Total Due</span>
                  <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="submit"
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
                Submit Secure Payment
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                <Shield size={14} /> 256-Bit SSL Encrypted Protected
              </div>
            </div>
          </form>
        )}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .checkout-grid > div:last-child {
            position: static !important;
          }
        }
        @media (max-width: 600px) {
          .checkout-inputs-row {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
