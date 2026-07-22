'use client';

import React, { useState } from "react";
import { X, Gift, Check, Trophy, Sparkles } from "lucide-react";
import { REWARD_OPTIONS_LIST, RewardTierStatus } from "@/services/promotionEngine";

interface RewardSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardStatus: RewardTierStatus;
  selectedRewards: string[]; // Array of selected reward option IDs (length 1 or 2)
  onSaveRewards: (rewards: string[]) => void;
}

export const RewardSelectorModal: React.FC<RewardSelectorModalProps> = ({
  isOpen,
  onClose,
  rewardStatus,
  selectedRewards,
  onSaveRewards
}) => {
  const maxSelections = rewardStatus.unlockedRewardCount; // 1 or 2
  const [currentChoices, setCurrentChoices] = useState<string[]>(
    selectedRewards.length > 0 ? selectedRewards : ["1xA3"]
  );

  if (!isOpen || maxSelections <= 0) return null;

  const toggleOption = (id: string) => {
    if (maxSelections === 1) {
      setCurrentChoices([id]);
    } else {
      // 2 selections max
      if (currentChoices.includes(id)) {
        if (currentChoices.length > 1) {
          setCurrentChoices(currentChoices.filter(x => x !== id));
        }
      } else {
        if (currentChoices.length < 2) {
          setCurrentChoices([...currentChoices, id]);
        } else {
          // Replace second choice
          setCurrentChoices([currentChoices[0], id]);
        }
      }
    }
  };

  const handleConfirm = () => {
    onSaveRewards(currentChoices);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem"
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FAFAF8",
          color: "#111111",
          borderRadius: "28px",
          width: "100%",
          maxWidth: "600px",
          padding: "2.25rem",
          position: "relative",
          boxShadow: "0 30px 90px rgba(0,0,0,0.4)",
          border: "1px solid rgba(17,17,17,0.12)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            backgroundColor: "#EFECE6",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.15em", color: "#D97706", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Gift size={16} /> Unlocked Collector Reward
          </span>
          <h3 style={{ fontSize: "1.75rem", fontWeight: "800", letterSpacing: "-0.02em", marginTop: "0.25rem" }}>
            {maxSelections === 2 ? "Select Your 2 Free Collector Rewards" : "Choose Your Free Collector Reward"}
          </h3>
          <p style={{ color: "#666666", fontSize: "0.88rem", marginTop: "0.25rem" }}>
            {maxSelections === 2 
              ? "Your order qualified for Premium Status! Pick any two reward combinations below."
              : "Your order reached ₹899+! Pick your free collector print reward combination below."}
          </p>
        </div>

        {/* Option Selection List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>
          {REWARD_OPTIONS_LIST.map((opt) => {
            const isSelected = currentChoices.includes(opt.id);
            return (
              <div
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                style={{
                  backgroundColor: isSelected ? "#FFFFFF" : "#FAFAF8",
                  padding: "1rem 1.25rem",
                  borderRadius: "16px",
                  border: isSelected ? "2.5px solid #111111" : "1.5px solid rgba(17,17,17,0.12)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease"
                }}
              >
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: "800", margin: 0 }}>{opt.label}</h4>
                  <p style={{ fontSize: "0.8rem", color: "#666666", margin: "2px 0 0 0" }}>{opt.description}</p>
                </div>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: isSelected ? "#111111" : "transparent",
                    border: isSelected ? "none" : "2px solid rgba(17,17,17,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    flexShrink: 0
                  }}
                >
                  {isSelected && <Check size={14} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirm Selection CTA */}
        <button
          onClick={handleConfirm}
          style={{
            width: "100%",
            backgroundColor: "#111111",
            color: "#FFFFFF",
            padding: "0.85rem",
            borderRadius: "100px",
            fontSize: "0.95rem",
            fontWeight: "700",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem"
          }}
        >
          <Sparkles size={16} /> Confirm Choice ({currentChoices.length}/{maxSelections})
        </button>
      </div>
    </div>
  );
};
export default RewardSelectorModal;
