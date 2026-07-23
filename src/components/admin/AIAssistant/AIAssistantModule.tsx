'use client';

import React, { useState } from "react";
import { Sparkles, Loader2, AlertTriangle, CheckCircle, RefreshCw, Eye } from "lucide-react";
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
  const [isTestingVision, setIsTestingVision] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draftResult, setDraftResult] = useState<any | null>(null);
  const [visionDiagnostic, setVisionDiagnostic] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTestVision = async () => {
    if (!imageUrl || imageUrl.trim() === "") {
      setErrorMessage("Please upload a poster before testing Vision.");
      return;
    }

    setIsTestingVision(true);
    setVisionDiagnostic(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/ai/vision-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl })
      });

      const data = await res.json();
      if (res.ok && data.success && data.vision) {
        setVisionDiagnostic(data.vision);
      } else {
        setErrorMessage(data.error || "Vision analysis test failed.");
      }
    } catch (err: any) {
      setErrorMessage("Vision analysis test failed.");
    } finally {
      setIsTestingVision(false);
    }
  };

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

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={handleTestVision}
            disabled={isTestingVision || isGenerating || !imageUrl}
            title="Fast Vision-Only Pre-flight Inspection"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: !imageUrl ? "#64748B" : "#F8FAFC",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontWeight: "700",
              fontSize: "0.85rem",
              padding: "0.85rem 1.25rem",
              borderRadius: "100px",
              cursor: !imageUrl ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            {isTestingVision ? <Loader2 size={16} className="spin" /> : <Eye size={16} />} Test Vision
          </button>

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
      </div>

      {/* Upload Required Banner */}
      {!imageUrl && !errorMessage && (
        <div style={{ marginTop: "1rem", padding: "0.75rem 1.25rem", backgroundColor: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.25)", borderRadius: "12px", color: "#FDE047", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <AlertTriangle size={16} />
          <span>Upload a poster image below to enable <strong>✨ Generate with AI</strong> and <strong>Test Vision</strong>.</span>
        </div>
      )}

      {/* Live Vision Diagnostic Pre-Flight Card */}
      {visionDiagnostic && (
        <div style={{ marginTop: "1.25rem", padding: "1.25rem", backgroundColor: "#0F172A", border: "1px solid rgba(16, 185, 129, 0.35)", borderRadius: "14px", color: "#F8FAFC" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#10B981", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CheckCircle size={16} /> Vision Analysis Pre-Flight Results
            </div>
            <span style={{ fontSize: "0.7rem", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "0.15rem 0.5rem", borderRadius: "100px", fontWeight: "700" }}>
              Provider: {visionDiagnostic.provider}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", fontSize: "0.8rem" }}>
            <div style={{ backgroundColor: "#1E293B", padding: "0.6rem 0.8rem", borderRadius: "8px" }}>
              <span style={{ color: "#94A3B8", display: "block", fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700" }}>Detected Movie</span>
              <strong style={{ color: visionDiagnostic.movie ? "#F8FAFC" : "#F87171", fontSize: "0.9rem" }}>{visionDiagnostic.movie || "Unknown"}</strong>
            </div>
            <div style={{ backgroundColor: "#1E293B", padding: "0.6rem 0.8rem", borderRadius: "8px" }}>
              <span style={{ color: "#94A3B8", display: "block", fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700" }}>Actor</span>
              <strong style={{ fontSize: "0.9rem" }}>{visionDiagnostic.actor || "None"}</strong>
            </div>
            <div style={{ backgroundColor: "#1E293B", padding: "0.6rem 0.8rem", borderRadius: "8px" }}>
              <span style={{ color: "#94A3B8", display: "block", fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700" }}>Character</span>
              <strong style={{ fontSize: "0.9rem" }}>{visionDiagnostic.character || "None"}</strong>
            </div>
            <div style={{ backgroundColor: "#1E293B", padding: "0.6rem 0.8rem", borderRadius: "8px" }}>
              <span style={{ color: "#94A3B8", display: "block", fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700" }}>Confidence</span>
              <strong style={{ color: (visionDiagnostic.confidence?.movie || 0) >= 0.7 ? "#10B981" : "#FBBF24", fontSize: "0.9rem" }}>
                {Math.round((visionDiagnostic.confidence?.movie || 0) * 100)}%
              </strong>
            </div>
          </div>

          {visionDiagnostic.visibleText?.length > 0 && (
            <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#CBD5E1", display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
              <span style={{ color: "#94A3B8", fontWeight: "700" }}>OCR Text:</span>
              {visionDiagnostic.visibleText.map((t: string, i: number) => (
                <span key={i} style={{ backgroundColor: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.72rem" }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {visionDiagnostic.alternatives?.length > 0 && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#CBD5E1", display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
              <span style={{ color: "#D4AF37", fontWeight: "700" }}>Candidates:</span>
              {visionDiagnostic.alternatives.map((alt: string, i: number) => (
                <span key={i} style={{ backgroundColor: "rgba(212, 175, 55, 0.15)", color: "#D4AF37", padding: "2px 8px", borderRadius: "100px", border: "1px solid rgba(212, 175, 55, 0.3)", fontSize: "0.72rem", fontWeight: "700" }}>
                  {alt}
                </span>
              ))}
            </div>
          )}
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
    </div>
  );
}
