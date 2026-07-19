'use client';

import React, { useMemo } from "react";
import { posters } from "../../lib/cms/products";
import { TrendingUp, AlertTriangle, Users, Landmark, FileSpreadsheet } from "lucide-react";

export default function AdminDashboard() {
  // Aggregate mock inventory parameters
  const metrics = useMemo(() => {
    const totalProducts = posters.length;
    const lowStockItems = posters.filter((p) => p.inventory > 0 && p.inventory <= p.lowStockThreshold);
    const outOfStockItems = posters.filter((p) => p.inventory === 0 && !p.isPreorder);
    const preorderItems = posters.filter((p) => p.isPreorder);
    
    return {
      totalProducts,
      lowStockItems,
      outOfStockItems,
      preorderItems
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>Analytics Overview</h1>
        <p style={{ color: "var(--color-muted-txt)", fontSize: "0.9rem" }}>
          Live metrics tracking customer conversions, payment captures, and inventory health.
        </p>
      </div>

      {/* STATS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="admin-stats-grid">
        {[
          { label: "Total Revenue", val: "₹1,42,890", trend: "+12.4% this week", icon: <Landmark size={20} />, color: "#EFECE6" },
          { label: "Conversion Rate", val: "3.42%", trend: "+0.8% increase", icon: <TrendingUp size={20} />, color: "#EFECE6" },
          { label: "Active Sessions", val: "482 visitors", trend: "Live counting", icon: <Users size={20} />, color: "#EFECE6" },
          { label: "Pending Shipments", val: "14 orders", trend: "Fulfillment queue", icon: <FileSpreadsheet size={20} />, color: "#EFECE6" }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: "1.5rem 1.8rem",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--color-muted-txt)", fontWeight: "600" }}>{stat.label}</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: stat.color, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-charcoal-accent)" }}>
                {stat.icon}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: "1.75rem", fontWeight: "700" }}>{stat.val}</h3>
              <span style={{ fontSize: "0.75rem", color: stat.trend.includes("+") ? "green" : "var(--color-muted-txt)", fontWeight: "600" }}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* LOW STOCK & OPERATION ALERTS (Point 4) */}
      {(metrics.lowStockItems.length > 0 || metrics.outOfStockItems.length > 0) && (
        <section 
          style={{
            backgroundColor: "#FFF9E6",
            border: "1px solid #FFE0B2",
            borderRadius: "16px",
            padding: "2rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#D84315", marginBottom: "1rem" }}>
            <AlertTriangle size={22} />
            <h3 style={{ fontSize: "1.15rem", fontWeight: "700" }}>Inventory Operations Alert</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {metrics.lowStockItems.map((item) => (
              <div 
                key={item.id}
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  fontSize: "0.9rem", 
                  color: "#5D4037",
                  borderBottom: "1px solid rgba(216,67,21,0.1)",
                  paddingBottom: "0.5rem"
                }}
              >
                <span>⚠️ Low Stock: <strong>{item.title}</strong> has only <strong>{item.inventory}</strong> prints left.</span>
                <span>(Threshold: {item.lowStockThreshold})</span>
              </div>
            ))}

            {metrics.outOfStockItems.map((item) => (
              <div 
                key={item.id}
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  fontSize: "0.9rem", 
                  color: "#D84315",
                  borderBottom: "1px solid rgba(216,67,21,0.1)",
                  paddingBottom: "0.5rem"
                }}
              >
                <span>🛑 Out of Stock: <strong>{item.title}</strong> is sold out.</span>
                <span>(Preorders Disabled)</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RECENT SALES & POPULAR ITEMS SPLIT */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem" }} className="admin-panels-split">
        {/* Recent Orders */}
        <div className="glass-card" style={{ padding: "2rem", backgroundColor: "#FFFFFF" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1.5rem" }}>Recent Order Log</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.85rem" }}>
            {[
              { id: "POLA-789324", customer: "Arjun M.", total: "₹1,999", items: "Manichitrathazhu x1 (A4, Wood)", status: "Delivered" },
              { id: "POLA-789325", customer: "Meera R.", total: "₹1,499", items: "Thoovanathumbikal x1 (A4)", status: "Shipped" },
              { id: "POLA-789326", customer: "Rahul S.", total: "₹3,498", items: "Aavesham x1, Premam x1", status: "Processing" }
            ].map((order) => (
              <div key={order.id} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.75rem", borderBottom: "1px solid var(--color-border-grey)" }}>
                <div>
                  <strong>#{order.id}</strong> • {order.customer}<br />
                  <span style={{ color: "var(--color-muted-txt)", fontSize: "0.75rem" }}>{order.items}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>{order.total}</strong><br />
                  <span style={{ 
                    fontSize: "0.7rem", 
                    fontWeight: "600",
                    color: order.status === "Delivered" ? "green" : order.status === "Shipped" ? "blue" : "orange"
                  }}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular items catalog */}
        <div className="glass-card" style={{ padding: "2rem", backgroundColor: "#FFFFFF" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1.5rem" }}>Sales Curation</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.85rem" }}>
            {posters.slice(0, 3).map((poster) => (
              <div key={poster.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div 
                  style={{
                    width: "40px",
                    height: "56px",
                    backgroundColor: poster.palette.bg,
                    color: poster.palette.text,
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "0.5rem",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                  }}
                >
                  {poster.title.substring(0, 3).toUpperCase()}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <strong>{poster.title}</strong><br />
                  <span style={{ color: "var(--color-muted-txt)" }}>Stock level: {poster.inventory} prints</span>
                </div>
                <strong>₹{poster.price}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .admin-stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .admin-panels-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .admin-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
