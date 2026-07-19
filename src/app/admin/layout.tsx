'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, PackageOpen, Ticket, ShieldCheck, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { path: "/admin", label: "Analytics Overview", icon: <LayoutDashboard size={18} /> },
    { path: "/admin/orders", label: "Orders & Shipping", icon: <ShoppingCart size={18} /> },
    { path: "/admin/products", label: "Inventory Products", icon: <PackageOpen size={18} /> },
    { path: "/admin/coupons", label: "Voucher Coupons", icon: <Ticket size={18} /> },
    { path: "/admin/design-system", label: "Design System", icon: <PackageOpen size={18} /> }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      {/* Sidebar Panel */}
      <aside
        style={{
          width: "280px",
          backgroundColor: "var(--color-charcoal-accent)",
          color: "#FAFAF8",
          padding: "3rem 1.5rem 1.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "3rem",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0
        }}
      >
        {/* Header */}
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", letterSpacing: "-0.02em", color: "#FFFFFF" }}>
            POLACRAFT ADMIN
          </h2>
          <span style={{ fontSize: "0.7rem", color: "rgba(250,250,248,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Management console v1.0
          </span>
        </div>

        {/* Navigation list */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.8rem 1rem",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
                  color: isActive ? "#FFFFFF" : "rgba(250,250,248,0.65)",
                  transition: "var(--transition-fast)"
                }}
                className="admin-sidebar-link"
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "rgba(250,250,248,0.4)" }}>
            <ShieldCheck size={14} /> Authorized Access Only
          </div>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              color: "#FAFAF8",
              textDecoration: "underline"
            }}
          >
            <ArrowLeft size={14} /> Exit to Storefront
          </Link>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main style={{ flexGrow: 1, padding: "4rem 3.5rem", overflowY: "auto" }}>
        {children}
      </main>

      <style>{`
        .admin-sidebar-link:hover {
          color: #FFFFFF !important;
          background-color: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
