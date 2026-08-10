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

  // Originkit Hero Section Manual Controls
  const [heroSelectedPosterIdsMobile, setHeroSelectedPosterIdsMobile] = useState<string[]>([]);
  const [heroSelectedPosterIdsDesktop, setHeroSelectedPosterIdsDesktop] = useState<string[]>([]);
  const [heroSpeedMobile, setHeroSpeedMobile] = useState<number>(4.0);
  const [heroSpeedDesktop, setHeroSpeedDesktop] = useState<number>(2.7);
  const [heroCircleInnerRadius, setHeroCircleInnerRadius] = useState<number>(25);
  const [heroCircleRingGap, setHeroCircleRingGap] = useState<number>(95);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

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
    async function loadData() {
      try {
        setLoading(true);
        const [settingsRes, productsRes] = await Promise.all([
          fetch("/api/admin/settings"),
          fetch("/api/admin/products")
        ]);

        if (productsRes.ok) {
          const prodData = await productsRes.json();
          setAvailableProducts(prodData.products || []);
        }

        if (settingsRes.ok) {
          const data = await settingsRes.json();
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

            // Hero Section Controls
            setHeroSelectedPosterIdsMobile(data.settings.heroSelectedPosterIdsMobile || []);
            setHeroSelectedPosterIdsDesktop(data.settings.heroSelectedPosterIdsDesktop || []);
            setHeroSpeedMobile(data.settings.heroSpeedMobile ?? 4.0);
            setHeroSpeedDesktop(data.settings.heroSpeedDesktop ?? 2.7);
            setHeroCircleInnerRadius(data.settings.heroCircleInnerRadius ?? 25);
            setHeroCircleRingGap(data.settings.heroCircleRingGap ?? 95);

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
    loadData();
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

          // Originkit Hero Controls Payload
          heroSelectedPosterIdsMobile,
          heroSelectedPosterIdsDesktop,
          heroSpeedMobile: Number(heroSpeedMobile),
          heroSpeedDesktop: Number(heroSpeedDesktop),
          heroCircleInnerRadius: Number(heroCircleInnerRadius),
          heroCircleRingGap: Number(heroCircleRingGap),

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
          <h1 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#111111", margin: 0, display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Settings style={{ color: "#111111" }} /> Store & System Settings
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#666666", marginTop: "0.25rem" }}>
            Configure store policies, Originkit hero section, custom print pricing, reward thresholds & AI tools.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving || loading}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            padding: "0.75rem 1.75rem",
            borderRadius: "100px",
            fontSize: "0.9rem",
            fontWeight: "800",
            border: "none",
            cursor: saving || loading ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving Changes..." : "Save All Settings"}
        </button>
      </div>

      {savedSuccess && (
        <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #10B981", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "#065F46", fontWeight: "700" }}>
          <CheckCircle2 size={20} /> All store settings and custom print pricing controls saved successfully!
        </div>
      )}

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "#666666" }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 1rem auto" }} />
          Loading store configurations...
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* 🚀 ORIGINKIT HERO CAROUSEL & SPEED CONTROLS */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "1.75rem", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", borderBottom: "1px solid rgba(17,17,17,0.06)", paddingBottom: "1rem" }}>
              <Sparkles style={{ color: "#D4AF37" }} size={22} />
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#111111", margin: 0 }}>Hero Section Originkit Controls</h2>
                <p style={{ fontSize: "0.85rem", color: "#666666", margin: "0.2rem 0 0 0" }}>Select specific posters to display and configure separate mobile & desktop carousel rotation speeds.</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.75rem" }}>
              {/* Mobile Speed Control */}
              <div style={{ backgroundColor: "#F9F9F7", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(17,17,17,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.88rem", fontWeight: "700", color: "#111111" }}>📱 Mobile Rotation Speed</label>
                  <span style={{ fontSize: "0.85rem", fontWeight: "800", backgroundColor: "#111111", color: "#FFFFFF", padding: "0.25rem 0.6rem", borderRadius: "100px" }}>{heroSpeedMobile}x</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#666666", margin: "0 0 0.85rem 0" }}>Speed for mobile Image Group circular deck (1.0 = ultra slow, 15.0 = fast).</p>
                <input 
                  type="range" 
                  min="1.0" 
                  max="15.0" 
                  step="0.5" 
                  value={heroSpeedMobile}
                  onChange={(e) => setHeroSpeedMobile(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#111111", cursor: "pointer" }}
                />
              </div>

              {/* Desktop Speed Control */}
              <div style={{ backgroundColor: "#F9F9F7", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(17,17,17,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.88rem", fontWeight: "700", color: "#111111" }}>💻 Desktop Rotation Speed</label>
                  <span style={{ fontSize: "0.85rem", fontWeight: "800", backgroundColor: "#111111", color: "#FFFFFF", padding: "0.25rem 0.6rem", borderRadius: "100px" }}>{heroSpeedDesktop}x</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#666666", margin: "0 0 0.85rem 0" }}>Speed for desktop 3D Round Carousel ring (0.5 = smooth slow, 10.0 = fast).</p>
                <input 
                  type="range" 
                  min="0.5" 
                  max="10.0" 
                  step="0.1" 
                  value={heroSpeedDesktop}
                  onChange={(e) => setHeroSpeedDesktop(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#111111", cursor: "pointer" }}
                />
              </div>

              {/* Mobile Inner Radius Control */}
              <div style={{ backgroundColor: "#F0F4FF", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(99,102,241,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.88rem", fontWeight: "700", color: "#111111" }}>🔵 Circle Inner Radius</label>
                  <span style={{ fontSize: "0.85rem", fontWeight: "800", backgroundColor: "#6366F1", color: "#FFFFFF", padding: "0.25rem 0.6rem", borderRadius: "100px" }}>{heroCircleInnerRadius}px</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#666666", margin: "0 0 0.85rem 0" }}>Innermost ring radius on mobile (5 = very tight centre, 120 = wide spread).</p>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="1"
                  value={heroCircleInnerRadius}
                  onChange={(e) => setHeroCircleInnerRadius(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#6366F1", cursor: "pointer" }}
                />
              </div>

              {/* Mobile Ring Gap Control */}
              <div style={{ backgroundColor: "#F0F4FF", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(99,102,241,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.88rem", fontWeight: "700", color: "#111111" }}>🔵 Ring Gap (Spacing)</label>
                  <span style={{ fontSize: "0.85rem", fontWeight: "800", backgroundColor: "#6366F1", color: "#FFFFFF", padding: "0.25rem 0.6rem", borderRadius: "100px" }}>{heroCircleRingGap}px</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#666666", margin: "0 0 0.85rem 0" }}>Gap between each concentric ring (30 = dense, 200 = very spread out).</p>
                <input
                  type="range"
                  min="30"
                  max="200"
                  step="1"
                  value={heroCircleRingGap}
                  onChange={(e) => setHeroCircleRingGap(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#6366F1", cursor: "pointer" }}
                />
              </div>
            </div>

            {/* ─────────── TWO-COLUMN POSTER PICKERS ─────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>

              {/* 📱 MOBILE POSTER PICKER */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "800", color: "#111111" }}>
                    📱 Mobile Posters
                    <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", fontWeight: "700", backgroundColor: "#111111", color: "#FFF", padding: "0.15rem 0.5rem", borderRadius: "100px" }}>
                      {heroSelectedPosterIdsMobile.length} selected
                    </span>
                  </label>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button type="button" onClick={() => setHeroSelectedPosterIdsMobile(availableProducts.map(p => p.id))}
                      style={{ fontSize: "0.72rem", fontWeight: "700", color: "#111111", background: "#EFECE6", border: "none", padding: "0.25rem 0.6rem", borderRadius: "5px", cursor: "pointer" }}>
                      All
                    </button>
                    <button type="button" onClick={() => setHeroSelectedPosterIdsMobile([])}
                      style={{ fontSize: "0.72rem", fontWeight: "700", color: "#D97706", background: "#FEF3C7", border: "none", padding: "0.25rem 0.6rem", borderRadius: "5px", cursor: "pointer" }}>
                      Clear
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: "0.76rem", color: "#888", marginBottom: "0.75rem" }}>
                  Shown in the rotating Image Group Circle on mobile. Leave empty to show all.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "320px", overflowY: "auto", padding: "0.6rem", border: "1px solid rgba(17,17,17,0.08)", borderRadius: "10px", backgroundColor: "#FAF9F6" }}>
                  {availableProducts.map((poster) => {
                    const isSel = heroSelectedPosterIdsMobile.includes(poster.id);
                    const img = poster.heroImage || poster.galleryImages?.[0] || poster.images?.[0]?.url || "/assets/custom_grid_poster.png";
                    return (
                      <div key={poster.id} onClick={() => isSel ? setHeroSelectedPosterIdsMobile(heroSelectedPosterIdsMobile.filter(id => id !== poster.id)) : setHeroSelectedPosterIdsMobile([...heroSelectedPosterIdsMobile, poster.id])}
                        style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.45rem 0.5rem", borderRadius: "7px", border: isSel ? "2px solid #111111" : "1px solid rgba(17,17,17,0.08)", backgroundColor: isSel ? "#FFFFFF" : "rgba(255,255,255,0.5)", cursor: "pointer", boxShadow: isSel ? "0 2px 8px rgba(0,0,0,0.06)" : "none", transition: "all 0.12s ease" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={poster.title} style={{ width: "36px", height: "48px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#111111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{poster.title}</div>
                          <div style={{ fontSize: "0.7rem", color: "#888" }}>{poster.film || poster.collectionName}</div>
                        </div>
                        <input type="checkbox" checked={isSel} readOnly style={{ accentColor: "#111111", flexShrink: 0 }} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 💻 DESKTOP POSTER PICKER */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "800", color: "#111111" }}>
                    💻 Desktop Posters
                    <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", fontWeight: "700", backgroundColor: "#1E1E1E", color: "#FFF", padding: "0.15rem 0.5rem", borderRadius: "100px" }}>
                      {heroSelectedPosterIdsDesktop.length} selected
                    </span>
                  </label>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button type="button" onClick={() => setHeroSelectedPosterIdsDesktop(availableProducts.map(p => p.id))}
                      style={{ fontSize: "0.72rem", fontWeight: "700", color: "#111111", background: "#EFECE6", border: "none", padding: "0.25rem 0.6rem", borderRadius: "5px", cursor: "pointer" }}>
                      All
                    </button>
                    <button type="button" onClick={() => setHeroSelectedPosterIdsDesktop([])}
                      style={{ fontSize: "0.72rem", fontWeight: "700", color: "#D97706", background: "#FEF3C7", border: "none", padding: "0.25rem 0.6rem", borderRadius: "5px", cursor: "pointer" }}>
                      Clear
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: "0.76rem", color: "#888", marginBottom: "0.75rem" }}>
                  Shown in the 3D Round Carousel on desktop. Leave empty to show all.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "320px", overflowY: "auto", padding: "0.6rem", border: "1px solid rgba(17,17,17,0.08)", borderRadius: "10px", backgroundColor: "#FAF9F6" }}>
                  {availableProducts.map((poster) => {
                    const isSel = heroSelectedPosterIdsDesktop.includes(poster.id);
                    const img = poster.heroImage || poster.galleryImages?.[0] || poster.images?.[0]?.url || "/assets/custom_grid_poster.png";
                    return (
                      <div key={poster.id} onClick={() => isSel ? setHeroSelectedPosterIdsDesktop(heroSelectedPosterIdsDesktop.filter(id => id !== poster.id)) : setHeroSelectedPosterIdsDesktop([...heroSelectedPosterIdsDesktop, poster.id])}
                        style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.45rem 0.5rem", borderRadius: "7px", border: isSel ? "2px solid #1E1E1E" : "1px solid rgba(17,17,17,0.08)", backgroundColor: isSel ? "#FFFFFF" : "rgba(255,255,255,0.5)", cursor: "pointer", boxShadow: isSel ? "0 2px 8px rgba(0,0,0,0.06)" : "none", transition: "all 0.12s ease" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={poster.title} style={{ width: "36px", height: "48px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#111111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{poster.title}</div>
                          <div style={{ fontSize: "0.7rem", color: "#888" }}>{poster.film || poster.collectionName}</div>
                        </div>
                        <input type="checkbox" checked={isSel} readOnly style={{ accentColor: "#1E1E1E", flexShrink: 0 }} />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>


          {/* 🖼 CUSTOM PRINT STUDIO LIVE PRICING CONTROLS */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "1.75rem", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", borderBottom: "1px solid rgba(17,17,17,0.06)", paddingBottom: "1rem" }}>
              <SlidersHorizontal style={{ color: "#111111" }} size={22} />
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#111111", margin: 0 }}>Custom Print Studio Live Pricing Controls</h2>
                <p style={{ fontSize: "0.85rem", color: "#666666", margin: "0.2rem 0 0 0" }}>Configure dynamic base print prices, layout multipliers, and frame addon costs for /custom.</p>
              </div>
            </div>

            {/* Base Print Prices */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#111111", marginBottom: "0.75rem" }}>Base Print Prices (Unframed, Single Layout)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div style={{ backgroundColor: "#F9F9F7", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.4rem" }}>A5 Base Price (₹)</label>
                  <input type="number" value={customBasePriceA5} onChange={(e) => setCustomBasePriceA5(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
                <div style={{ backgroundColor: "#F9F9F7", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.4rem" }}>A4 Base Price (₹)</label>
                  <input type="number" value={customBasePriceA4} onChange={(e) => setCustomBasePriceA4(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
                <div style={{ backgroundColor: "#F9F9F7", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.4rem" }}>A3 Base Price (₹)</label>
                  <input type="number" value={customBasePriceA3} onChange={(e) => setCustomBasePriceA3(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
              </div>
            </div>

            {/* Layout Multipliers */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#111111", marginBottom: "0.75rem" }}>Layout Price Multipliers</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                <div style={{ backgroundColor: "#F9F9F7", padding: "0.85rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>Single Poster (x)</label>
                  <input type="number" step="0.1" value={customMultSingle} onChange={(e) => setCustomMultSingle(parseFloat(e.target.value) || 1)} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
                <div style={{ backgroundColor: "#F9F9F7", padding: "0.85rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>3-Panel Split (x)</label>
                  <input type="number" step="0.1" value={customMultSplit3} onChange={(e) => setCustomMultSplit3(parseFloat(e.target.value) || 1)} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
                <div style={{ backgroundColor: "#F9F9F7", padding: "0.85rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>2x2 Grid (x)</label>
                  <input type="number" step="0.1" value={customMultSplit2x2} onChange={(e) => setCustomMultSplit2x2(parseFloat(e.target.value) || 1)} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
                <div style={{ backgroundColor: "#F9F9F7", padding: "0.85rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>Retro Card (x)</label>
                  <input type="number" step="0.1" value={customMultRetro} onChange={(e) => setCustomMultRetro(parseFloat(e.target.value) || 1)} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
                <div style={{ backgroundColor: "#F9F9F7", padding: "0.85rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>Pocket Print (x)</label>
                  <input type="number" step="0.1" value={customMultPocket} onChange={(e) => setCustomMultPocket(parseFloat(e.target.value) || 1)} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
                <div style={{ backgroundColor: "#F9F9F7", padding: "0.85rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>Photobooth Strip (x)</label>
                  <input type="number" step="0.1" value={customMultPhotobooth} onChange={(e) => setCustomMultPhotobooth(parseFloat(e.target.value) || 1)} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
              </div>
            </div>

            {/* Frame Addon Costs */}
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#111111", marginBottom: "0.75rem" }}>Frame Addon Price Upcharges</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div style={{ backgroundColor: "#F9F9F7", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.4rem" }}>A5 Frame Addon (+₹)</label>
                  <input type="number" value={customFrameAddonA5} onChange={(e) => setCustomFrameAddonA5(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
                <div style={{ backgroundColor: "#F9F9F7", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.4rem" }}>A4 Frame Addon (+₹)</label>
                  <input type="number" value={customFrameAddonA4} onChange={(e) => setCustomFrameAddonA4(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
                <div style={{ backgroundColor: "#F9F9F7", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(17,17,17,0.06)" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.4rem" }}>A3 Frame Addon (+₹)</label>
                  <input type="number" value={customFrameAddonA3} onChange={(e) => setCustomFrameAddonA3(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI ASSISTANT SETTINGS */}
          <AISettingsPanel settings={aiSettings} onChange={(field, val) => setAiSettings(prev => ({ ...prev, [field]: val }))} />

          {/* STORE POLICIES & THRESHOLDS */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "1.75rem", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", borderBottom: "1px solid rgba(17,17,17,0.06)", paddingBottom: "1rem" }}>
              <Gift style={{ color: "#111111" }} size={22} />
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#111111", margin: 0 }}>Store Shipping & Free Gift Thresholds</h2>
                <p style={{ fontSize: "0.85rem", color: "#666666", margin: "0.2rem 0 0 0" }}>Set thresholds for automatic free shipping and free collector poster rewards.</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111111", display: "block", marginBottom: "0.4rem" }}>Flat Shipping Fee (₹)</label>
                <input type="number" value={shippingFee} onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111111", display: "block", marginBottom: "0.4rem" }}>Free Shipping Threshold (₹)</label>
                <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111111", display: "block", marginBottom: "0.4rem" }}>Tier 1 Collector Reward Threshold (₹)</label>
                <input type="number" value={collectorRewardThreshold} onChange={(e) => setCollectorRewardThreshold(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111111", display: "block", marginBottom: "0.4rem" }}>Tier 2 Premium Reward Threshold (₹)</label>
                <input type="number" value={premiumRewardThreshold} onChange={(e) => setPremiumRewardThreshold(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
            </div>
          </div>

          {/* UNIT EXPENSES & MARGINS */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "1.75rem", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", borderBottom: "1px solid rgba(17,17,17,0.06)", paddingBottom: "1rem" }}>
              <DollarSign style={{ color: "#10B981" }} size={22} />
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#111111", margin: 0 }}>Unit Print & Framing COGS Expenses</h2>
                <p style={{ fontSize: "0.85rem", color: "#666666", margin: "0.2rem 0 0 0" }}>Default unit cost variables used for automatic net profit calculation across all orders.</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>A5 Print Cost (₹)</label>
                <input type="number" value={costA5} onChange={(e) => setCostA5(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>A4 Print Cost (₹)</label>
                <input type="number" value={costA4} onChange={(e) => setCostA4(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>A3 Print Cost (₹)</label>
                <input type="number" value={costA3} onChange={(e) => setCostA3(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>A2 Print Cost (₹)</label>
                <input type="number" value={costA2} onChange={(e) => setCostA2(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>Black Frame Cost (₹)</label>
                <input type="number" value={costBlackFrame} onChange={(e) => setCostBlackFrame(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>Wood Frame Cost (₹)</label>
                <input type="number" value={costWoodFrame} onChange={(e) => setCostWoodFrame(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>Packaging Cost / Order (₹)</label>
                <input type="number" value={packagingCostPerOrder} onChange={(e) => setPackagingCostPerOrder(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", display: "block", marginBottom: "0.3rem" }}>Payment Gateway Fee (%)</label>
                <input type="number" step="0.1" value={gatewayFeePercent} onChange={(e) => setGatewayFeePercent(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid rgba(17,17,17,0.15)", fontWeight: "700" }} />
              </div>
            </div>
          </div>

          {/* BOTTOM SAVE BUTTON */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={saving || loading}
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
                padding: "0.85rem 2.25rem",
                borderRadius: "100px",
                fontSize: "0.95rem",
                fontWeight: "800",
                border: "none",
                cursor: saving || loading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
              }}
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "Saving All Settings..." : "Save All Settings"}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
