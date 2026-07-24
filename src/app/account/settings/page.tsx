"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Settings, ArrowLeft, Shield, Bell, User } from "lucide-react";

export default function AccountSettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0B0C10", color: "#F3F4F6", paddingTop: "120px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        <Link href="/account" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#D4AF37", textDecoration: "none", fontSize: "0.9rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#FFFFFF", marginBottom: "0.5rem" }}>
          Account Settings
        </h1>
        <p style={{ color: "#9CA3AF", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Manage your profile identity, security preferences, and communications.
        </p>

        <div style={{ backgroundColor: "#12141A", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", marginTop: 0, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User size={18} style={{ color: "#D4AF37" }} /> Personal Profile
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#6B7280", fontWeight: 700, textTransform: "uppercase" }}>Full Name</label>
              <div style={{ fontSize: "1rem", color: "#FFF", fontWeight: 700, marginTop: "0.2rem" }}>{user?.name || "Collector"}</div>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#6B7280", fontWeight: 700, textTransform: "uppercase" }}>Email Address</label>
              <div style={{ fontSize: "1rem", color: "#FFF", fontWeight: 700, marginTop: "0.2rem" }}>{user?.email}</div>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#6B7280", fontWeight: 700, textTransform: "uppercase" }}>Account Role</label>
              <div style={{ fontSize: "0.9rem", color: "#D4AF37", fontWeight: 800, marginTop: "0.2rem" }}>{(user as any)?.role || "CUSTOMER"}</div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "#12141A", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", marginTop: 0, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={18} style={{ color: "#10B981" }} /> Security & Privacy
          </h3>
          <p style={{ color: "#9CA3AF", fontSize: "0.85rem", margin: 0 }}>
            Authenticated via <strong>Google OAuth 2.0</strong>. Your session uses secure HTTP-only cookies and encrypted OAuth tokens.
          </p>
        </div>

      </div>
    </div>
  );
}
