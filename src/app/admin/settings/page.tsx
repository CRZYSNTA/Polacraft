"use client";

import React, { useState, useEffect, useTransition } from "react";
import { saveSiteSettingsAction, SiteSettingsInput } from "@/features/admin/businessActions";
import { Settings, Save, ShieldCheck, Mail, Loader2, CheckCircle2, DollarSign, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
  const [shippingFee, setShippingFee] = useState(150);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(3000);
  const [supportEmail, setSupportEmail] = useState("support@polacraft.in");
  const [gstNumber, setGstNumber] = useState("32AABCP1234F1ZP");
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com/polacraft");
  const [logo, setLogo] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setShippingFee(data.settings.shippingFee ?? 150);
            setFreeShippingThreshold(data.settings.freeShippingThreshold ?? 3000);
            setSupportEmail(data.settings.supportEmail || "support@polacraft.in");
            setGstNumber(data.settings.gstNumber || "");
            setInstagramUrl(data.settings.instagramUrl || "");
            setLogo(data.settings.logo || "");
            setMaintenanceMode(Boolean(data.settings.maintenanceMode));
          }
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    startTransition(async () => {
      const payload: SiteSettingsInput = {
        shippingFee: Number(shippingFee),
        freeShippingThreshold: Number(freeShippingThreshold),
        supportEmail,
        gstNumber,
        instagramUrl,
        logo,
        maintenanceMode,
      };

      const res = await saveSiteSettingsAction(payload);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert("Error saving settings: " + res.error);
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-0.03em" }}>
          Store Settings & Financial Rules
        </h1>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Configure shipping rates, GST tax invoices, customer support contacts, and store maintenance overrides.
        </p>
      </div>

      {savedSuccess && (
        <div
          style={{
            backgroundColor: "#ECFDF5",
            border: "1px solid #A7F3D0",
            color: "#047857",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontWeight: "700",
            fontSize: "0.9rem",
          }}
        >
          <CheckCircle2 size={20} /> Store settings updated successfully!
        </div>
      )}

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <Loader2 size={24} className="animate-spin" /> Loading site settings...
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem" }}>
          {/* Main Settings Panel */}
          <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "2rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: 0, paddingBottom: "0.75rem", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <DollarSign size={20} style={{ color: "#10B981" }} /> Shipping & GST Calculations
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Standard Flat Shipping Fee (₹) *</label>
                <input type="number" required value={shippingFee} onChange={(e) => setShippingFee(Number(e.target.value))} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Free Shipping Order Minimum (₹) *</label>
                <input type="number" required value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Business GSTIN Number (for Tax Invoices)</label>
              <input type="text" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="32AABCP1234F1ZP" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
            </div>

            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: "1rem 0 0 0", paddingBottom: "0.75rem", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Mail size={20} style={{ color: "#3B82F6" }} /> Contact & Social Links
            </h3>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Customer Support Email *</label>
              <input type="email" required value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="support@polacraft.in" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Instagram Profile URL</label>
              <input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/polacraft" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
            </div>

            <button type="submit" disabled={isPending} style={{ marginTop: "1rem", padding: "0.85rem", borderRadius: "12px", border: "none", backgroundColor: "#10B981", color: "#FFF", fontWeight: 800, fontSize: "0.95rem", cursor: isPending ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isPending ? "Saving Changes..." : "Save Store Configuration"}
            </button>
          </div>

          {/* Operations & Maintenance Side Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertTriangle size={18} style={{ color: "#D97706" }} /> Store Operational Overrides
              </h4>

              <div style={{ padding: "1rem", backgroundColor: maintenanceMode ? "#FEF2F2" : "#F9FAFB", border: maintenanceMode ? "1px solid #FCA5A5" : "1px solid #E5E7EB", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <strong style={{ fontSize: "0.85rem", display: "block" }}>Maintenance Mode</strong>
                  <span style={{ fontSize: "0.75rem", color: "#666" }}>
                    {maintenanceMode ? "Storefront restricted to visitors" : "Storefront operating normally"}
                  </span>
                </div>

                <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
