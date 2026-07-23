'use client';

import React, { useState } from "react";
import { Sparkles, Loader2, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import AIReviewPreviewModal from "./AIReviewPreviewModal";

interface AIAssistantModuleProps {
  imageUrl: string;
  onApplyAIDraft: (draft: any) => void;
}

const STAGES = [
  "Analyzing Poster...",
  "Recognizing Movie...",
  "Fetching Metadata...",
  "Generating Description...",
  "Optimizing SEO...",
  "Done"
];

export default function AIAssistantModule({ imageUrl, onApplyAIDraft }: AIAssistantModuleProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draftResult, setDraftResult] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartAIGeneration = async () => {
    if (!imageUrl || imageUrl.trim() === "") {
      setErrorMessage("Please upload a poster before generating AI.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setCurrentStageIndex(0);

    // Step-by-step UI loading stage sequence
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 2) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      const res = await fetch("/api/admin/ai/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl })
      });

      clearInterval(interval);
      setCurrentStageIndex(STAGES.length - 1);

      const data = await res.json();

      if (res.ok && data.success && data.draft) {
        setDraftResult(data.draft);
        setIsModalOpen(true);
      } else {
        setErrorMessage(data.error || "Generation Failed. Please review manually.");
      }
    } catch (err: any) {
      clearInterval(interval);
      setErrorMessage("Generation Failed. Please review manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#1E293B",
        border: "1px solid rgba(212, 175, 55, 0.3)",
        borderRadius: "20px",
        padding: "1.75rem",
        marginBottom: "2rem",
        boxShadow: "0 15px 35px rgba(0,0,0,0.3)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              backgroundColor: "rgba(212, 175, 55, 0.15)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D4AF37"
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#F8FAFC", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              ✨ AI Product Assistant
              <span style={{ fontSize: "0.7rem", backgroundColor: "rgba(212, 175, 55, 0.2)", color: "#D4AF37", padding: "0.2rem 0.6rem", borderRadius: "100px" }}>
                Polacraft v1.2
              </span>
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "2px" }}>
              Upload poster image to auto-detect film metadata, write 300 GSM product stories, and generate SEO tags.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartAIGeneration}
          disabled={isGenerating || !imageUrl}
          style={{
            backgroundColor: isGenerating || !imageUrl ? "#334155" : "#D4AF37",
            color: isGenerating || !imageUrl ? "#94A3B8" : "#0F172A",
            fontWeight: "800",
            fontSize: "0.9rem",
            padding: "0.85rem 1.6rem",
            borderRadius: "100px",
            border: "none",
            cursor: isGenerating || !imageUrl ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: isGenerating || !imageUrl ? "none" : "0 8px 20px rgba(212, 175, 55, 0.25)"
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} /> Generate with AI
            </>
          )}
        </button>
      </div>

      {/* Upload Required Banner */}
      {!imageUrl && !errorMessage && (
        <div style={{ marginTop: "1rem", padding: "0.75rem 1.25rem", backgroundColor: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.25)", borderRadius: "12px", color: "#FDE047", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <AlertTriangle size={16} />
          <span>Upload a poster image below to enable <strong>✨ Generate with AI</strong>.</span>
        </div>
      )}

      {/* Loading Experience Multi-Stage Progress */}
      {isGenerating && (
        <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.82rem", color: "#CBD5E1", fontWeight: "600" }}>
            <span>{STAGES[currentStageIndex]}</span>
            <span>{Math.round(((currentStageIndex + 1) / STAGES.length) * 100)}%</span>
          </div>
          <div style={{ width: "100%", height: "6px", backgroundColor: "#334155", borderRadius: "100px", overflow: "hidden" }}>
            <div
              style={{
                width: `${((currentStageIndex + 1) / STAGES.length) * 100}%`,
                height: "100%",
                backgroundColor: "#D4AF37",
                transition: "width 0.4s ease"
              }}
            />
          </div>
        </div>
      )}

      {/* Error / Warning Alert */}
      {errorMessage && (
        <div style={{ marginTop: "1.25rem", padding: "0.85rem 1.25rem", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "12px", color: "#FCA5A5", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <AlertTriangle size={16} />
          <div>
            <strong>Generation Issue:</strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Review Modal Trigger */}
      {draftResult && isModalOpen && (
        <AIReviewPreviewModal
          draft={draftResult}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAccept={(acceptedDraft) => {
            onApplyAIDraft(acceptedDraft);
            setIsModalOpen(false);
          }}
        />
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
