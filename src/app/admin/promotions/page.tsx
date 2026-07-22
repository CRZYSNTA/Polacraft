'use client';

import React, { useState, useEffect } from "react";
import { Calendar, Plus, CheckCircle2, Sparkles, Clock, Trash2, Tag } from "lucide-react";

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("499");
  const [collectorRewardThreshold, setCollectorRewardThreshold] = useState("899");
  const [premiumRewardThreshold, setPremiumRewardThreshold] = useState("1499");
  const [bannerText, setBannerText] = useState("");

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/promotions");
      if (res.ok) {
        const data = await res.json();
        setPromotions(data.promotions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          startDate,
          endDate,
          freeShippingThreshold,
          collectorRewardThreshold,
          premiumRewardThreshold,
          bannerText
        })
      });

      if (res.ok) {
        setShowForm(false);
        setName("");
        setBannerText("");
        loadPromotions();
      } else {
        const data = await res.json();
        alert("Error: " + data.error);
      }
    } catch (e: any) {
      alert("Failed to create promotion: " + e.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-0.03em" }}>
            Promotion Scheduler
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Schedule upcoming festival sales (Onam, Christmas, Weekend Flash Sales) with automatic start/end dates.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            padding: "0.75rem 1.5rem",
            borderRadius: "100px",
            fontSize: "0.85rem",
            fontWeight: "700",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Plus size={16} /> {showForm ? "Cancel" : "Schedule New Sale"}
        </button>
      </div>

      {/* Schedule Form */}
      {showForm && (
        <form onSubmit={handleCreate} style={{ backgroundColor: "#FFFFFF", padding: "2rem", borderRadius: "20px", border: "1px solid #EFECE6", boxShadow: "0 4px 15px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: 0 }}>Create Scheduled Promotion</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Promotion Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Onam Special Collector Sale" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB" }} />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Start Date *</label>
              <input type="datetime-local" required value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB" }} />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>End Date *</label>
              <input type="datetime-local" required value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Free Shipping Threshold (₹)</label>
              <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB" }} />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Collector Reward Threshold (₹)</label>
              <input type="number" value={collectorRewardThreshold} onChange={(e) => setCollectorRewardThreshold(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB" }} />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Premium Reward Threshold (₹)</label>
              <input type="number" value={premiumRewardThreshold} onChange={(e) => setPremiumRewardThreshold(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Custom Top Offer Banner Announcement Text</label>
            <input type="text" value={bannerText} onChange={(e) => setBannerText(e.target.value)} placeholder="e.g. 🌼 ONAM FESTIVAL SALE! Free A3 Print on ₹899+ Orders!" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB" }} />
          </div>

          <button type="submit" style={{ alignSelf: "flex-start", backgroundColor: "#10B981", color: "#FFFFFF", padding: "0.75rem 2rem", borderRadius: "12px", border: "none", fontWeight: 800, cursor: "pointer" }}>
            Activate & Schedule Promotion
          </button>
        </form>
      )}

      {/* Promotions List */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EFECE6" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "1rem" }}>Scheduled & Active Sales</h3>

        {loading ? (
          <p style={{ color: "#666" }}>Loading scheduled promotions...</p>
        ) : promotions.length === 0 ? (
          <p style={{ color: "#666", fontSize: "0.9rem" }}>No custom scheduled promotions created yet. Default store settings are active.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {promotions.map((p) => {
              const now = new Date();
              const start = new Date(p.startDate);
              const end = new Date(p.endDate);
              const isLive = now >= start && now <= end && p.isActive;

              return (
                <div key={p.id} style={{ padding: "1.25rem", borderRadius: "14px", border: isLive ? "2px solid #10B981" : "1px solid #E5E7EB", backgroundColor: isLive ? "#ECFDF5" : "#FAFAF8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: "800", margin: 0 }}>{p.name}</h4>
                      <span style={{ fontSize: "0.7rem", fontWeight: "800", backgroundColor: isLive ? "#10B981" : "#666", color: "#FFF", padding: "0.2rem 0.6rem", borderRadius: "100px" }}>
                        {isLive ? "LIVE NOW" : now < start ? "SCHEDULED" : "ENDED"}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#666", margin: "4px 0 0 0" }}>
                      📅 {new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}
                    </p>
                    {p.bannerText && (
                      <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#D97706", margin: "4px 0 0 0" }}>
                        📢 {p.bannerText}
                      </p>
                    )}
                  </div>

                  <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#333" }}>
                    <div>Free Shipping: <strong>₹{p.freeShippingThreshold || 499}</strong></div>
                    <div>Collector Reward: <strong>₹{p.collectorRewardThreshold || 899}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
