"use client";

import React, { useState, useTransition } from "react";
import { bulkSaveProductsAction, ProductInput } from "@/features/admin/businessActions";
import { Sparkles, Layers, UploadCloud, CheckCircle2, Loader2, X, Trash2, Film, User, Tag } from "lucide-react";

interface BulkPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkPosterModal({ isOpen, onClose, onSuccess }: BulkPosterModalProps) {
  const [activeTab, setActiveTab] = useState<"COLLECTION" | "BATCH_UPLOAD">("COLLECTION");
  const [isPending, startTransition] = useTransition();

  // Mode 1: Collection Suite Generator State
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(5);
  const [collectionName, setCollectionName] = useState("Classic Malayalam");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDrafts, setGeneratedDrafts] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mode 2: Batch File Upload State
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  const [batchDrafts, setBatchDrafts] = useState<any[]>([]);

  if (!isOpen) return null;

  // Generate Collection Suite via AI API
  const handleGenerateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setErrorMessage("Please enter a movie or actor name.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/ai/bulk-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), count, collectionName }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.drafts) {
        setGeneratedDrafts(data.drafts);
      } else {
        setErrorMessage(data.error || "Failed to generate collection suite.");
      }
    } catch (err: any) {
      setErrorMessage("Failed to execute bulk AI generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Batch File Upload to Cloudinary & Vision API
  const handleBatchImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    setErrorMessage(null);

    const newDrafts: any[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) continue;
        const uploadData = await uploadRes.json();
        const secureUrl = uploadData.secure_url;
        const publicId = uploadData.public_id;

        // Clean original filename as local fallback hint (e.g. "Nipo Movie.png" -> "Nipo Movie")
        const rawFileName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]v?\d{8,}/gi, "").replace(/[-_]/g, " ").trim();
        const fallbackFilm = rawFileName
          ? rawFileName.split(" ").filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
          : "Archival Cinema Print";
        const fallbackTitle = `${fallbackFilm} Premium Poster`;

        // Run full AI draft generation for this poster passing originalFilename
        const aiRes = await fetch("/api/admin/ai/generate-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: secureUrl,
            originalFilename: file.name,
            options: { originalFilename: file.name }
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          if (aiData.success && aiData.draft) {
            const d = aiData.draft;
            const isGenericMovie = !d.movie || d.movie === "Unknown Artwork";
            const filmName = !isGenericMovie ? d.movie : fallbackFilm;

            const isGenericTitle = !d.title || d.title.toLowerCase().includes("archival fine art print") || d.title.toLowerCase().includes("unknown artwork");
            const finalTitle = !isGenericTitle ? d.title : fallbackTitle;

            const uniqueSlug = filmName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36) + "-" + i;

            newDrafts.push({
              title: finalTitle,
              slug: uniqueSlug,
              film: filmName,
              year: d.year || 2020,
              director: d.director || "Polacraft Studio",
              cast: d.cast || [],
              collectionName: d.suggestedCollections?.[0] || "Classic Malayalam",
              genre: d.genre || "Drama",
              price: 49,
              inventory: 25,
              tagline: d.tagline || `Handcrafted Archival Print celebrating ${filmName}`,
              story: d.longDescription || d.shortDescription || "",
              designNotes: d.designNotes || "",
              images: [{ url: secureUrl, publicId, alt: finalTitle, type: "HERO", sortOrder: 0 }],
            });
          }
        }
      }

      setBatchDrafts((prev) => [...prev, ...newDrafts]);
    } catch (err: any) {
      setErrorMessage("Batch image processing encountered an error.");
    } finally {
      setUploadingFiles(false);
    }
  };

  // One-Click Bulk Save to Database
  const handlePublishAll = (draftList: any[]) => {
    if (draftList.length === 0) return;

    startTransition(async () => {
      const inputs: ProductInput[] = draftList.map((d) => ({
        title: d.title,
        slug: d.slug || d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        film: d.film,
        year: d.year || 2020,
        director: d.director || "Polacraft Studio",
        collectionName: d.collectionName || "Classic Malayalam",
        genre: d.genre || "Drama",
        price: d.price || 49,
        inventory: d.inventory || 25,
        tagline: d.tagline || "",
        story: d.story || "",
        designNotes: d.designNotes || "",
        primaryColor: d.primaryColor || "#1E293B",
        accentColor: d.accentColor || "#E2E8F0",
        bgColor: d.bgColor || "#FAFAF8",
        textColor: d.textColor || "#0F172A",
        gsm: d.gsm || 300,
        finish: d.finish || "Ultra-Matte Giclée",
        paperType: d.paperType || "Fine Art Cotton Archival",
        images: d.images || [],
      }));

      const res = await bulkSaveProductsAction(inputs);

      if (res.success) {
        alert(`Success! Successfully created and published ${res.count} poster products.`);
        setGeneratedDrafts([]);
        setBatchDrafts([]);
        onSuccess();
        onClose();
      } else {
        alert("Bulk Publish Error: " + (res.error || "Failed to publish products"));
      }
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
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
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "960px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #E2E8F0", paddingBottom: "1rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 900, color: "#0F172A", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Sparkles size={24} style={{ color: "#8B5CF6" }} /> AI Bulk Poster Creator & Importer
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#64748B" }}>
              Generate complete poster suites for movies/actors or batch upload poster image files all at once.
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
            <X size={24} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", backgroundColor: "#F1F5F9", padding: "4px", borderRadius: "12px" }}>
          <button
            onClick={() => setActiveTab("COLLECTION")}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: activeTab === "COLLECTION" ? "#FFFFFF" : "transparent",
              color: activeTab === "COLLECTION" ? "#0F172A" : "#64748B",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: activeTab === "COLLECTION" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <Film size={18} /> Movie / Actor Collection Suite Generator
          </button>
          <button
            onClick={() => setActiveTab("BATCH_UPLOAD")}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: activeTab === "BATCH_UPLOAD" ? "#FFFFFF" : "transparent",
              color: activeTab === "BATCH_UPLOAD" ? "#0F172A" : "#64748B",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: activeTab === "BATCH_UPLOAD" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <UploadCloud size={18} /> Batch Poster Image File Importer
          </button>
        </div>

        {errorMessage && (
          <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "0.75rem 1rem", borderRadius: "12px", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* TAB 1: COLLECTION SUITE GENERATOR */}
        {activeTab === "COLLECTION" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <form onSubmit={handleGenerateCollection} style={{ backgroundColor: "#F8FAFC", padding: "1.5rem", borderRadius: "16px", border: "1px solid #E2E8F0", display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1E293B", display: "block", marginBottom: "0.35rem" }}>
                  Movie Name or Actor / Director
                </label>
                <input
                  type="text"
                  placeholder="e.g. Drishyam, Mohanlal, Lucifer, Premam, Fahadh Faasil"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1E293B", display: "block", marginBottom: "0.35rem" }}>
                  Poster Variants Count
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem", backgroundColor: "#FFF" }}
                >
                  <option value={3}>3 Poster Concepts</option>
                  <option value={5}>5 Poster Concepts</option>
                  <option value={8}>8 Poster Concepts</option>
                  <option value={10}>10 Poster Concepts</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1E293B", display: "block", marginBottom: "0.35rem" }}>
                  Collection Tag
                </label>
                <select
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem", backgroundColor: "#FFF" }}
                >
                  <option value="Classic Malayalam">Classic Malayalam</option>
                  <option value="Modern Malayalam">Modern Malayalam</option>
                  <option value="Cult Classics">Cult Classics</option>
                  <option value="Limited Edition">Limited Edition</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                style={{
                  padding: "0.65rem 1.25rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#8B5CF6",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  whiteSpace: "nowrap",
                }}
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Generate Suite
              </button>
            </form>

            {/* Generated Suite Preview Table */}
            {generatedDrafts.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0F172A" }}>
                    Generated Poster Suite ({generatedDrafts.length} Products Ready)
                  </h3>
                  <button
                    onClick={() => handlePublishAll(generatedDrafts)}
                    disabled={isPending}
                    style={{
                      padding: "0.75rem 1.5rem",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: "#10B981",
                      color: "#FFF",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      cursor: isPending ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    Publish All {generatedDrafts.length} Posters to Store
                  </button>
                </div>

                <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F8FAFC", color: "#475569", fontWeight: 800, borderBottom: "1px solid #E2E8F0" }}>
                        <th style={{ padding: "0.85rem 1rem" }}>Poster Product Title</th>
                        <th style={{ padding: "0.85rem 1rem" }}>Film & Director</th>
                        <th style={{ padding: "0.85rem 1rem" }}>Tagline</th>
                        <th style={{ padding: "0.85rem 1rem" }}>Price</th>
                        <th style={{ padding: "0.85rem 1rem" }}>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedDrafts.map((d, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "#0F172A" }}>
                            {d.title}
                          </td>
                          <td style={{ padding: "0.85rem 1rem" }}>
                            {d.film} ({d.year})
                            <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Dir. {d.director}</div>
                          </td>
                          <td style={{ padding: "0.85rem 1rem", fontStyle: "italic", color: "#475569" }}>
                            "{d.tagline}"
                          </td>
                          <td style={{ padding: "0.85rem 1rem", fontWeight: 800 }}>₹{d.price}</td>
                          <td style={{ padding: "0.85rem 1rem" }}>{d.inventory} pcs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BATCH IMAGE UPLOADER */}
        {activeTab === "BATCH_UPLOAD" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ backgroundColor: "#F8FAFC", border: "2px dashed #CBD5E1", borderRadius: "20px", padding: "2.5rem 1.5rem", textAlign: "center" }}>
              <UploadCloud size={44} style={{ color: "#8B5CF6", marginBottom: "0.75rem" }} />
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: 800, color: "#0F172A" }}>
                Upload Multiple Poster Image Files
              </h3>
              <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.85rem", color: "#64748B" }}>
                Select up to 10 high-resolution poster images at once. AI Vision & LLM will process each artwork automatically.
              </p>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#0F172A",
                  color: "#FFF",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  cursor: uploadingFiles ? "not-allowed" : "pointer",
                }}
              >
                {uploadingFiles ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                {uploadingFiles ? "Analyzing Posters..." : "Select Poster Images..."}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploadingFiles}
                  onChange={handleBatchImageUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {batchDrafts.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0F172A" }}>
                    Batch Uploaded Posters ({batchDrafts.length} Analyzed)
                  </h3>
                  <button
                    onClick={() => handlePublishAll(batchDrafts)}
                    disabled={isPending}
                    style={{
                      padding: "0.75rem 1.5rem",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: "#10B981",
                      color: "#FFF",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      cursor: isPending ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    Publish All {batchDrafts.length} Posters to Store
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat( auto-fill, minmax(220px, 1fr) )", gap: "1rem" }}>
                  {batchDrafts.map((d, idx) => (
                    <div key={idx} style={{ border: "1px solid #E2E8F0", borderRadius: "14px", padding: "0.85rem", backgroundColor: "#FFF", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {d.images?.[0]?.url && (
                        <img src={d.images[0].url} alt={d.title} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "10px" }} />
                      )}
                      <strong style={{ fontSize: "0.85rem", color: "#0F172A" }}>{d.title}</strong>
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{d.film} • ₹{d.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
