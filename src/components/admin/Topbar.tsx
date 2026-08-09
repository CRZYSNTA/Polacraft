"use client";

import React, { useState } from "react";
import UserMenu from "./UserMenu";
import { Search, Bell, Sparkles } from "lucide-react";

interface TopbarProps {
  user: {
    email: string;
    name?: string | null;
    role: string;
  };
}

export default function Topbar({ user }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <>
      <header
        className="admin-topbar"
        style={{
          height: "70px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid var(--color-border-grey, #EFECE6)",
          padding: "0 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Brand label on mobile (hidden on desktop, where sidebar shows it) */}
        <span className="admin-topbar-brand">POLACRAFT ADMIN</span>

        {/* Search Input Bar — hidden on small mobile */}
        <div
          className="admin-topbar-search"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "30px",
            padding: "0.45rem 1rem",
            width: "360px",
            maxWidth: "100%",
            transition: "all 0.2s ease",
          }}
        >
          <Search size={18} style={{ color: "#9CA3AF" }} />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "none",
              background: "none",
              outline: "none",
              fontSize: "0.85rem",
              color: "#111827",
              width: "100%",
            }}
          />
        </div>

        {/* Topbar Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* System Status Pill — hidden on small mobile */}
          <div
            className="admin-topbar-status"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.75rem",
              fontWeight: "700",
              color: "#059669",
              backgroundColor: "#ECFDF5",
              padding: "0.35rem 0.75rem",
              borderRadius: "20px",
              border: "1px solid #A7F3D0",
            }}
          >
            <Sparkles size={13} /> Live Store
          </div>

          {/* Notifications Icon Button */}
          <button
            onClick={() => setHasUnread(false)}
            title="Notifications"
            style={{
              position: "relative",
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              backgroundColor: "#F3F4F6",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#4B5563",
              transition: "all 0.2s ease",
            }}
          >
            <Bell size={18} />
            {hasUnread && (
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  backgroundColor: "#EF4444",
                  border: "2px solid #FFFFFF",
                }}
              />
            )}
          </button>

          {/* Vertical Divider */}
          <div style={{ width: "1px", height: "28px", backgroundColor: "#E5E7EB" }} />

          {/* User Menu Dropdown & Profile */}
          <UserMenu user={user} />
        </div>
      </header>

      <style>{`
        .admin-topbar-brand {
          display: none;
          font-size: 0.9rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #111111;
          white-space: nowrap;
        }

        @media (max-width: 1024px) {
          .admin-topbar {
            padding: 0 1rem !important;
            gap: 0.75rem !important;
          }
          .admin-topbar-brand {
            display: block;
          }
          .admin-topbar-search {
            display: none !important;
          }
          .admin-topbar-status {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
