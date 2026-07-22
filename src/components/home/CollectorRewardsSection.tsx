'use client';

import React from "react";
import { motion } from "framer-motion";
import { Truck, Gift, Trophy, Sparkles } from "lucide-react";

interface CollectorRewardsProps {
  freeShippingThreshold: number;
  collectorRewardThreshold: number;
  premiumRewardThreshold: number;
}

export default function CollectorRewardsSection({
  freeShippingThreshold,
  collectorRewardThreshold,
  premiumRewardThreshold
}: CollectorRewardsProps) {
  const rewardTiers = [
    {
      tier: "Everyday Tier",
      threshold: freeShippingThreshold,
      title: "FREE Express Shipping",
      desc: "Order minimum to unlock nationwide 0-cost tracked courier delivery.",
      icon: Truck,
      color: "#3B82F6",
      tag: "Everyday Offer"
    },
    {
      tier: "Collector Tier",
      threshold: collectorRewardThreshold,
      title: "1 × FREE Collector Reward",
      desc: "Choice of 1×A3, 2×A4, 4×A5, or 1×A4 + 2×A5 free bonus prints.",
      icon: Gift,
      color: "#D4AF37",
      tag: "Most Popular"
    },
    {
      tier: "Premium Tier",
      threshold: premiumRewardThreshold,
      title: "2 × FREE Collector Rewards",
      desc: "Unlock double reward print choices + priority studio handling.",
      icon: Trophy,
      color: "#EC4899",
      tag: "Ultimate Value"
    }
  ];

  return (
    <section style={{ padding: "8rem 0", backgroundColor: "#0A0A0C", position: "relative" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "4.5rem" }}
        >
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#D4AF37", fontWeight: "700" }}>
            Value-Based Rewards Engine
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: "900", color: "#FAFAFA", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>
            Collector Rewards Program
          </h2>
          <p style={{ color: "#A1A1AA", maxWidth: "56ch", margin: "0.75rem auto 0 auto", fontSize: "1rem", lineHeight: "1.6" }}>
            Spend more, collect more. Mix any film title with any poster size — rewards unlock automatically at checkout.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }} className="rewards-grid">
          {rewardTiers.map((t, idx) => {
            const IconComp = t.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(25px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "28px",
                  padding: "2.5rem 2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, padding: "0.75rem 1.25rem", backgroundColor: `${t.color}22`, borderBottomLeftRadius: "16px", borderLeft: `1px solid ${t.color}44`, borderBottom: `1px solid ${t.color}44` }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: "800", color: t.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {t.tag}
                  </span>
                </div>

                <div>
                  <div style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: `${t.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", border: `1px solid ${t.color}33` }}>
                    <IconComp size={24} style={{ color: t.color }} />
                  </div>

                  <span style={{ fontSize: "0.8rem", color: "#A1A1AA", fontWeight: "700" }}>
                    SPEND ₹{t.threshold}+
                  </span>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#FAFAFA", marginTop: "0.25rem", lineHeight: "1.2" }}>
                    {t.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#A1A1AA", marginTop: "0.75rem", lineHeight: "1.6" }}>
                    {t.desc}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.25rem", marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Sparkles size={14} style={{ color: t.color }} />
                  <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#FAFAFA" }}>
                    Mix Any Movie. Mix Any Size.
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .rewards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
