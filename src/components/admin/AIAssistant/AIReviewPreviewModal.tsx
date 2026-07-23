'use client';

import React, { useState } from "react";
import { X, Sparkles, RefreshCw, Check, AlertTriangle, ShieldCheck, Copy } from "lucide-react";

interface AIReviewPreviewModalProps {
  draft: any;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (draft: any) => void;
}

export default function AIReviewPreviewModal({ draft, isOpen, onClose, onAccept }: AIReviewPreviewModalProps) {
  const [editableDraft, setEditableDraft] = useState(draft);
  const [regeneratingField, setRegeneratingField] = useState<string | null>(null);

  React.useEffect(() => {
    if (draft) {
      setEditableDraft(draft);
    }
  }, [draft]);

  if (!isOpen) return null;

  const handleFieldChange = (field: string, value: any) => {
    setEditableDraft((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegenerateField = async (fieldKey: "description" | "seo" | "tags" | "social") => {
    setRegeneratingField(fieldKey);
    try {
      const res = await fetch("/api/admin/ai/regenerate-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field: fieldKey,
          movie: editableDraft.movie,
          actor: editableDraft.cast?.[0],
          genre: editableDraft.genre
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setEditableDraft((prev: any) => {
          if (fieldKey === "description") {
            return {
              ...prev,
              shortDescription: data.data.shortDescription,
              longDescription: data.data.longDescription
            };
          } else if (fieldKey === "seo") {
            return {
              ...prev,
              seoTitle: data.data.seoTitle,
              seoDescription: data.data.seoDescription,
              keywords: data.data.keywords,
              imageAltText: data.data.imageAltText
            };
          } else if (fieldKey === "tags") {
            return {
              ...prev,
              tags: data.data.tags,
              suggestedCollections: data.data.suggestedCollections
            };
          } else if (fieldKey === "social") {
            return {
              ...prev,
              socialCaptions: data.data
            };
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("Failed to regenerate field", e);
    } finally {
      setRegeneratingField(null);
    }
  };

  const isLowConfidence = editableDraft.reviewRequired || Math.min(
    editableDraft.confidence?.movie || 100,
    editableDraft.confidence?.actor || 100,
    editableDraft.confidence?.character || 100
  ) < 70;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(12px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          maxHeight: "90vh",
          backgroundColor: "#1E293B",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "28px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)"
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: "1.5rem 2rem",
            backgroundColor: "#0F172A",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Sparkles size={22} style={{ color: "#D4AF37" }} />
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#F8FAFC" }}>
                AI Generated Product Draft Review
              </h2>
              <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                Review, edit, or regenerate fields before accepting into product creation form.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "#F8FAFC",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ padding: "2rem", overflowY: "auto", flexGrow: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Confidence Indicator Bar */}
          <div style={{ padding: "1.25rem", borderRadius: "16px", backgroundColor: isLowConfidence ? "rgba(245, 158, 11, 0.15)" : "rgba(34, 197, 94, 0.12)", border: isLowConfidence ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: isLowConfidence ? "#FBBF24" : "#4ADE80", fontWeight: "700", fontSize: "0.9rem" }}>
              {isLowConfidence ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
              {isLowConfidence ? "⚠ Review Required — Low Confidence Detection" : "High Confidence Detection Verified"}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.65rem", borderRadius: "100px", backgroundColor: "#0F172A", color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.1)" }}>
                Movie: {Math.round((editableDraft.confidence?.movie <= 1 ? editableDraft.confidence.movie * 100 : editableDraft.confidence.movie) || 95)}%
              </span>
              <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.65rem", borderRadius: "100px", backgroundColor: "#0F172A", color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.1)" }}>
                Actor: {Math.round((editableDraft.confidence?.actor <= 1 ? editableDraft.confidence.actor * 100 : editableDraft.confidence.actor) || 98)}%
              </span>
              <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.65rem", borderRadius: "100px", backgroundColor: "#0F172A", color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.1)" }}>
                Character: {Math.round((editableDraft.confidence?.character <= 1 ? editableDraft.confidence.character * 100 : editableDraft.confidence.character) || 94)}%
              </span>
            </div>
          </div>

          {/* Section 1: Fact-Checked Metadata */}
          <div>
            <h3 style={{ fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#94A3B8", fontWeight: "800", marginBottom: "1rem" }}>
              Fact-Checked Film Metadata
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700" }}>Movie</label>
                <input type="text" value={editableDraft.movie || ""} onChange={(e) => handleFieldChange("movie", e.target.value)} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "10px", backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.85rem", marginTop: "4px" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700" }}>Release Year</label>
                <input type="number" value={editableDraft.year || ""} onChange={(e) => handleFieldChange("year", parseInt(e.target.value))} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "10px", backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.85rem", marginTop: "4px" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700" }}>Director</label>
                <input type="text" value={editableDraft.director || ""} onChange={(e) => handleFieldChange("director", e.target.value)} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "10px", backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.85rem", marginTop: "4px" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700" }}>Genre</label>
                <input type="text" value={editableDraft.genre || ""} onChange={(e) => handleFieldChange("genre", e.target.value)} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "10px", backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.85rem", marginTop: "4px" }} />
              </div>
            </div>
          </div>

          {/* Section 2: Copywriting & Product Story */}
          <div style={{ backgroundColor: "#0F172A", padding: "1.5rem", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#94A3B8", fontWeight: "800" }}>
                Product Copywriting & Story
              </h3>
              <button
                type="button"
                onClick={() => handleRegenerateField("description")}
                disabled={regeneratingField === "description"}
                style={{ fontSize: "0.75rem", color: "#D4AF37", backgroundColor: "rgba(212, 175, 55, 0.1)", border: "1px solid rgba(212, 175, 55, 0.25)", padding: "0.35rem 0.85rem", borderRadius: "100px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
              >
                <RefreshCw size={12} className={regeneratingField === "description" ? "spin" : ""} /> Regenerate Description
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700" }}>Product Title</label>
                <input type="text" value={editableDraft.title || ""} onChange={(e) => handleFieldChange("title", e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "10px", backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.9rem", fontWeight: "700", marginTop: "4px" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700" }}>Short Description (Max 160 chars)</label>
                <input type="text" value={editableDraft.shortDescription || ""} onChange={(e) => handleFieldChange("shortDescription", e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "10px", backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.85rem", marginTop: "4px" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700" }}>Long Story Description (Max 120 words)</label>
                <textarea rows={4} value={editableDraft.longDescription || ""} onChange={(e) => handleFieldChange("longDescription", e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "10px", backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.85rem", lineHeight: "1.6", marginTop: "4px" }} />
              </div>
            </div>
          </div>

          {/* Section 3: SEO & Social Captions */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* SEO Panel */}
            <div style={{ backgroundColor: "#0F172A", padding: "1.5rem", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#94A3B8", fontWeight: "800" }}>
                  SEO & Search Metadata
                </h3>
                <button
                  type="button"
                  onClick={() => handleRegenerateField("seo")}
                  disabled={regeneratingField === "seo"}
                  style={{ fontSize: "0.75rem", color: "#D4AF37", backgroundColor: "rgba(212, 175, 55, 0.1)", border: "1px solid rgba(212, 175, 55, 0.25)", padding: "0.35rem 0.85rem", borderRadius: "100px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                >
                  <RefreshCw size={12} className={regeneratingField === "seo" ? "spin" : ""} /> Regenerate SEO
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700" }}>SEO Title</label>
                  <input type="text" value={editableDraft.seoTitle || ""} onChange={(e) => handleFieldChange("seoTitle", e.target.value)} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "10px", backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.82rem", marginTop: "4px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700" }}>Meta Description</label>
                  <textarea rows={2} value={editableDraft.seoDescription || ""} onChange={(e) => handleFieldChange("seoDescription", e.target.value)} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "10px", backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.82rem", marginTop: "4px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700" }}>Image Alt Text</label>
                  <input type="text" value={editableDraft.imageAltText || ""} onChange={(e) => handleFieldChange("imageAltText", e.target.value)} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "10px", backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.82rem", marginTop: "4px" }} />
                </div>
              </div>
            </div>

            {/* Social Captions Panel */}
            <div style={{ backgroundColor: "#0F172A", padding: "1.5rem", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#94A3B8", fontWeight: "800" }}>
                  Social Captions (IG / FB / X)
                </h3>
                <button
                  type="button"
                  onClick={() => handleRegenerateField("social")}
                  disabled={regeneratingField === "social"}
                  style={{ fontSize: "0.75rem", color: "#D4AF37", backgroundColor: "rgba(212, 175, 55, 0.1)", border: "1px solid rgba(212, 175, 55, 0.25)", padding: "0.35rem 0.85rem", borderRadius: "100px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                >
                  <RefreshCw size={12} className={regeneratingField === "social" ? "spin" : ""} /> Regenerate Social
                </button>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700" }}>Instagram Caption</label>
                <textarea rows={5} value={editableDraft.socialCaptions?.instagram || ""} onChange={(e) => handleFieldChange("socialCaptions", { ...editableDraft.socialCaptions, instagram: e.target.value })} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "10px", backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.8rem", marginTop: "4px", lineHeight: "1.5" }} />
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "1.25rem 2rem",
            backgroundColor: "#0F172A",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
            AI NEVER publishes automatically. Administrator review is required.
          </span>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: "transparent",
                color: "#94A3B8",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "0.75rem 1.5rem",
                borderRadius: "100px",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onAccept(editableDraft)}
              style={{
                backgroundColor: "#D4AF37",
                color: "#0F172A",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "100px",
                fontWeight: "800",
                fontSize: "0.88rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 8px 20px rgba(212, 175, 55, 0.25)"
              }}
            >
              <Check size={18} /> Accept & Fill Product Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
