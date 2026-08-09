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
  DollarSign,
  Users,
  Star,
  BookOpen,
  BarChart3,
  Settings,
  ShieldCheck,
  ArrowLeft,
  LogOut,
} from "lucide-react";

export const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/collections", label: "Collections", icon: FolderKanban },
  { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { path: "/admin/expenses", label: "Expenses", icon: DollarSign },
  { path: "/admin/customers", label: "Customers", icon: Users },
  { path: "/admin/reviews", label: "Reviews", icon: Star },
  { path: "/admin/blog", label: "Blog", icon: BookOpen },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

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

      {/* ===== MOBILE BOTTOM GRID NAV ===== */}
      <nav className="admin-mobile-bottom-nav">
        {/* First row: 5 items */}
        <div className="admin-mobile-nav-grid">
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
                className={`admin-mobile-nav-item${isActive ? " active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <style>{`
        /* ---- Desktop sidebar nav link hover ---- */
        .admin-nav-link:hover {
          color: #FFFFFF !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
        }

        /* ---- Hide desktop sidebar on mobile ---- */
        @media (max-width: 1024px) {
          .admin-desktop-sidebar {
            display: none !important;
          }
        }

        /* ---- Mobile bottom grid nav: hidden on desktop ---- */
        .admin-mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 1024px) {
          .admin-mobile-bottom-nav {
            display: block;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #1A1A1A;
            border-top: 1px solid rgba(255,255,255,0.08);
            z-index: 100;
            padding: 6px 4px env(safe-area-inset-bottom, 6px);
            box-shadow: 0 -4px 24px rgba(0,0,0,0.25);
          }

          .admin-mobile-nav-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 2px;
          }

          .admin-mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            padding: 6px 2px;
            border-radius: 10px;
            color: rgba(250,250,248,0.45);
            text-decoration: none;
            font-size: 0.6rem;
            font-weight: 600;
            letter-spacing: 0.02em;
            transition: all 0.15s ease;
            min-height: 52px;
          }

          .admin-mobile-nav-item span {
            font-size: 0.58rem;
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
          }

          .admin-mobile-nav-item.active {
            color: #10B981;
            background: rgba(16, 185, 129, 0.12);
          }

          .admin-mobile-nav-item:not(.active):hover {
            color: rgba(250,250,248,0.8);
            background: rgba(255,255,255,0.06);
          }
        }

        @media (max-width: 480px) {
          .admin-mobile-nav-item span {
            font-size: 0.55rem;
          }
        }
      `}</style>
    </>
  );
}
