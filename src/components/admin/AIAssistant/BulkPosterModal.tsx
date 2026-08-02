"use client";

import React, { useState } from "react";
import Image from "next/image";
import { saveProductAction, ProductInput } from "@/features/admin/businessActions";
import {
  Sparkles,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileImage,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface BulkItemDraft {
  id: string;
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
  status: "PENDING" | "UPLOADING" | "ANALYZING" | "READY" | "SAVED" | "ERROR";
  statusText: string;
  progress: number;
  analysis?: any;

  // Editable Form Fields
  title: string;
  film: string;
  year: number;
  director: string;
  cast: string[];
  collectionName: string;
  subCollectionId?: string;
  genre: string;
  price: number;
  inventory: number;
  story: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  isDuplicate?: boolean;
  duplicateWarning?: string;
  qualityWarnings?: string[];
  isExpanded?: boolean;
}

export default function BulkPosterModal({
  isOpen,
  onClose,
  collections = [],
  onComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  collections: any[];
  onComplete: () => void;
}) {
  const [drafts, setDrafts] = useState<BulkItemDraft[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newDrafts: BulkItemDraft[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      status: "PENDING",
      statusText: "Queued for analysis",
      progress: 0,
      title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "),
      film: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "),
      year: 2024,
      director: "Polacraft Studio",
      cast: ["Mohanlal"],
      collectionName: collections[0]?.name || "Classic Malayalam",
      genre: "Drama",
      price: 49,
      inventory: 25,
      story: "Archival fine art poster print.",
      tagline: "Handcrafted Archival Cinema Print",
      seoTitle: "",
      seoDescription: "",
      isExpanded: false,
    }));

    setDrafts((prev) => [...prev, ...newDrafts]);
  };

  const removeDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleExpand = (id: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isExpanded: !d.isExpanded } : d))
    );
  };

  const updateDraftField = (id: string, field: string, val: any) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: val } : d))
    );
  };

  const processBatchAIAnalysis = async () => {
    setIsProcessing(true);

    for (let i = 0; i < drafts.length; i++) {
      const draft = drafts[i];
      if (draft.status === "READY" || draft.status === "SAVED") continue;

      // Step 1: Upload image
      updateDraftField(draft.id, "status", "UPLOADING");
      updateDraftField(draft.id, "statusText", "Uploading poster image...");
      updateDraftField(draft.id, "progress", 25);

      let uploadedUrl = draft.previewUrl;
      try {
        const formData = new FormData();
        formData.append("file", draft.file);
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedUrl = uploadData.url || uploadedUrl;
          updateDraftField(draft.id, "uploadedUrl", uploadedUrl);
        }
      } catch (e) {
        console.warn("[Bulk Upload Warning]:", e);
      }

      // Step 2: Vision AI Analysis
      updateDraftField(draft.id, "status", "ANALYZING");
      updateDraftField(draft.id, "statusText", "Analyzing with Vision AI & OCR...");
      updateDraftField(draft.id, "progress", 65);

      try {
        const aiRes = await fetch("/api/admin/ai/vision-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadedUrl }),
        });

        if (aiRes.ok) {
          const { analysis } = await aiRes.json();
          if (analysis) {
            setDrafts((prev) =>
              prev.map((d) => {
                if (d.id !== draft.id) return d;
                return {
                  ...d,
                  analysis,
                  status: "READY",
                  statusText: "Analysis Complete",
                  progress: 100,
                  title: analysis.title || d.title,
                  film: analysis.film || d.film,
                  year: analysis.year || d.year,
                  director: analysis.director || d.director,
                  cast: analysis.cast || d.cast,
                  collectionName: analysis.collectionName || d.collectionName,
                  subCollectionId: analysis.subCollectionId,
                  genre: analysis.genre || d.genre,
                  story: analysis.story || d.story,
                  tagline: analysis.tagline || d.tagline,
                  seoTitle: analysis.seoTitle || "",
                  seoDescription: analysis.seoDescription || "",
                  isDuplicate: analysis.isDuplicate,
                  duplicateWarning: analysis.duplicateWarning,
                  qualityWarnings: analysis.quality?.warnings,
                };
              })
            );
          }
        } else {
          updateDraftField(draft.id, "status", "READY");
          updateDraftField(draft.id, "statusText", "Basic Ingestion Ready");
          updateDraftField(draft.id, "progress", 100);
        }
      } catch (err) {
        updateDraftField(draft.id, "status", "READY");
        updateDraftField(draft.id, "statusText", "Ready for Approval");
        updateDraftField(draft.id, "progress", 100);
      }
    }

    setIsProcessing(false);
  };

  const handleSaveAllReady = async () => {
    const readyDrafts = drafts.filter((d) => d.status === "READY");
    if (readyDrafts.length === 0) return;

    setIsProcessing(true);

    for (const draft of readyDrafts) {
      const payload: ProductInput = {
        title: draft.title,
        slug: draft.film.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        film: draft.film,
        year: draft.year,
        director: draft.director,
        collectionName: draft.collectionName,
        subCollectionId: draft.subCollectionId || null,
        genre: draft.genre,
        price: draft.price,
        inventory: draft.inventory,
        tagline: draft.tagline,
        story: draft.story,
        images: [
          {
            url: draft.uploadedUrl || draft.previewUrl,
            alt: draft.title,
            type: "HERO",
            sortOrder: 0,
          },
        ],
      };

      const res = await saveProductAction(payload);
      if (res.success) {
        updateDraftField(draft.id, "status", "SAVED");
        updateDraftField(draft.id, "statusText", "Saved to Catalog");
      }
    }

    setIsProcessing(false);
    onComplete();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFF",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "960px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "1.25rem 1.75rem",
            borderBottom: "1px solid #F1F5F9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#0F172A",
            color: "#FFF",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Sparkles size={22} style={{ color: "#10B981" }} />
            <div>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900" }}>
                AI-Powered Bulk Poster Ingestion
              </h2>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#94A3B8" }}>
                Upload multiple posters. Vision AI extracts metadata, auto-fills fields, & flags duplicates.
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flexGrow: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* File Upload Trigger Dropzone */}
          <div
            style={{
              border: "2px dashed #CBD5E1",
              borderRadius: "16px",
              padding: "2rem",
              textAlign: "center",
              backgroundColor: "#F8FAFC",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("bulk-file-input")?.click()}
          >
            <Upload size={32} style={{ color: "#10B981", marginBottom: "0.5rem" }} />
            <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 0.25rem 0", color: "#0F172A" }}>
              Drop poster files here or click to select
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#64748B", margin: 0 }}>
              Supports JPG, PNG, WEBP files up to 20MB each.
            </p>
            <input
              id="bulk-file-input"
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
          </div>

          {/* Action Toolbar */}
          {drafts.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ECFDF5", padding: "0.85rem 1.25rem", borderRadius: "12px", border: "1px solid #A7F3D0" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#065F46" }}>
                {drafts.length} Posters Queued ({drafts.filter((d) => d.status === "READY").length} Ready for Approval)
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={processBatchAIAnalysis}
                  disabled={isProcessing}
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    padding: "0.55rem 1.1rem",
                    borderRadius: "100px",
                    border: "none",
                    backgroundColor: "#10B981",
                    color: "#FFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Analyze All with Vision AI
                </button>

                <button
                  type="button"
                  onClick={handleSaveAllReady}
                  disabled={isProcessing || drafts.filter((d) => d.status === "READY").length === 0}
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    padding: "0.55rem 1.1rem",
                    borderRadius: "100px",
                    border: "none",
                    backgroundColor: "#0F172A",
                    color: "#FFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <CheckCircle2 size={14} style={{ color: "#10B981" }} /> Approve & Save All
                </button>
              </div>
            </div>
          )}

          {/* Drafts List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {drafts.map((draft) => (
              <div
                key={draft.id}
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: "16px",
                  border: draft.isDuplicate ? "1.5px solid #F87171" : "1px solid #E2E8F0",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                {/* Accordion Item Header */}
                <div style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexGrow: 1, minWidth: 0 }}>
                    <div style={{ width: "44px", height: "56px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#F1F5F9", flexShrink: 0, position: "relative" }}>
                      <Image src={draft.previewUrl} alt={draft.title} width={44} height={56} unoptimized style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#0F172A", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {draft.title}
                        </h4>
                        {draft.status === "READY" && (
                          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#059669", backgroundColor: "#D1FAE5", padding: "0.15rem 0.5rem", borderRadius: "100px" }}>
                            Vision AI Ready
                          </span>
                        )}
                        {draft.status === "SAVED" && (
                          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#2563EB", backgroundColor: "#DBEAFE", padding: "0.15rem 0.5rem", borderRadius: "100px" }}>
                            Saved
                          </span>
                        )}
                      </div>

                      <span style={{ fontSize: "0.75rem", color: "#64748B", display: "block", marginTop: "2px" }}>
                        {draft.film} ({draft.year}) • {draft.collectionName} • Status: {draft.statusText}
                      </span>

                      {/* Duplicate Warning */}
                      {draft.isDuplicate && (
                        <div style={{ fontSize: "0.75rem", color: "#DC2626", fontWeight: 700, marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <AlertTriangle size={12} /> {draft.duplicateWarning}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => toggleExpand(draft.id)}
                      style={{ border: "1px solid #E2E8F0", background: "#FFF", borderRadius: "8px", padding: "0.35rem 0.6rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      {draft.isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Edit Fields
                    </button>

                    <button
                      type="button"
                      onClick={() => removeDraft(draft.id)}
                      style={{ border: "none", background: "none", color: "#EF4444", cursor: "pointer", padding: "0.35rem" }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Expanded Editable Fields Panel */}
                {draft.isExpanded && (
                  <div style={{ padding: "1.25rem", backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Title</label>
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(e) => updateDraftField(draft.id, "title", e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Movie / Series</label>
                      <input
                        type="text"
                        value={draft.film}
                        onChange={(e) => updateDraftField(draft.id, "film", e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Release Year</label>
                      <input
                        type="number"
                        value={draft.year}
                        onChange={(e) => updateDraftField(draft.id, "year", Number(e.target.value))}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Director</label>
                      <input
                        type="text"
                        value={draft.director}
                        onChange={(e) => updateDraftField(draft.id, "director", e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Collection</label>
                      <select
                        value={draft.collectionName}
                        onChange={(e) => updateDraftField(draft.id, "collectionName", e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}
                      >
                        {collections.map((c) => (
                          <option key={c.id || c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Price (₹)</label>
                      <input
                        type="number"
                        value={draft.price}
                        onChange={(e) => updateDraftField(draft.id, "price", Number(e.target.value))}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: "1rem 1.75rem", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "0.65rem 1.25rem", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#FFF", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
