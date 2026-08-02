"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import Image from "next/image";
import { saveCollectionAction, deleteCollectionAction } from "@/features/admin/businessActions";
import { FolderKanban, Plus, Edit, Trash2, Loader2, X, Package, Search, CheckSquare, Square, Tag, Layers, CornerDownRight } from "lucide-react";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isPending, startTransition] = useTransition();

  // View Filter
  const [viewTab, setViewTab] = useState<"ALL" | "TOP_LEVEL" | "SUB_COLLECTIONS">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [posterSearch, setPosterSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "THIS" | "OTHER" | "UNASSIGNED">("ALL");

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/collections");
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections || []);
      }
    } catch (e) {
      console.error("Failed to fetch collections:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setAllProducts(data.products || []);
      }
    } catch (e) {
      console.error("Failed to fetch products for collection assignment:", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, []);

  const handleOpenCreate = (defaultParentId?: string) => {
    setEditingCollection(null);
    setName("");
    setDescription("");
    setParentId(defaultParentId || "");
    setSelectedProductIds([]);
    setPosterSearch("");
    setFilterTab("ALL");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col: any) => {
    setEditingCollection(col);
    setName(col.name);
    setDescription(col.description || "");
    setParentId(col.parentId || "");
    const currentProductIds = col.products?.map((p: any) => p.id) || [];
    setSelectedProductIds(currentProductIds);
    setPosterSearch("");
    setFilterTab("ALL");
    setIsModalOpen(true);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Filtered collections for dashboard grid
  const displayedCollections = useMemo(() => {
    if (viewTab === "TOP_LEVEL") {
      return collections.filter((c) => !c.parentId);
    }
    if (viewTab === "SUB_COLLECTIONS") {
      return collections.filter((c) => Boolean(c.parentId));
    }
    return collections;
  }, [collections, viewTab]);

  // Available parent options (excluding current editing collection to prevent self-nesting loop)
  const parentCollectionOptions = useMemo(() => {
    return collections.filter((c) => !editingCollection || c.id !== editingCollection.id);
  }, [collections, editingCollection]);

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Filter by tab
    if (filterTab === "THIS") {
      result = result.filter((p) => selectedProductIds.includes(p.id));
    } else if (filterTab === "OTHER") {
      result = result.filter((p) => {
        const cName = p.collectionName || p.collection?.name;
        const isThis = editingCollection && cName === editingCollection.name;
        const isGeneral = !cName || cName === "General Art Prints" || cName === "Uncategorized";
        return !isThis && !isGeneral;
      });
    } else if (filterTab === "UNASSIGNED") {
      result = result.filter((p) => {
        const cName = p.collectionName || p.collection?.name;
        return !cName || cName === "General Art Prints" || cName === "Uncategorized";
      });
    }

    // Filter by text search
    if (posterSearch.trim()) {
      const q = posterSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.film?.toLowerCase().includes(q) ||
          p.director?.toLowerCase().includes(q) ||
          (p.collectionName && p.collectionName.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allProducts, posterSearch, filterTab, selectedProductIds, editingCollection]);

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredProducts.map((p) => p.id);
    const newSet = new Set([...selectedProductIds, ...filteredIds]);
    setSelectedProductIds(Array.from(newSet));
  };

  const handleDeselectAllFiltered = () => {
    const filteredIdSet = new Set(filteredProducts.map((p) => p.id));
    setSelectedProductIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      const res = await saveCollectionAction(
        name,
        description,
        editingCollection?.id,
        selectedProductIds,
        parentId
      );
      if (res.success) {
        setIsModalOpen(false);
        fetchCollections();
        fetchProducts();
      } else {
        alert("Error saving collection: " + res.error);
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete collection "${name}"?`)) return;

    startTransition(async () => {
      const res = await deleteCollectionAction(id);
      if (res.success) {
        setCollections((prev) => prev.filter((c) => c.id !== id));
        fetchProducts();
      } else {
        alert("Error deleting collection: " + res.error);
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-0.03em", margin: 0 }}>
            Collection Management
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
            Organize art posters into parent series and sub-collections.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* View Filter Tabs */}
          <div style={{ display: "flex", backgroundColor: "#F1F5F9", borderRadius: "10px", padding: "3px" }}>
            {[
              { id: "ALL", label: `All (${collections.length})` },
              { id: "TOP_LEVEL", label: "Top-Level Series" },
              { id: "SUB_COLLECTIONS", label: "Sub-Collections" },
            ].map((vt) => (
              <button
                key={vt.id}
                onClick={() => setViewTab(vt.id as any)}
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  padding: "0.4rem 0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: viewTab === vt.id ? "#FFF" : "transparent",
                  color: viewTab === vt.id ? "#0F172A" : "#64748B",
                  boxShadow: viewTab === vt.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  cursor: "pointer",
                }}
              >
                {vt.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleOpenCreate()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#10B981",
              color: "#FFF",
              border: "none",
              borderRadius: "12px",
              padding: "0.75rem 1.25rem",
              fontSize: "0.9rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            <Plus size={18} /> Add Collection
          </button>
        </div>
      </div>

      {/* Grid of Collections */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <Loader2 size={24} className="animate-spin" /> Loading collections...
        </div>
      ) : displayedCollections.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
          <FolderKanban size={40} style={{ marginBottom: "1rem", opacity: 0.5 }} />
          <p>No collections found for this filter tab. Click "Add Collection" to create one!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
          {displayedCollections.map((col) => {
            const productCount = col._count?.products ?? col.products?.length ?? 0;
            const assignedProducts = col.products || [];
            const subCols = col.subCollections || [];
            const parentName = col.parent?.name;

            return (
              <div
                key={col.id}
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: "20px",
                  padding: "1.75rem",
                  border: parentName ? "1.5 solid #E0F2FE" : "1px solid #EFECE6",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  position: "relative",
                }}
              >
                {/* Parent Collection Tag */}
                {parentName && (
                  <div style={{ fontSize: "0.75rem", color: "#0284C7", fontWeight: 700, backgroundColor: "#E0F2FE", padding: "0.25rem 0.6rem", borderRadius: "6px", alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CornerDownRight size={12} /> Sub-collection of: {parentName}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: parentName ? "#F0F9FF" : "#ECFDF5", color: parentName ? "#0284C7" : "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FolderKanban size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, color: "#0F172A" }}>{col.name}</h3>
                      <span style={{ fontSize: "0.75rem", color: "#64748B", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Package size={12} /> {productCount} Assigned Posters
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button
                      onClick={() => handleOpenEdit(col)}
                      style={{ border: "1px solid #E5E7EB", background: "#FFF", borderRadius: "8px", padding: "0.35rem 0.5rem", cursor: "pointer" }}
                      title="Edit Collection & Posters"
                    >
                      <Edit size={14} style={{ color: "#3B82F6" }} />
                    </button>
                    <button
                      onClick={() => handleDelete(col.id, col.name)}
                      style={{ border: "1px solid #FEE2E2", background: "#FEF2F2", borderRadius: "8px", padding: "0.35rem 0.5rem", cursor: "pointer" }}
                      title="Delete Collection"
                    >
                      <Trash2 size={14} style={{ color: "#EF4444" }} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: 1.5 }}>
                  {col.description || "No description provided."}
                </p>

                {/* Sub-Collections List (If this collection is a parent) */}
                {subCols.length > 0 && (
                  <div style={{ backgroundColor: "#F8FAFC", borderRadius: "12px", padding: "0.75rem 1rem", border: "1px solid #E2E8F0" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#334155", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Layers size={14} style={{ color: "#10B981" }} /> SUB-COLLECTIONS ({subCols.length}):
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {subCols.map((sub: any) => (
                        <span
                          key={sub.id}
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            backgroundColor: "#FFF",
                            color: "#0F172A",
                            border: "1px solid #CBD5E1",
                            borderRadius: "6px",
                            padding: "0.2rem 0.5rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <CornerDownRight size={10} style={{ color: "#10B981" }} /> {sub.name} ({sub._count?.products || 0})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Button to Create Sub-Collection under this parent */}
                {!parentName && (
                  <button
                    type="button"
                    onClick={() => handleOpenCreate(col.id)}
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#10B981",
                      backgroundColor: "#ECFDF5",
                      border: "1px dashed #A7F3D0",
                      borderRadius: "8px",
                      padding: "0.4rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <Plus size={14} /> Add Sub-Collection under "{col.name}"
                  </button>
                )}

                {/* Assigned Posters Thumbnails Bar */}
                {assignedProducts.length > 0 && (
                  <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "0.75rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", marginBottom: "0.5rem" }}>
                      INCLUDED POSTERS ({assignedProducts.length}):
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
                      {assignedProducts.slice(0, 6).map((p: any) => {
                        const imgUrl = p.images?.[0]?.url;
                        return (
                          <div
                            key={p.id}
                            style={{
                              width: "36px",
                              height: "46px",
                              borderRadius: "6px",
                              overflow: "hidden",
                              border: "1px solid #E5E7EB",
                              position: "relative",
                              flexShrink: 0,
                              backgroundColor: "#F9FAFB",
                            }}
                            title={`${p.title} (${p.film || ""})`}
                          >
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={p.title}
                                width={36}
                                height={46}
                                unoptimized={imgUrl.startsWith("http")}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", fontWeight: 800 }}>
                                {p.title.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {assignedProducts.length > 6 && (
                        <div
                          style={{
                            width: "36px",
                            height: "46px",
                            borderRadius: "6px",
                            backgroundColor: "#F3F4F6",
                            color: "#666",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          +{assignedProducts.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Collection Create/Edit Modal with Sub-Collection Support & Poster Selection Checklist */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FFF",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "740px",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "800" }}>
                  {editingCollection ? `Edit Collection: ${editingCollection.name}` : "Create New Collection"}
                </h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#64748B" }}>
                  Set collection details, assign a Parent Collection (Sub-Collection), and select posters.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flexGrow: 1, overflowY: "auto", padding: "1.25rem 1.75rem", gap: "1.25rem" }}>
              {/* Fields Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 1990s Action Classics"
                    style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                    Parent Collection (Optional)
                  </label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.85rem", backgroundColor: "#FFF" }}
                  >
                    <option value="">None (Top-Level Collection)</option>
                    {parentCollectionOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} {opt.parentId ? "(Sub-collection)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Curated vintage film poster art..."
                    style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              {/* POSTER SELECTION MANAGER */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexGrow: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Package size={16} style={{ color: "#10B981" }} /> Select Posters for Collection
                    </label>
                    <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                      {selectedProductIds.length} of {allProducts.length} posters selected
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={handleSelectAllFiltered}
                      style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10B981", background: "#ECFDF5", border: "none", borderRadius: "6px", padding: "0.3rem 0.6rem", cursor: "pointer" }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllFiltered}
                      style={{ fontSize: "0.75rem", fontWeight: 700, color: "#EF4444", background: "#FEF2F2", border: "none", borderRadius: "6px", padding: "0.3rem 0.6rem", cursor: "pointer" }}
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {/* Category Tabs */}
                  <div style={{ display: "flex", gap: "0.35rem", overflowX: "auto", paddingBottom: "2px" }}>
                    {[
                      { id: "ALL", label: `All (${allProducts.length})` },
                      { id: "THIS", label: `Selected (${selectedProductIds.length})` },
                      { id: "OTHER", label: "In Other Collections" },
                      { id: "UNASSIGNED", label: "Unassigned" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilterTab(tab.id as any)}
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.3rem 0.65rem",
                          borderRadius: "8px",
                          border: filterTab === tab.id ? "1px solid #10B981" : "1px solid #E2E8F0",
                          backgroundColor: filterTab === tab.id ? "#10B981" : "#F8FAFC",
                          color: filterTab === tab.id ? "#FFF" : "#475569",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                    <input
                      type="text"
                      value={posterSearch}
                      onChange={(e) => setPosterSearch(e.target.value)}
                      placeholder="Search posters by title, film, or current collection..."
                      style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2rem", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.8rem", backgroundColor: "#F8FAFC" }}
                    />
                  </div>
                </div>

                {/* Scrollable Poster Checklist */}
                <div
                  style={{
                    maxHeight: "260px",
                    overflowY: "auto",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    backgroundColor: "#FAFBFD",
                    padding: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                  }}
                >
                  {loadingProducts ? (
                    <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748B", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <Loader2 size={16} className="animate-spin" /> Loading store posters...
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div style={{ padding: "1.5rem", textAlign: "center", color: "#94A3B8", fontSize: "0.85rem" }}>
                      No posters match filters
                    </div>
                  ) : (
                    filteredProducts.map((p) => {
                      const isSelected = selectedProductIds.includes(p.id);
                      const imgUrl = p.images?.[0]?.url;
                      const currentCollectionName = p.collectionName || p.collection?.name;
                      const isAssignedToThis = editingCollection && currentCollectionName === editingCollection.name;
                      const isAssignedToOther = currentCollectionName && (!editingCollection || currentCollectionName !== editingCollection.name) && currentCollectionName !== "General Art Prints" && currentCollectionName !== "Uncategorized";

                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleProductSelection(p.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "10px",
                            backgroundColor: isSelected ? "#F0FDF4" : "#FFF",
                            border: isSelected ? "1px solid #A7F3D0" : "1px solid #F1F5F9",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <div style={{ color: isSelected ? "#10B981" : "#94A3B8", display: "flex", alignItems: "center" }}>
                            {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>

                          <div
                            style={{
                              width: "32px",
                              height: "42px",
                              borderRadius: "6px",
                              overflow: "hidden",
                              backgroundColor: "#E2E8F0",
                              flexShrink: 0,
                            }}
                          >
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={p.title}
                                width={32}
                                height={42}
                                unoptimized={imgUrl.startsWith("http")}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", fontWeight: 800, color: "#64748B" }}>
                                {p.title.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: isSelected ? "#065F46" : "#0F172A", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                              {p.title}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#64748B", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                              {p.film ? `${p.film} (${p.year || ""})` : `₹${p.price}`}
                            </div>
                          </div>

                          <div style={{ flexShrink: 0 }}>
                            {isSelected ? (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  backgroundColor: "#D1FAE5",
                                  color: "#065F46",
                                  fontWeight: 800,
                                  padding: "0.2rem 0.55rem",
                                  borderRadius: "6px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                }}
                              >
                                <Tag size={10} /> Selected
                              </span>
                            ) : isAssignedToOther ? (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  backgroundColor: "#E0F2FE",
                                  color: "#0369A1",
                                  fontWeight: 700,
                                  padding: "0.2rem 0.55rem",
                                  borderRadius: "6px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                }}
                                title={`Currently assigned to ${currentCollectionName}`}
                              >
                                <Tag size={10} /> In: {currentCollectionName}
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  backgroundColor: "#F1F5F9",
                                  color: "#64748B",
                                  fontWeight: 600,
                                  padding: "0.2rem 0.55rem",
                                  borderRadius: "6px",
                                }}
                              >
                                Unassigned
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #F1F5F9" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "0.65rem 1.25rem", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#FFF", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    padding: "0.65rem 1.75rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "#10B981",
                    color: "#FFF",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                  }}
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save Collection & Sub-Collections"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
