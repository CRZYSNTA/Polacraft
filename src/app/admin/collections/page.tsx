"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import Image from "next/image";
import { saveCollectionAction, deleteCollectionAction } from "@/features/admin/businessActions";
import { FolderKanban, Plus, Edit, Trash2, Loader2, X, Package, Search, CheckSquare, Square } from "lucide-react";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [posterSearch, setPosterSearch] = useState("");

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

  const handleOpenCreate = () => {
    setEditingCollection(null);
    setName("");
    setDescription("");
    setSelectedProductIds([]);
    setPosterSearch("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col: any) => {
    setEditingCollection(col);
    setName(col.name);
    setDescription(col.description || "");
    const currentProductIds = col.products?.map((p: any) => p.id) || [];
    setSelectedProductIds(currentProductIds);
    setPosterSearch("");
    setIsModalOpen(true);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const filteredProducts = useMemo(() => {
    if (!posterSearch.trim()) return allProducts;
    const q = posterSearch.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.film?.toLowerCase().includes(q) ||
        p.director?.toLowerCase().includes(q)
    );
  }, [allProducts, posterSearch]);

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
        selectedProductIds
      );
      if (res.success) {
        setIsModalOpen(false);
        fetchCollections();
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
      } else {
        alert("Error deleting collection: " + res.error);
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-0.03em" }}>
            Collection Management
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Select posters and organize art prints into curated thematic series and film eras.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
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

      {/* Grid of Collections */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <Loader2 size={24} className="animate-spin" /> Loading collections...
        </div>
      ) : collections.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
          <FolderKanban size={40} style={{ marginBottom: "1rem", opacity: 0.5 }} />
          <p>No collections found. Click "Add Collection" to create your first series!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
          {collections.map((col) => {
            const productCount = col._count?.products ?? col.products?.length ?? 0;
            const assignedProducts = col.products || [];

            return (
              <div
                key={col.id}
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: "20px",
                  padding: "1.75rem",
                  border: "1px solid #EFECE6",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "12px", backgroundColor: "#ECFDF5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FolderKanban size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0 }}>{col.name}</h3>
                      <span style={{ fontSize: "0.75rem", color: "#666", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Package size={12} /> {productCount} Assigned Posters
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button
                      onClick={() => handleOpenEdit(col)}
                      style={{ border: "1px solid #E5E7EB", background: "#FFF", borderRadius: "8px", padding: "0.35rem 0.5rem", cursor: "pointer" }}
                      title="Select / Edit Posters in Collection"
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

                <p style={{ fontSize: "0.85rem", color: "#555", margin: 0, lineHeight: 1.5 }}>
                  {col.description || "No description provided."}
                </p>

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

      {/* Collection Create/Edit Modal with Poster Selection Checklist */}
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
              maxWidth: "680px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800" }}>
                  {editingCollection ? `Edit Collection: ${editingCollection.name}` : "Create New Collection"}
                </h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#64748B" }}>
                  Set collection metadata and select posters to include.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flexGrow: 1, overflowY: "auto", padding: "1.5rem 2rem", gap: "1.5rem" }}>
              {/* Basic Fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Classic Malayalam Cinema"
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.9rem" }}
                  />
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
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.9rem" }}
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
                      style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10B981", background: "#ECFDF5", border: "none", borderRadius: "6px", padding: "0.35rem 0.6rem", cursor: "pointer" }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllFiltered}
                      style={{ fontSize: "0.75rem", fontWeight: 700, color: "#EF4444", background: "#FEF2F2", border: "none", borderRadius: "6px", padding: "0.35rem 0.6rem", cursor: "pointer" }}
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Poster Search Bar */}
                <div style={{ position: "relative" }}>
                  <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input
                    type="text"
                    value={posterSearch}
                    onChange={(e) => setPosterSearch(e.target.value)}
                    placeholder="Search posters by title, film, director..."
                    style={{ width: "100%", padding: "0.55rem 0.75rem 0.55rem 2rem", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.8rem", backgroundColor: "#F8FAFC" }}
                  />
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
                      No posters match "{posterSearch}"
                    </div>
                  ) : (
                    filteredProducts.map((p) => {
                      const isSelected = selectedProductIds.includes(p.id);
                      const imgUrl = p.images?.[0]?.url;

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
                  style={{ padding: "0.75rem 1.25rem", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#FFF", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    padding: "0.75rem 1.75rem",
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
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save Collection & Posters"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
