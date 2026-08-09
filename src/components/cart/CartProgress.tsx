'use client';

import React from "react";
import { Gift, PackageCheck, Sparkles } from "lucide-react";
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
  const { freeShippingThreshold = 499, collectorRewardThreshold = 799, premiumRewardThreshold = 1199 } = settings;

  // Calculate amount away for current tier
  let progressText = "";
  let progressPercent = 0;

  if (subtotal < freeShippingThreshold) {
    const diff = freeShippingThreshold - subtotal;
    progressText = `You're ₹${diff.toLocaleString("en-IN")} away from a free Aesthetic Stickers`;
    progressPercent = Math.min(33, (subtotal / freeShippingThreshold) * 33);
  } else if (subtotal < collectorRewardThreshold) {
    const diff = collectorRewardThreshold - subtotal;
    progressText = `You're ₹${diff.toLocaleString("en-IN")} away from a Mystery Poster x 3`;
    progressPercent = 33 + Math.min(33, ((subtotal - freeShippingThreshold) / (collectorRewardThreshold - freeShippingThreshold)) * 33);
  } else if (subtotal < premiumRewardThreshold) {
    const diff = premiumRewardThreshold - subtotal;
    progressText = `You're ₹${diff.toLocaleString("en-IN")} away from Free 300 Glue Dots`;
    progressPercent = 66 + Math.min(34, ((subtotal - collectorRewardThreshold) / (premiumRewardThreshold - collectorRewardThreshold)) * 34);
  } else {
    progressText = "🎉 You've unlocked ALL free gifts & rewards!";
    progressPercent = 100;
  }

  const milestones = [
    {
      price: freeShippingThreshold,
      title: "Free Aesthetic Stickers",
      unlocked: subtotal >= freeShippingThreshold
    },
    {
      price: collectorRewardThreshold,
      title: "Mystery Poster x 3",
      unlocked: subtotal >= collectorRewardThreshold
    },
    {
      price: premiumRewardThreshold,
      title: "Free 300 Glue Dots (Damage-Free Mounting)",
      unlocked: subtotal >= premiumRewardThreshold
    }
  ];

  return (
    <div style={{ padding: "1rem 1.25rem 0.5rem 1.25rem", textAlign: "center" }}>
      {/* Subtitle Message */}
      <p style={{ fontSize: "0.82rem", fontWeight: "600", color: "#333333", margin: "0 0 1rem 0" }}>
        {progressText}
      </p>

      {/* Progress Line Container */}
      <div style={{ position: "relative", padding: "0 1rem", marginBottom: "1.25rem" }}>
        
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

        {/* Active Progress Line */}
        <div 
          style={{ 
            position: "absolute", 
            top: "7px", 
            left: "2.5rem", 
            width: `calc(${progressPercent}% * 0.8)`, 
            height: "3px", 
            backgroundColor: "#111111", 
            zIndex: 2, 
            transition: "width 0.4s ease" 
          }} 
        />

        {/* Milestone Nodes */}
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
                  {index === 0 ? "🎁" : index === 1 ? "🎁" : "🎁"}
                </span>
                <span style={{ fontSize: "0.68rem", fontWeight: "600", color: m.unlocked ? "#111111" : "#666666", lineHeight: "1.2", display: "block", marginTop: "2px" }}>
                  {m.title}
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
