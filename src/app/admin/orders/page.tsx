'use client';

import React, { useState } from "react";
import { Truck, Check, RefreshCcw, Package } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([
    { id: "POLA-789324", date: "July 18, 2026", customer: "Arjun Menon", items: "Manichitrathazhu x1 (A4, Wood Frame)", total: 1999, status: "Processing" },
    { id: "POLA-789325", date: "July 17, 2026", customer: "Meera R.", items: "Thoovanathumbikal x1 (A4, Unframed)", total: 1499, status: "Shipped" },
    { id: "POLA-789326", date: "July 16, 2026", customer: "Rahul Sen", items: "Aavesham x1, Kireedam x1 (A3)", total: 3498, status: "Delivered" }
  ]);

  const [returns, setReturns] = useState([
    { id: "RET-103", date: "July 15, 2026", customer: "Kiran Jacob", item: "Spadikam x1 (A4, Glass cracked)", status: "Pending review" }
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const handleApproveReturn = (id) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved & Refunded" } : r))
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>Orders & Shipping</h1>
        <p style={{ color: "var(--color-muted-txt)", fontSize: "0.9rem" }}>
          Track customer orders, manage shipments, and process return requests.
        </p>
      </div>

      {/* ORDERS LIST */}
      <section className="glass-card" style={{ padding: "2rem", backgroundColor: "#FFFFFF" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Package size={18} /> Active Orders
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {orders.map((o) => (
            <div 
              key={o.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid var(--color-border-grey)"
              }}
              className="admin-order-item"
            >
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-muted-txt)", fontWeight: "600" }}>{o.date}</span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "700", margin: "2px 0" }}>#{o.id} — {o.customer}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-muted-txt)" }}>{o.items}</p>
                <span style={{ fontSize: "0.9rem", fontWeight: "600", marginTop: "4px", display: "inline-block" }}>
                  Total: ₹{o.total.toLocaleString("en-IN")}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                {/* Status indicator */}
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "12px",
                  backgroundColor: o.status === "Delivered" ? "#E8F5E9" : o.status === "Shipped" ? "#E3F2FD" : "#FFF3E0",
                  color: o.status === "Delivered" ? "#2E7D32" : o.status === "Shipped" ? "#1565C0" : "#E65100"
                }}>
                  {o.status}
                </span>

                {/* Shipping Controls */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleUpdateStatus(o.id, "Shipped")}
                    style={{
                      cursor: "pointer",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border-grey)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                    className="shipping-ctrl-btn"
                  >
                    <Truck size={12} /> Ship
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(o.id, "Delivered")}
                    style={{
                      cursor: "pointer",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border-grey)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                    className="shipping-ctrl-btn"
                  >
                    <Check size={12} /> Deliver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RETURNS PORTAL (Point 4) */}
      <section className="glass-card" style={{ padding: "2rem", backgroundColor: "#FFFFFF" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <RefreshCcw size={18} /> Return Requests
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {returns.map((r) => (
            <div 
              key={r.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "1rem",
                borderBottom: "1px solid var(--color-border-grey)"
              }}
            >
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-muted-txt)", fontWeight: "600" }}>{r.date}</span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "700", margin: "2px 0" }}>{r.customer} — Request {r.id}</h4>
                <p style={{ fontSize: "0.85rem", color: "red", fontWeight: "500" }}>Reason: {r.item}</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "600", color: r.status.includes("Approved") ? "green" : "orange" }}>
                  {r.status}
                </span>
                {r.status === "Pending review" && (
                  <button
                    onClick={() => handleApproveReturn(r.id)}
                    className="btn-magnetic btn-primary"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.75rem", borderRadius: "10px" }}
                  >
                    Approve Return
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .shipping-ctrl-btn:hover {
          background-color: var(--color-beige-accent) !important;
          border-color: var(--color-dark-txt) !important;
        }
        @media (max-width: 600px) {
          .admin-order-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .admin-order-item div:last-child {
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}
