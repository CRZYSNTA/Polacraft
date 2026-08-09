'use client';

import React from "react";
import { evaluatePromotionEngine, StorePromotionSettings, DEFAULT_STORE_SETTINGS } from "@/services/promotionEngine";

interface CartProgressProps {
  subtotal: number;
  settings?: StorePromotionSettings;
}

export const CartProgress: React.FC<CartProgressProps> = ({
  subtotal,
  settings = DEFAULT_STORE_SETTINGS
}) => {
  const { 
    freeShippingThreshold = 499, 
    collectorRewardThreshold = 899, 
    premiumRewardThreshold = 1499 
  } = settings;

  // Calculate dynamic remaining amount & progress percentage for current tier
  let progressText = "";
  let progressPercent = 0;

  if (subtotal < freeShippingThreshold) {
    const diff = freeShippingThreshold - subtotal;
    progressText = `You're ₹${diff.toLocaleString("en-IN")} away from FREE Shipping`;
    progressPercent = Math.min(33.3, (subtotal / freeShippingThreshold) * 33.3);
  } else if (subtotal < collectorRewardThreshold) {
    const diff = collectorRewardThreshold - subtotal;
    progressText = `You're ₹${diff.toLocaleString("en-IN")} away from a Free Collector Gift`;
    progressPercent = 33.3 + Math.min(33.3, ((subtotal - freeShippingThreshold) / (collectorRewardThreshold - freeShippingThreshold)) * 33.3);
  } else if (subtotal < premiumRewardThreshold) {
    const diff = premiumRewardThreshold - subtotal;
    progressText = `You're ₹${diff.toLocaleString("en-IN")} away from a Free Premium Wall Pack`;
    progressPercent = 66.6 + Math.min(33.4, ((subtotal - collectorRewardThreshold) / (premiumRewardThreshold - collectorRewardThreshold)) * 33.4);
  } else {
    progressText = "🎉 You've unlocked ALL free gifts & rewards!";
    progressPercent = 100;
  }

  const milestones = [
    {
      price: freeShippingThreshold,
      title: "FREE Shipping",
      icon: "🚚",
      unlocked: subtotal >= freeShippingThreshold
    },
    {
      price: collectorRewardThreshold,
      title: "Free Collector Gift",
      icon: "🎁",
      unlocked: subtotal >= collectorRewardThreshold
    },
    {
      price: premiumRewardThreshold,
      title: "Free Premium Pack",
      icon: "👑",
      unlocked: subtotal >= premiumRewardThreshold
    }
  ];

  return (
    <div style={{ padding: "1rem 1.25rem 0.5rem 1.25rem", textAlign: "center" }}>
      {/* Dynamic Subtitle Banner */}
      <p style={{ fontSize: "0.82rem", fontWeight: "600", color: "#333333", margin: "0 0 1rem 0" }}>
        {progressText}
      </p>

      {/* Progress Line Bar Container */}
      <div style={{ position: "relative", padding: "0 1.25rem", marginBottom: "1.25rem" }}>
        
        {/* Background Track Line */}
        <div 
          style={{ 
            position: "absolute", 
            top: "7px", 
            left: "2.5rem", 
            right: "2.5rem", 
            height: "3px", 
            backgroundColor: "#E5E7EB", 
            zIndex: 1 
          }} 
        />

        {/* Active Dark Progress Line */}
        <div 
          style={{ 
            position: "absolute", 
            top: "7px", 
            left: "2.5rem", 
            width: `calc(${progressPercent}% * 0.78)`, 
            height: "3px", 
            backgroundColor: "#111111", 
            zIndex: 2, 
            transition: "width 0.4s ease" 
          }} 
        />

        {/* 3 Milestone Nodes */}
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 3 }}>
          {milestones.map((m, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "30%" }}>
              
              {/* Dot Node */}
              <div 
                style={{ 
                  width: "16px", 
                  height: "16px", 
                  borderRadius: "50%", 
                  backgroundColor: m.unlocked ? "#111111" : "#D1D5DB", 
                  border: "3px solid #FFFFFF", 
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)", 
                  marginBottom: "0.4rem",
                  transition: "background-color 0.3s ease"
                }} 
              />

              {/* Milestone Icon & Title */}
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "1rem", display: "block", lineHeight: "1" }}>
                  {m.icon}
                </span>
                <span style={{ fontSize: "0.68rem", fontWeight: "700", color: m.unlocked ? "#111111" : "#666666", lineHeight: "1.2", display: "block", marginTop: "2px" }}>
                  {m.title}
                </span>
                <span style={{ fontSize: "0.62rem", color: "#9CA3AF", fontWeight: "500", display: "block" }}>
                  ₹{m.price}+
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CartProgress;
