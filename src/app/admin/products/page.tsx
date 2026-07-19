'use client';

import React, { useState } from "react";
import { posters as initialPosters } from "../../../lib/cms/products";
import { Plus, Minus, Tag, ShieldCheck } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState(initialPosters);

  const handleAdjustStock = (id, amount) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQty = Math.max(0, p.inventory + amount);
          return {
            ...p,
            inventory: newQty,
            isSoldOut: newQty === 0 && !p.isPreorder
          };
        }
        return p;
      })
    );
  };

  const handleTogglePreorder = (id) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newPreorder = !p.isPreorder;
          return {
            ...p,
            isPreorder: newPreorder,
            isSoldOut: p.inventory === 0 && !newPreorder
          };
        }
        return p;
      })
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>Inventory Products</h1>
        <p style={{ color: "var(--color-muted-txt)", fontSize: "0.9rem" }}>
          Live stock adjustments, limited edition numbers, and preorder operational overrides.
        </p>
      </div>

      {/* PRODUCTS TABLE */}
      <section className="glass-card" style={{ padding: "2rem", backgroundColor: "#FFFFFF", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid var(--color-border-grey)", color: "var(--color-muted-txt)", fontWeight: "600" }}>
              <th style={{ padding: "1rem" }}>Poster Art</th>
              <th style={{ padding: "1rem" }}>Price</th>
              <th style={{ padding: "1rem" }}>Inventory</th>
              <th style={{ padding: "1rem" }}>Operations</th>
              <th style={{ padding: "1rem" }}>Preorder Mode</th>
              <th style={{ padding: "1rem" }}>Edition Limit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isLowStock = p.inventory > 0 && p.inventory <= p.lowStockThreshold;
              const isOut = p.inventory === 0;
              
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border-grey)" }}>
                  {/* Poster details */}
                  <td style={{ padding: "1.25rem 1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div 
                      style={{
                        width: "36px",
                        height: "50px",
                        backgroundColor: p.palette.bg,
                        color: p.palette.text,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.45rem",
                        fontWeight: "800",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                      }}
                    >
                      {p.title.substring(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <strong style={{ display: "block" }}>{p.title}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-muted-txt)" }}>{p.collection}</span>
                    </div>
                  </td>

                  <td style={{ padding: "1.25rem 1rem" }}>
                    <strong>₹{p.price}</strong>
                  </td>

                  {/* Stock count */}
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <strong>{p.inventory} units</strong>
                      {isLowStock && (
                        <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#E65100", backgroundColor: "#FFF3E0", padding: "0.15rem 0.5rem", borderRadius: "8px" }}>
                          LOW
                        </span>
                      )}
                      {isOut && !p.isPreorder && (
                        <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "red", backgroundColor: "#FFEBF0", padding: "0.15rem 0.5rem", borderRadius: "8px" }}>
                          OUT
                        </span>
                      )}
                      {isOut && p.isPreorder && (
                        <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#1565C0", backgroundColor: "#E3F2FD", padding: "0.15rem 0.5rem", borderRadius: "8px" }}>
                          PRE
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Operational adjust button */}
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button
                        onClick={() => handleAdjustStock(p.id, -1)}
                        style={{ cursor: "pointer", padding: "4px", border: "1px solid var(--color-border-grey)", borderRadius: "6px" }}
                        aria-label="Reduce stock"
                      >
                        <Minus size={12} />
                      </button>
                      <button
                        onClick={() => handleAdjustStock(p.id, 1)}
                        style={{ cursor: "pointer", padding: "4px", border: "1px solid var(--color-border-grey)", borderRadius: "6px" }}
                        aria-label="Increase stock"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </td>

                  {/* Preorder toggler */}
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <button
                      onClick={() => handleTogglePreorder(p.id)}
                      style={{
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "10px",
                        backgroundColor: p.isPreorder ? "var(--color-charcoal-accent)" : "var(--color-beige-accent)",
                        color: p.isPreorder ? "#FFFFFF" : "var(--color-dark-txt)",
                        border: "1.5px solid var(--color-border-grey)"
                      }}
                    >
                      {p.isPreorder ? "Active" : "Disabled"}
                    </button>
                  </td>

                  {/* Limited Edition */}
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <span style={{ color: "var(--color-muted-txt)", fontSize: "0.85rem" }}>
                      Limit: <strong>{p.limitedEditionCount}</strong> prints
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
