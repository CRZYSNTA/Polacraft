"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  ShoppingBag,
  Users,
  Star,
  BookOpen,
  BarChart3,
  Settings,
  ShieldCheck,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

export const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/collections", label: "Collections", icon: FolderKanban },
  { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { path: "/admin/customers", label: "Customers", icon: Users },
  { path: "/admin/reviews", label: "Reviews", icon: Star },
  { path: "/admin/blog", label: "Blog", icon: BookOpen },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "2rem",
      }}
    >
      {/* Brand Logo Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "900",
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            POLACRAFT
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <span
              style={{
                fontSize: "0.65rem",
                color: "#10B981",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: "800",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              ADMIN PORTAL
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="admin-mobile-close"
          style={{
            background: "none",
            border: "none",
            color: "#FFF",
            cursor: "pointer",
            display: "none",
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flexGrow: 1, overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                fontSize: "0.9rem",
                fontWeight: isActive ? "700" : "500",
                backgroundColor: isActive ? "rgba(255, 255, 255, 0.12)" : "transparent",
                color: isActive ? "#FFFFFF" : "rgba(250, 250, 248, 0.65)",
                transition: "all 0.15s ease",
                borderLeft: isActive ? "3px solid #10B981" : "3px solid transparent",
              }}
              className="admin-nav-link"
            >
              <Icon size={18} style={{ color: isActive ? "#10B981" : "inherit" }} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer & Actions */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
        }}
      >
        <LogoutButton variant="full" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "rgba(250,250,248,0.45)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "rgba(250,250,248,0.6)",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} /> Exit Storefront
          </Link>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <ShieldCheck size={12} /> Secure
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div
        className="admin-mobile-toggle"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "#1E1E1E",
          color: "#FFFFFF",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.25rem",
          zIndex: 50,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: "1rem" }}>POLACRAFT ADMIN</span>
        <button
          onClick={() => setMobileOpen(true)}
          style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer" }}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Permanent Sidebar */}
      <aside
        className="admin-desktop-sidebar"
        style={{
          width: "280px",
          backgroundColor: "#1E1E1E",
          color: "#FAFAF8",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          minHeight: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            display: "flex",
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{
              width: "280px",
              backgroundColor: "#1E1E1E",
              height: "100%",
              padding: "2rem 1.5rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      <style>{`
        .admin-nav-link:hover {
          color: #FFFFFF !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
        @media (max-width: 1024px) {
          .admin-desktop-sidebar {
            display: none !important;
          }
          .admin-mobile-toggle {
            display: flex !important;
          }
          .admin-mobile-close {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
