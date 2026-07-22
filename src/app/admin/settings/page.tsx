"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, ShieldCheck, Mail, Loader2, CheckCircle2, DollarSign, AlertTriangle, Gift, Sparkles, Layout } from "lucide-react";
import AISettingsPanel from "@/components/admin/AIAssistant/AISettingsPanel";
import { DEFAULT_STORE_SETTINGS } from "@/services/promotionEngine";

export default function AdminSettingsPage() {
  const [shippingFee, setShippingFee] = useState<number>(60);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(499);
  const [collectorRewardThreshold, setCollectorRewardThreshold] = useState<number>(899);
  const [premiumRewardThreshold, setPremiumRewardThreshold] = useState<number>(1499);
  const [loyaltyPointsRatio, setLoyaltyPointsRatio] = useState<number>(100);
  const [heroTitle, setHeroTitle] = useState<string>("Bring Cinema Home.");
  const [heroSubtitle, setHeroSubtitle] = useState<string>("Premium Malayalam Cinema Posters Crafted For Collectors.");
  const [rewardsEnabled, setRewardsEnabled] = useState<boolean>(true);
  const [limitedEditionsEnabled, setLimitedEditionsEnabled] = useState<boolean>(true);
  const [supportEmail, setSupportEmail] = useState<string>("support@polacraft.com");
  const [gstNumber, setGstNumber] = useState<string>("");
  const [instagramUrl, setInstagramUrl] = useState<string>("");

  // AI Assistant Settings
  const [aiSettings, setAiSettings] = useState({
    aiEnabled: true,
    aiProvider: "openai",
    aiVisionEnabled: true,
    aiMetadataEnabled: true,
    aiSocialCaptionsEnabled: true,
    aiDefaultTone: "Collector Focused",
    aiDefaultLanguage: "English",
    aiMaxDescriptionLength: 120
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setShippingFee(data.settings.shippingFee ?? DEFAULT_STORE_SETTINGS.shippingFee);
            setFreeShippingThreshold(data.settings.freeShippingThreshold ?? DEFAULT_STORE_SETTINGS.freeShippingThreshold);
            setCollectorRewardThreshold(data.settings.collectorRewardThreshold ?? DEFAULT_STORE_SETTINGS.collectorRewardThreshold);
            setPremiumRewardThreshold(data.settings.premiumRewardThreshold ?? DEFAULT_STORE_SETTINGS.premiumRewardThreshold);
            setLoyaltyPointsRatio(data.settings.loyaltyPointsRatio ?? DEFAULT_STORE_SETTINGS.loyaltyPointsRatio);
            setHeroTitle(data.settings.heroTitle || DEFAULT_STORE_SETTINGS.heroTitle);
            setHeroSubtitle(data.settings.heroSubtitle || DEFAULT_STORE_SETTINGS.heroSubtitle);
            setRewardsEnabled(data.settings.rewardsEnabled !== undefined ? Boolean(data.settings.rewardsEnabled) : true);
            setLimitedEditionsEnabled(data.settings.limitedEditionsEnabled !== undefined ? Boolean(data.settings.limitedEditionsEnabled) : true);
            setSupportEmail(data.settings.supportEmail || "support@polacraft.com");
            setGstNumber(data.settings.gstNumber || "");
            setInstagramUrl(data.settings.instagramUrl || "");

            setAiSettings({
              aiEnabled: data.settings.aiEnabled !== undefined ? Boolean(data.settings.aiEnabled) : true,
              aiProvider: data.settings.aiProvider || "openai",
              aiVisionEnabled: data.settings.aiVisionEnabled !== undefined ? Boolean(data.settings.aiVisionEnabled) : true,
              aiMetadataEnabled: data.settings.aiMetadataEnabled !== undefined ? Boolean(data.settings.aiMetadataEnabled) : true,
              aiSocialCaptionsEnabled: data.settings.aiSocialCaptionsEnabled !== undefined ? Boolean(data.settings.aiSocialCaptionsEnabled) : true,
              aiDefaultTone: data.settings.aiDefaultTone || "Collector Focused",
              aiDefaultLanguage: data.settings.aiDefaultLanguage || "English",
              aiMaxDescriptionLength: data.settings.aiMaxDescriptionLength || 120
            });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingFee: Number(shippingFee),
          freeShippingThreshold: Number(freeShippingThreshold),
          collectorRewardThreshold: Number(collectorRewardThreshold),
          premiumRewardThreshold: Number(premiumRewardThreshold),
          loyaltyPointsRatio: Number(loyaltyPointsRatio),
          heroTitle,
          heroSubtitle,
          rewardsEnabled,
          limitedEditionsEnabled,
          supportEmail,
          gstNumber,
          instagramUrl,
          ...aiSettings
        })
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        const data = await res.json();
        alert("Error saving settings: " + (data.error || "Unknown error"));
      }
    } catch (e: any) {
      alert("Failed to save settings: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-0.03em" }}>
          Polacraft v1.1 Store Strategy & Rules
        </h1>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Configure shipping rules, value-based reward thresholds, dynamic hero text, and loyalty ratios without code changes.
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
          <CheckCircle2 size={20} /> Store settings saved successfully! All storefront thresholds updated live.
        </div>
      )}

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <Loader2 size={24} className="animate-spin" /> Loading store settings...
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem" }}>
          {/* Left Settings Panel */}
          <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "2rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* SECTION 1: SHIPPING & REWARD THRESHOLDS */}
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: 0, paddingBottom: "0.75rem", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Gift size={20} style={{ color: "#D97706" }} /> Shipping & Value-Based Rewards
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Flat Shipping Fee (₹) *</label>
                <input type="number" required value={shippingFee} onChange={(e) => setShippingFee(Number(e.target.value))} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>FREE Shipping Threshold (₹) *</label>
                <input type="number" required value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Collector Reward Threshold (₹) *</label>
                <input type="number" required value={collectorRewardThreshold} onChange={(e) => setCollectorRewardThreshold(Number(e.target.value))} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Premium Reward Threshold (₹) *</label>
                <input type="number" required value={premiumRewardThreshold} onChange={(e) => setPremiumRewardThreshold(Number(e.target.value))} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>
            </div>

            {/* SECTION 2: CMS HERO TEXT */}
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: "1rem 0 0 0", paddingBottom: "0.75rem", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Layout size={20} style={{ color: "#3B82F6" }} /> CMS Homepage Hero Content
            </h3>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Hero Headline Title *</label>
              <input type="text" required value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Bring Cinema Home." style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Hero Subheadline Description *</label>
              <textarea required value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={2} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
            </div>

            {/* SECTION 3: LOYALTY RATIO */}
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: "1rem 0 0 0", paddingBottom: "0.75rem", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={20} style={{ color: "#9333EA" }} /> Loyalty Points Ratio
            </h3>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Rupees Spent Per 1 Loyalty Point Earned (₹) *</label>
              <input type="number" required value={loyaltyPointsRatio} onChange={(e) => setLoyaltyPointsRatio(Number(e.target.value))} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              <span style={{ fontSize: "0.75rem", color: "#666" }}>Default: ₹100 spent = 1 Loyalty Point earned in customer account.</span>
            </div>

            {/* SECTION 4: AI PRODUCT ASSISTANT SETTINGS */}
            <AISettingsPanel
              settings={aiSettings}
              onChange={(field, val) => setAiSettings((prev) => ({ ...prev, [field]: val }))}
            />

            <button type="submit" disabled={saving} style={{ marginTop: "1rem", padding: "0.85rem", borderRadius: "12px", border: "none", backgroundColor: "#111111", color: "#FFF", fontWeight: 800, fontSize: "0.95rem", cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "Saving Changes..." : "Save Store Strategy Configuration"}
            </button>
          </div>

          {/* Right Toggles & Operational Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck size={18} style={{ color: "#10B981" }} /> System Feature Toggles
              </h4>

              <div style={{ padding: "1rem", backgroundColor: "#F9FAFB", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <strong style={{ fontSize: "0.85rem", display: "block" }}>Rewards Program</strong>
                  <span style={{ fontSize: "0.75rem", color: "#666" }}>Enable Collector & Premium rewards</span>
                </div>
                <input type="checkbox" checked={rewardsEnabled} onChange={(e) => setRewardsEnabled(e.target.checked)} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
              </div>

              <div style={{ padding: "1rem", backgroundColor: "#F9FAFB", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <strong style={{ fontSize: "0.85rem", display: "block" }}>Limited Edition Counter</strong>
                  <span style={{ fontSize: "0.75rem", color: "#666" }}>Display print numbers (e.g. 17/100)</span>
                </div>
                <input type="checkbox" checked={limitedEditionsEnabled} onChange={(e) => setLimitedEditionsEnabled(e.target.checked)} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
              </div>
            </div>

            <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>Business Contact Info</h4>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Support Email</label>
                <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>GSTIN Number</label>
                <input type="text" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }} />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
