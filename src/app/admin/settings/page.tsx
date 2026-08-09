"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, ShieldCheck, Mail, Loader2, CheckCircle2, DollarSign, AlertTriangle, Gift, Sparkles, Layout, SlidersHorizontal, Image as ImageIcon } from "lucide-react";
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

  // Enterprise Variable Unit Expense Settings
  const [costA5, setCostA5] = useState<number>(15);
  const [costA4, setCostA4] = useState<number>(28);
  const [costA3, setCostA3] = useState<number>(52);
  const [costA2, setCostA2] = useState<number>(100);
  const [costCanvas, setCostCanvas] = useState<number>(200);
  const [costBlackFrame, setCostBlackFrame] = useState<number>(120);
  const [costWoodFrame, setCostWoodFrame] = useState<number>(150);
  const [packagingCostPerOrder, setPackagingCostPerOrder] = useState<number>(18);
  const [gatewayFeePercent, setGatewayFeePercent] = useState<number>(2.0);
  const [gstTaxPercent, setGstTaxPercent] = useState<number>(18.0);

  // Custom Print Studio Live Pricing Controls
  const [customBasePriceA5, setCustomBasePriceA5] = useState<number>(45);
  const [customBasePriceA4, setCustomBasePriceA4] = useState<number>(70);
  const [customBasePriceA3, setCustomBasePriceA3] = useState<number>(100);
  const [customMultSingle, setCustomMultSingle] = useState<number>(1.0);
  const [customMultSplit3, setCustomMultSplit3] = useState<number>(2.5);
  const [customMultSplit2x2, setCustomMultSplit2x2] = useState<number>(3.2);
  const [customMultRetro, setCustomMultRetro] = useState<number>(1.5);
  const [customMultPocket, setCustomMultPocket] = useState<number>(0.8);
  const [customMultPhotobooth, setCustomMultPhotobooth] = useState<number>(0.9);
  const [customFrameAddonA5, setCustomFrameAddonA5] = useState<number>(155);
  const [customFrameAddonA4, setCustomFrameAddonA4] = useState<number>(180);
  const [customFrameAddonA3, setCustomFrameAddonA3] = useState<number>(200);

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

            setCostA5(data.settings.costA5 ?? 15);
            setCostA4(data.settings.costA4 ?? 28);
            setCostA3(data.settings.costA3 ?? 52);
            setCostA2(data.settings.costA2 ?? 100);
            setCostCanvas(data.settings.costCanvas ?? 200);
            setCostBlackFrame(data.settings.costBlackFrame ?? 120);
            setCostWoodFrame(data.settings.costWoodFrame ?? 150);
            setPackagingCostPerOrder(data.settings.packagingCostPerOrder ?? 18);
            setGatewayFeePercent(data.settings.gatewayFeePercent ?? 2.0);
            setGstTaxPercent(data.settings.gstTaxPercent ?? 18.0);

            // Custom Print Pricing
            setCustomBasePriceA5(data.settings.customBasePriceA5 ?? 45);
            setCustomBasePriceA4(data.settings.customBasePriceA4 ?? 70);
            setCustomBasePriceA3(data.settings.customBasePriceA3 ?? 100);
            setCustomMultSingle(data.settings.customMultSingle ?? 1.0);
            setCustomMultSplit3(data.settings.customMultSplit3 ?? 2.5);
            setCustomMultSplit2x2(data.settings.customMultSplit2x2 ?? 3.2);
            setCustomMultRetro(data.settings.customMultRetro ?? 1.5);
            setCustomMultPocket(data.settings.customMultPocket ?? 0.8);
            setCustomMultPhotobooth(data.settings.customMultPhotobooth ?? 0.9);
            setCustomFrameAddonA5(data.settings.customFrameAddonA5 ?? 155);
            setCustomFrameAddonA4(data.settings.customFrameAddonA4 ?? 180);
            setCustomFrameAddonA3(data.settings.customFrameAddonA3 ?? 200);

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
          costA5: Number(costA5),
          costA4: Number(costA4),
          costA3: Number(costA3),
          costA2: Number(costA2),
          costCanvas: Number(costCanvas),
          costBlackFrame: Number(costBlackFrame),
          costWoodFrame: Number(costWoodFrame),
          packagingCostPerOrder: Number(packagingCostPerOrder),
          gatewayFeePercent: Number(gatewayFeePercent),
          gstTaxPercent: Number(gstTaxPercent),
          
          // Custom Print Pricing Payload
          customBasePriceA5: Number(customBasePriceA5),
          customBasePriceA4: Number(customBasePriceA4),
          customBasePriceA3: Number(customBasePriceA3),
          customMultSingle: Number(customMultSingle),
          customMultSplit3: Number(customMultSplit3),
          customMultSplit2x2: Number(customMultSplit2x2),
          customMultRetro: Number(customMultRetro),
          customMultPocket: Number(customMultPocket),
          customMultPhotobooth: Number(customMultPhotobooth),
          customFrameAddonA5: Number(customFrameAddonA5),
          customFrameAddonA4: Number(customFrameAddonA4),
          customFrameAddonA3: Number(customFrameAddonA3),

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
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#0F172A", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Settings size={28} style={{ color: "#D4AF37" }} /> Store Strategy & Pricing Controls
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Manage custom print prices, shipping rates, reward thresholds, unit costs, and AI controls.
          </p>
        </div>

        {savedSuccess && (
          <div style={{ backgroundColor: "#DCFCE7", border: "1px solid #86EFAC", color: "#166534", padding: "0.6rem 1.2rem", borderRadius: "100px", fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle2 size={16} /> Strategy & Custom Pricing Updated!
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center" }}>
          <Loader2 size={32} className="animate-spin" style={{ color: "#111111", margin: "0 auto" }} />
          <p style={{ marginTop: "1rem", color: "#64748B", fontSize: "0.9rem" }}>Loading store configuration...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>
          
          {/* Main Controls Panel */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "2rem", border: "1px solid #EFECE6", boxShadow: "0 4px 18px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* SECTION 1: CUSTOM PRINT STUDIO PRICING MANAGEMENT */}
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "900", color: "#0F172A", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ImageIcon size={22} style={{ color: "#10B981" }} /> Custom Print Studio Price Controls
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#64748B", margin: "0 0 1.25rem 0" }}>
                Set real-time rates for custom uploads on <code>/custom</code>. Base paper prices are multiplied by format multipliers, with frame add-on totals.
              </p>

              {/* 1A. BASE PAPER PRICES */}
              <div style={{ backgroundColor: "#F8FAFC", borderRadius: "14px", padding: "1.25rem", border: "1px solid #E2E8F0", marginBottom: "1.25rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "800", color: "#334155", margin: "0 0 0.75rem 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  1. Base Paper Print Prices (Unframed)
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>A5 Base Rate (₹)</label>
                    <input type="number" step="1" value={customBasePriceA5} onChange={(e) => setCustomBasePriceA5(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>A4 Base Rate (₹)</label>
                    <input type="number" step="1" value={customBasePriceA4} onChange={(e) => setCustomBasePriceA4(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>A3 Base Rate (₹)</label>
                    <input type="number" step="1" value={customBasePriceA3} onChange={(e) => setCustomBasePriceA3(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                </div>
              </div>

              {/* 1B. FORMAT MULTIPLIERS */}
              <div style={{ backgroundColor: "#F8FAFC", borderRadius: "14px", padding: "1.25rem", border: "1px solid #E2E8F0", marginBottom: "1.25rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "800", color: "#334155", margin: "0 0 0.75rem 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  2. Custom Format Price Multipliers
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Single Poster Multiplier</label>
                    <input type="number" step="0.1" value={customMultSingle} onChange={(e) => setCustomMultSingle(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>3-Panel Split Multiplier</label>
                    <input type="number" step="0.1" value={customMultSplit3} onChange={(e) => setCustomMultSplit3(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>2x2 Grid Multiplier</label>
                    <input type="number" step="0.1" value={customMultSplit2x2} onChange={(e) => setCustomMultSplit2x2(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Retro Prints Multiplier</label>
                    <input type="number" step="0.1" value={customMultRetro} onChange={(e) => setCustomMultRetro(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Mini Pocket Multiplier</label>
                    <input type="number" step="0.1" value={customMultPocket} onChange={(e) => setCustomMultPocket(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Photobooth Multiplier</label>
                    <input type="number" step="0.1" value={customMultPhotobooth} onChange={(e) => setCustomMultPhotobooth(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                </div>
              </div>

              {/* 1C. FRAME ADD-ONS & LIVE CALCULATOR PREVIEW */}
              <div style={{ backgroundColor: "#FEF3C7", borderRadius: "14px", padding: "1.25rem", border: "1px solid #FDE68A" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "800", color: "#92400E", margin: "0 0 0.75rem 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  3. Framing Option Add-On Rates & Live Preview
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#B45309" }}>A5 Framed Add-On Total (₹)</label>
                    <input type="number" step="1" value={customFrameAddonA5} onChange={(e) => setCustomFrameAddonA5(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#B45309" }}>A4 Framed Add-On Total (₹)</label>
                    <input type="number" step="1" value={customFrameAddonA4} onChange={(e) => setCustomFrameAddonA4(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#B45309" }}>A3 Framed Add-On Total (₹)</label>
                    <input type="number" step="1" value={customFrameAddonA3} onChange={(e) => setCustomFrameAddonA3(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "0.88rem", fontWeight: "700" }} />
                  </div>
                </div>

                {/* Real-time Calculation Sample Table */}
                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "0.85rem", fontSize: "0.78rem", color: "#333" }}>
                  <strong style={{ display: "block", color: "#92400E", marginBottom: "0.4rem" }}>Live Price Calculation Preview for Customers:</strong>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                    <div>• Single A4 Unframed: <strong>₹{Math.round(customBasePriceA4 * customMultSingle)}</strong></div>
                    <div>• Single A4 Framed: <strong>₹{Math.round(customFrameAddonA4 * customMultSingle)}</strong></div>
                    <div>• 3-Panel Split A4 Framed: <strong>₹{Math.round(customFrameAddonA4 * customMultSplit3)}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: PROMOTIONS & THRESHOLDS */}
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "900", color: "#0F172A", margin: "0 0 1rem 0", paddingBottom: "0.75rem", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Gift size={22} style={{ color: "#D4AF37" }} /> Free Shipping & Reward Thresholds
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
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
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Collector Gift Threshold (₹) *</label>
                  <input type="number" required value={collectorRewardThreshold} onChange={(e) => setCollectorRewardThreshold(Number(e.target.value))} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Premium Pack Threshold (₹) *</label>
                  <input type="number" required value={premiumRewardThreshold} onChange={(e) => setPremiumRewardThreshold(Number(e.target.value))} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
                </div>
              </div>
            </div>

            {/* SECTION 3: ENTERPRISE EXPENSES */}
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "900", color: "#0F172A", margin: "0 0 1rem 0", paddingBottom: "0.75rem", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <DollarSign size={22} style={{ color: "#10B981" }} /> Unit Costs & COGS Matrix
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#333" }}>A5 Paper Cost (₹)</label>
                  <input type="number" step="0.1" value={costA5} onChange={(e) => setCostA5(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#333" }}>A4 Paper Cost (₹)</label>
                  <input type="number" step="0.1" value={costA4} onChange={(e) => setCostA4(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#333" }}>A3 Paper Cost (₹)</label>
                  <input type="number" step="0.1" value={costA3} onChange={(e) => setCostA3(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#333" }}>Black Frame Cost (₹)</label>
                  <input type="number" step="0.1" value={costBlackFrame} onChange={(e) => setCostBlackFrame(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }} />
                </div>
              </div>
            </div>

            {/* SECTION 4: CMS HERO TEXT */}
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "900", color: "#0F172A", margin: "0 0 1rem 0", paddingBottom: "0.75rem", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Layout size={22} style={{ color: "#3B82F6" }} /> CMS Homepage Hero Content
              </h3>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Hero Headline Title *</label>
                <input type="text" required value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Bring Cinema Home." style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Hero Subheadline Description *</label>
                <textarea required value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={2} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>
            </div>

            {/* AI ASSISTANT SETTINGS PANEL */}
            <AISettingsPanel
              settings={aiSettings}
              onChange={(field, val) => setAiSettings((prev) => ({ ...prev, [field]: val }))}
            />

            <button type="submit" disabled={saving} style={{ marginTop: "1rem", padding: "1rem", borderRadius: "14px", border: "none", backgroundColor: "#111111", color: "#FFF", fontWeight: 900, fontSize: "1rem", cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
              {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {saving ? "Saving Changes..." : "Save Custom Pricing & Store Configuration"}
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

              <button
                type="submit"
                disabled={saving}
                style={{
                  marginTop: "0.5rem",
                  width: "100%",
                  padding: "0.85rem",
                  borderRadius: "12px",
                  backgroundColor: "#0F172A",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.2)",
                }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? "Saving Changes..." : "Save All Settings"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
