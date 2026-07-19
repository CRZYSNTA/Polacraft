'use client';

import React, { useState } from "react";
import { Ticket, Plus, Trash2 } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([
    { code: "MAMMOOTTY", discount: 20, description: "20% off celebrating Mammootty classics" },
    { code: "MOHANLAL", discount: 20, description: "20% off celebrating Mohanlal classics" },
    { code: "POLACRAFT20", discount: 20, description: "20% off launch discount campaign" }
  ]);

  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState(20);
  const [newDesc, setNewDesc] = useState("");

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCode) return;
    const item = {
      code: newCode.trim().toUpperCase(),
      discount: Number(newDiscount),
      description: newDesc || `${newDiscount}% voucher discount`
    };
    setCoupons((prev) => [...prev, item]);
    setNewCode("");
    setNewDesc("");
  };

  const handleDeleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>Voucher Coupons</h1>
        <p style={{ color: "var(--color-muted-txt)", fontSize: "0.9rem" }}>
          Create and manage promotional discount campaigns.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "3.5rem" }} className="coupons-split">
        {/* CREATE FORM */}
        <form 
          onSubmit={handleCreateCoupon}
          className="glass-card"
          style={{ padding: "2.5rem 2rem", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "1.25rem", height: "fit-content" }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Plus size={18} /> New Coupon
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--color-muted-txt)" }}>Coupon Code</label>
            <input
              type="text"
              required
              placeholder="E.g. KERALA10"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              style={{ padding: "0.75rem 1rem", border: "1.5px solid var(--color-border-grey)", borderRadius: "12px", fontSize: "0.85rem" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--color-muted-txt)" }}>Discount Percentage</label>
            <input
              type="number"
              min="5"
              max="90"
              required
              value={newDiscount}
              onChange={(e) => setNewDiscount(Number(e.target.value))}
              style={{ padding: "0.75rem 1rem", border: "1.5px solid var(--color-border-grey)", borderRadius: "12px", fontSize: "0.85rem" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--color-muted-txt)" }}>Campaign Description</label>
            <input
              type="text"
              placeholder="E.g. Festive discount voucher"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              style={{ padding: "0.75rem 1rem", border: "1.5px solid var(--color-border-grey)", borderRadius: "12px", fontSize: "0.85rem" }}
            />
          </div>

          <button type="submit" className="btn-magnetic btn-primary" style={{ padding: "0.85rem", fontSize: "0.85rem", borderRadius: "12px", marginTop: "0.5rem" }}>
            Generate Coupon
          </button>
        </form>

        {/* LIST */}
        <div className="glass-card" style={{ padding: "2.5rem 2rem", backgroundColor: "#FFFFFF" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Ticket size={18} /> Active Vouchers
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {coupons.map((c) => (
              <div 
                key={c.code}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--color-border-grey)"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <strong style={{ fontSize: "1.05rem" }}>{c.code}</strong>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "green", backgroundColor: "#E8F5E9", padding: "0.1rem 0.5rem", borderRadius: "6px" }}>
                      {c.discount}% OFF
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-muted-txt)", marginTop: "2px" }}>{c.description}</p>
                </div>

                <button
                  onClick={() => handleDeleteCoupon(c.code)}
                  style={{ cursor: "pointer", color: "var(--color-muted-txt)", padding: "8px" }}
                  className="delete-coupon-btn"
                  aria-label={`Delete coupon ${c.code}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .delete-coupon-btn:hover {
          color: red !important;
        }
        @media (max-width: 900px) {
          .coupons-split {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
