'use client';

import React from "react";
import { Truck, Gift, Trophy, Sparkles } from "lucide-react";
import { evaluatePromotionEngine, StorePromotionSettings, DEFAULT_STORE_SETTINGS } from "@/services/promotionEngine";

interface CartProgressProps {
  subtotal: number;
  settings?: StorePromotionSettings;
}

export const CartProgress: React.FC<CartProgressProps> = ({
  subtotal,
  settings = DEFAULT_STORE_SETTINGS
}) => {
  const promo = evaluatePromotionEngine(subtotal, settings);

  const { freeShippingThreshold, collectorRewardThreshold, premiumRewardThreshold } = settings;

  const milestones = [
    {
      label: `₹${freeShippingThreshold}`,
      title: "FREE Shipping",
      icon: Truck,
      unlocked: promo.unlockedFreeShipping
    },
    {
      label: `₹${collectorRewardThreshold}`,
      title: "Collector Reward",
      icon: Gift,
      unlocked: promo.unlockedCollectorReward
    },
    {
      label: `₹${premiumRewardThreshold}`,
      title: "Premium Reward",
      icon: Trophy,
      unlocked: promo.unlockedPremiumReward
    }
  ];

  return (
    <div
      style={{
        backgroundColor: "#EFECE6",
        borderRadius: "18px",
        padding: "1.25rem",
        marginBottom: "1.25rem",
        border: "1px solid rgba(17,17,17,0.1)",
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)"
      }}
    >
      {/* Dynamic Status Banner Message */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
        <Sparkles size={16} style={{ color: "#D97706", flexShrink: 0 }} />
        <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111111" }}>
          {promo.statusMessage}
        </span>
      </div>

      {/* Animated Gold Progress Bar */}
      <div
        style={{
          height: "8px",
          width: "100%",
          backgroundColor: "rgba(17,17,17,0.12)",
          borderRadius: "100px",
          overflow: "hidden",
          position: "relative",
          marginBottom: "1.25rem"
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${promo.progressPercentage}%`,
            background: "linear-gradient(90deg, #D97706 0%, #F59E0B 50%, #111111 100%)",
            borderRadius: "100px",
            transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        />
      </div>

      {/* Milestone Points */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
        {milestones.map((m, idx) => {
          const IconComp = m.icon;
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                opacity: m.unlocked ? 1 : 0.6,
                transition: "opacity 0.3s ease"
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: m.unlocked ? "#111111" : "#FFFFFF",
                  color: m.unlocked ? "#F59E0B" : "#666666",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "4px",
                  border: m.unlocked ? "none" : "1px solid rgba(17,17,17,0.2)",
                  boxShadow: m.unlocked ? "0 4px 10px rgba(0,0,0,0.15)" : "none"
                }}
              >
                <IconComp size={14} />
              </div>
              <span style={{ fontSize: "0.7rem", fontWeight: "800", color: "#111111" }}>
                {m.title}
              </span>
              <span style={{ fontSize: "0.65rem", color: "#666666", fontWeight: "600" }}>
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CartProgress;
