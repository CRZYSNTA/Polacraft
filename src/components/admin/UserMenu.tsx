"use client";

import React, { useState, useRef, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import { ShieldCheck, ChevronDown, User } from "lucide-react";

interface UserMenuProps {
  user: {
    email: string;
    name?: string | null;
    role: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user.name || user.email.split("@")[0];
  const initials = displayName.substring(0, 2).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: "none",
          border: "1px solid var(--color-border-grey, #EFECE6)",
          padding: "0.4rem 0.75rem",
          borderRadius: "30px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "var(--color-charcoal-accent, #1E1E1E)",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            fontWeight: "700",
            letterSpacing: "0.05em",
          }}
        >
          {initials}
        </div>
        <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1E1E1E" }}>
            {displayName}
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              color: "#10B981",
              fontWeight: "800",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <ShieldCheck size={10} /> {user.role}
          </span>
        </div>
        <ChevronDown size={14} style={{ color: "#888" }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "240px",
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            border: "1px solid #EFECE6",
            padding: "1.25rem",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={18} style={{ color: "#666" }} />
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#111", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {displayName}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#666", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: "600" }}>Access Level</span>
            <span style={{ fontSize: "0.7rem", backgroundColor: "#ECFDF5", color: "#047857", fontWeight: "700", padding: "0.2rem 0.5rem", borderRadius: "6px" }}>
              {user.role}
            </span>
          </div>

          <LogoutButton variant="full" />
        </div>
      )}
    </div>
  );
}
