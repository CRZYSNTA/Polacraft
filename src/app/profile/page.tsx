'use client';

import React, { useContext, useState } from "react";
import { AuthContext } from "../../features/auth/AuthContext";
import { LogIn, LogOut, MapPin, Package, User, Plus } from "lucide-react";

export default function UserProfile() {
  const {
    user,
    savedAddresses,
    orderHistory,
    login,
    loginWithGoogle,
    logout,
    addAddress
  } = useContext(AuthContext);

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({ street: "", city: "", zip: "" });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    login(emailInput, passwordInput || "password");
  };

  const handleNewAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.zip) return;
    addAddress({
      name: user.name,
      street: newAddr.street,
      city: newAddr.city,
      zip: newAddr.zip
    });
    setNewAddr({ street: "", city: "", zip: "" });
    setIsNewAddressOpen(false);
  };

  // 1. SIGN IN STATE REDIRECT OVERLAY
  if (!user) {
    return (
      <div style={{ paddingTop: "160px", paddingBottom: "100px", minHeight: "85vh", display: "flex", alignItems: "center" }}>
        <div className="container" style={{ maxWidth: "480px" }}>
          <form 
            onSubmit={handleLoginSubmit}
            className="glass-card"
            style={{ padding: "3.5rem 2.5rem", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-muted-txt)", fontWeight: "600" }}>
                Polacraft Society
              </span>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>Sign In</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--color-muted-txt)" }}>Email Address</label>
              <input
                type="email"
                required
                placeholder="collector@polacraft.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--color-border-grey)", borderRadius: "12px", fontSize: "0.9rem" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--color-muted-txt)" }}>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--color-border-grey)", borderRadius: "12px", fontSize: "0.9rem" }}
              />
            </div>

            <button type="submit" className="btn-magnetic btn-primary" style={{ padding: "1rem", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <LogIn size={16} /> Sign In to Profile
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.5rem 0" }}>
              <div style={{ flexGrow: 1, height: "1px", backgroundColor: "var(--color-border-grey)" }} />
              <span style={{ fontSize: "0.8rem", color: "var(--color-muted-txt)" }}>OR</span>
              <div style={{ flexGrow: 1, height: "1px", backgroundColor: "var(--color-border-grey)" }} />
            </div>

            <button 
              type="button" 
              onClick={loginWithGoogle}
              className="btn-magnetic btn-secondary" 
              style={{ padding: "1rem", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              🚀 Continue with Google
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. SIGNED IN PROFILE VIEWS
  return (
    <div style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      <div className="container">
        
        {/* User Card */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border-grey)", paddingBottom: "2.5rem", marginBottom: "4rem" }} className="profile-top">
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "var(--color-beige-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-charcoal-accent)", fontSize: "1.5rem", fontWeight: "bold" }}>
              {user.name.substring(0, 1)}
            </div>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>Welcome, {user.name}</h1>
              <p style={{ color: "var(--color-muted-txt)", fontSize: "0.9rem" }}>{user.email} • Polacraft Collector</p>
            </div>
          </div>

          <button 
            onClick={logout}
            className="btn-secondary"
            style={{ padding: "0.75rem 1.5rem", borderRadius: "15px", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Dashboard splitting layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "4rem" }} className="profile-split">
          
          {/* LEFT: ORDER HISTORY */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Package size={20} /> Order History
            </h3>

            {orderHistory.length === 0 ? (
              <div style={{ padding: "3rem", border: "1.5px dashed var(--color-border-grey)", borderRadius: "20px", textAlign: "center" }}>
                <p style={{ color: "var(--color-muted-txt)" }}>No orders placed yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {orderHistory.map((order) => (
                  <div key={order.orderId} className="glass-card" style={{ padding: "1.5rem 1.8rem", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-muted-txt)", fontWeight: "600" }}>{order.date}</span>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        fontWeight: "700",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "8px",
                        backgroundColor: order.status === "Delivered" ? "#E8F5E9" : "#FFF3E0",
                        color: order.status === "Delivered" ? "green" : "orange"
                      }}>{order.status}</span>
                    </div>
                    <div>
                      <strong style={{ fontSize: "1.1rem" }}>Reference: #{order.orderId}</strong>
                      <p style={{ fontSize: "0.85rem", color: "var(--color-muted-txt)", marginTop: "4px" }}>{order.items}</p>
                    </div>
                    <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(17,17,17,0.04)" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                      <span style={{ color: "var(--color-muted-txt)" }}>Total Charged</span>
                      <strong>₹{order.total.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: SHIPPING ADDRESSES */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={20} /> Shipping Addresses
              </h3>
              {!isNewAddressOpen && (
                <button
                  onClick={() => setIsNewAddressOpen(true)}
                  style={{ fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}
                  className="underline-hover"
                >
                  <Plus size={14} /> Add Address
                </button>
              )}
            </div>

            {isNewAddressOpen && (
              <form 
                onSubmit={handleNewAddressSubmit}
                className="glass-card"
                style={{ padding: "1.5rem 1.8rem", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--color-muted-txt)" }}>Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="42 Panampilly Nagar"
                    value={newAddr.street}
                    onChange={(e) => setNewAddr(prev => ({ ...prev, street: e.target.value }))}
                    style={{ padding: "0.6rem 0.8rem", border: "1.5px solid var(--color-border-grey)", borderRadius: "10px", fontSize: "0.85rem" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--color-muted-txt)" }}>City</label>
                    <input
                      type="text"
                      required
                      placeholder="Kochi"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr(prev => ({ ...prev, city: e.target.value }))}
                      style={{ padding: "0.6rem 0.8rem", border: "1.5px solid var(--color-border-grey)", borderRadius: "10px", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--color-muted-txt)" }}>PIN Code</label>
                    <input
                      type="text"
                      required
                      placeholder="682036"
                      value={newAddr.zip}
                      onChange={(e) => setNewAddr(prev => ({ ...prev, zip: e.target.value }))}
                      style={{ padding: "0.6rem 0.8rem", border: "1.5px solid var(--color-border-grey)", borderRadius: "10px", fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button type="submit" className="btn-magnetic btn-primary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.8rem", borderRadius: "10px" }}>
                    Save Address
                  </button>
                  <button type="button" onClick={() => setIsNewAddressOpen(false)} className="btn-secondary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.8rem", borderRadius: "10px" }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {savedAddresses.map((addr) => (
                <div key={addr.id} className="glass-card" style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
                  <strong>{addr.name}</strong>
                  <p style={{ color: "var(--color-muted-txt)" }}>
                    {addr.street}, {addr.city} - {addr.zip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .profile-top {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.5rem !important;
          }
          .profile-split {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </div>
  );
}
