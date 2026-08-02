"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import Image from "next/image";
import { saveCollectionAction, deleteCollectionAction } from "@/features/admin/businessActions";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Package,
  Search,
  CheckSquare,
  Square,
  Tag,
  Layers,
  CornerDownRight,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";

export default function AdminCollectionsPage() {
  // Main Tab State
  const [mainTab, setMainTab] = useState<"COLLECTIONS" | "SUB_COLLECTIONS">("COLLECTIONS");

  // Data States
  const [collections, setCollections] = useState<any[]>([]);
  const [subCollections, setSubCollections] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubCols, setLoadingSubCols] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Search & Pagination for SubCollections
  const [subSearch, setSubSearch] = useState("");
  const [subSort, setSubSort] = useState<"name" | "count" | "date">("name");

  // View Filter for Parent Collections
  const [viewTab, setViewTab] = useState<"ALL" | "TOP_LEVEL" | "SUB_COLLECTIONS">("ALL");

  // Parent Collection Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [posterSearch, setPosterSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "THIS" | "OTHER" | "UNASSIGNED">("ALL");

  // SubCollection Modal State
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSubCollection, setEditingSubCollection] = useState<any | null>(null);
  const [subName, setSubName] = useState("");
  const [subSlug, setSubSlug] = useState("");
  const [subDescription, setSubDescription] = useState("");
  const [subCoverImage, setSubCoverImage] = useState("");
  const [subParentCollectionId, setSubParentCollectionId] = useState("");
  const [subSelectedProductIds, setSubSelectedProductIds] = useState<string[]>([]);
  const [subPosterSearch, setSubPosterSearch] = useState("");

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

  const fetchSubCollections = async () => {
    try {
      setLoadingSubCols(true);
      const res = await fetch("/api/admin/sub-collections");
      if (res.ok) {
        const data = await res.json();
        setSubCollections(data.subCollections || []);
      }
    } catch (e) {
      console.error("Failed to fetch sub collections:", e);
    } finally {
      setLoadingSubCols(false);
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
    fetchSubCollections();
    fetchProducts();
  }, []);

  // --- PARENT COLLECTION HANDLERS ---
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

  // --- SUB COLLECTION HANDLERS ---
  const handleOpenCreateSub = (defaultCollectionId?: string) => {
    setEditingSubCollection(null);
    setSubName("");
    setSubSlug("");
    setSubDescription("");
    setSubCoverImage("");
    setSubParentCollectionId(defaultCollectionId || collections[0]?.id || "");
    setSubSelectedProductIds([]);
    setSubPosterSearch("");
    setIsSubModalOpen(true);
  };

  const handleOpenEditSub = (sub: any) => {
    setEditingSubCollection(sub);
    setSubName(sub.name);
    setSubSlug(sub.slug);
    setSubDescription(sub.description || "");
    setSubCoverImage(sub.coverImage || "");
    setSubParentCollectionId(sub.collectionId);
    
    // Find products assigned to this subCollection
    const assignedIds = allProducts.filter((p) => p.subCollectionId === sub.id).map((p) => p.id);
    setSubSelectedProductIds(assignedIds);
    setSubPosterSearch("");
    setIsSubModalOpen(true);
  };

  const handleSubNameChange = (val: string) => {
    setSubName(val);
    if (!editingSubCollection) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSubSlug(autoSlug);
    }
  };

  const toggleSubProductSelection = (productId: string) => {
    setSubSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmitSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subParentCollectionId) return;

    try {
      const payload = {
        id: editingSubCollection?.id,
        name: subName,
        slug: subSlug,
        description: subDescription,
        coverImage: subCoverImage,
        collectionId: subParentCollectionId,
      };

      const endpoint = "/api/admin/sub-collections";
      const method = editingSubCollection ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save sub collection");
        return;
      }

      const savedSubId = data.subCollection?.id;

      // Update products subCollectionId assignment
      if (savedSubId) {
        // Unassign unselected products
        const productsToUnassign = allProducts.filter(
          (p) => p.subCollectionId === savedSubId && !subSelectedProductIds.includes(p.id)
        );
        for (const p of productsToUnassign) {
          await fetch(`/api/admin/products`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: p.id, subCollectionId: null }),
          }).catch(() => {});
        }

        // Assign selected products
        for (const pid of subSelectedProductIds) {
          const parentColName = collections.find((c) => c.id === subParentCollectionId)?.name;
          await fetch(`/api/admin/products`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: pid,
              subCollectionId: savedSubId,
              collectionName: parentColName || undefined,
            }),
          }).catch(() => {});
        }
      }

      setIsSubModalOpen(false);
      fetchSubCollections();
      fetchCollections();
      fetchProducts();
    } catch (err: any) {
      alert("Error saving sub collection: " + err.message);
    }
  };

  const handleDeleteSub = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete sub collection "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/sub-collections?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubCollections((prev) => prev.filter((s) => s.id !== id));
        fetchProducts();
      } else {
        alert(data.error || "Failed to delete sub collection");
      }
    } catch (err: any) {
      alert("Error deleting sub collection: " + err.message);
    }
  };

  // Filtered & Sorted SubCollections list
  const filteredSubCollections = useMemo(() => {
    let list = [...subCollections];

    if (subSearch.trim()) {
      const q = subSearch.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.slug.toLowerCase().includes(q) ||
          (s.collection?.name && s.collection.name.toLowerCase().includes(q)) ||
          (s.description && s.description.toLowerCase().includes(q))
      );
    }

    if (subSort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (subSort === "count") {
      list.sort((a, b) => (b._count?.products || 0) - (a._count?.products || 0));
    } else if (subSort === "date") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [subCollections, subSearch, subSort]);

  // Filtered products for poster selection checklists
  const filteredProducts = useMemo(() => {
    let result = allProducts;
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

  const filteredSubProducts = useMemo(() => {
    if (!subPosterSearch.trim()) return allProducts;
    const q = subPosterSearch.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.film?.toLowerCase().includes(q) ||
        p.director?.toLowerCase().includes(q)
    );
  }, [allProducts, subPosterSearch]);

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredProducts.map((p) => p.id);
    const newSet = new Set([...selectedProductIds, ...filteredIds]);
    setSelectedProductIds(Array.from(newSet));
  };

  const handleDeselectAllFiltered = () => {
    const filteredIdSet = new Set(filteredProducts.map((p) => p.id));
    setSelectedProductIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header & Main Section Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-0.03em", margin: 0 }}>
            Collection Management
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
            Organize art posters into Parent Collections and Sub Collections (e.g. Malayalam → Mohanlal).
          </p>
        </div>

        {/* Main Tab Navigation */}
        <div style={{ display: "flex", backgroundColor: "#E2E8F0", borderRadius: "12px", padding: "4px" }}>
          <button
            onClick={() => setMainTab("COLLECTIONS")}
            style={{
              fontSize: "0.85rem",
              fontWeight: 800,
              padding: "0.5rem 1.1rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: mainTab === "COLLECTIONS" ? "#FFF" : "transparent",
              color: mainTab === "COLLECTIONS" ? "#0F172A" : "#64748B",
              boxShadow: mainTab === "COLLECTIONS" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FolderKanban size={16} /> Manage Collections ({collections.length})
          </button>
          <button
            onClick={() => setMainTab("SUB_COLLECTIONS")}
            style={{
              fontSize: "0.85rem",
              fontWeight: 800,
              padding: "0.5rem 1.1rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: mainTab === "SUB_COLLECTIONS" ? "#FFF" : "transparent",
              color: mainTab === "SUB_COLLECTIONS" ? "#0F172A" : "#64748B",
              boxShadow: mainTab === "SUB_COLLECTIONS" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Layers size={16} /> Manage Sub Collections ({subCollections.length})
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 1: MANAGE COLLECTIONS              */}
      {/* ========================================== */}
      {mainTab === "COLLECTIONS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", backgroundColor: "#F1F5F9", borderRadius: "10px", padding: "3px" }}>
              {[
                { id: "ALL", label: `All (${collections.length})` },
                { id: "TOP_LEVEL", label: "Top-Level Series" },
                { id: "SUB_COLLECTIONS", label: "Legacy Sub-Collections" },
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

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <Loader2 size={24} className="animate-spin" /> Loading collections...
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
              {collections.map((col) => {
                const productCount = col._count?.products ?? col.products?.length ?? 0;
                const assignedProducts = col.products || [];
                const subCols = col.subCollections || [];

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
                        <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "#ECFDF5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
                        <button onClick={() => handleOpenEdit(col)} style={{ border: "1px solid #E5E7EB", background: "#FFF", borderRadius: "8px", padding: "0.35rem 0.5rem", cursor: "pointer" }}>
                          <Edit size={14} style={{ color: "#3B82F6" }} />
                        </button>
                        <button onClick={() => handleDelete(col.id, col.name)} style={{ border: "1px solid #FEE2E2", background: "#FEF2F2", borderRadius: "8px", padding: "0.35rem 0.5rem", cursor: "pointer" }}>
                          <Trash2 size={14} style={{ color: "#EF4444" }} />
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: 1.5 }}>
                      {col.description || "No description provided."}
                    </p>

                    {/* Sub-Collections List */}
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
                              <CornerDownRight size={10} style={{ color: "#10B981" }} /> {sub.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenCreateSub(col.id)}
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
                      <Plus size={14} /> Add Sub Collection under "{col.name}"
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* SECTION 2: MANAGE SUB COLLECTIONS           */}
      {/* ========================================== */}
      {mainTab === "SUB_COLLECTIONS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* SubCollections Toolbar: Search, Sort, Add */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: "1 1 300px", maxWidth: "600px" }}>
              {/* Search input */}
              <div style={{ position: "relative", flexGrow: 1 }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  type="text"
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  placeholder="Search sub collections by name, slug, parent..."
                  style={{ width: "100%", padding: "0.65rem 0.75rem 0.65rem 2.25rem", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "0.85rem", backgroundColor: "#FFF" }}
                />
              </div>

              {/* Sort Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <ArrowUpDown size={14} style={{ color: "#64748B" }} />
                <select
                  value={subSort}
                  onChange={(e) => setSubSort(e.target.value as any)}
                  style={{ padding: "0.65rem 0.75rem", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "0.85rem", backgroundColor: "#FFF", cursor: "pointer" }}
                >
                  <option value="name">Sort by Name</option>
                  <option value="count">Sort by Poster Count</option>
                  <option value="date">Sort by Newest</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => handleOpenCreateSub()}
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
              <Plus size={18} /> Add Sub Collection
            </button>
          </div>

          {/* SubCollections Grid */}
          {loadingSubCols ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <Loader2 size={24} className="animate-spin" /> Loading sub collections...
            </div>
          ) : filteredSubCollections.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#888", backgroundColor: "#FFF", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
              <Layers size={40} style={{ marginBottom: "1rem", opacity: 0.5 }} />
              <p>No Sub Collections found. Click "Add Sub Collection" to create your first sub-category (e.g. Malayalam → Mohanlal)!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
              {filteredSubCollections.map((sub) => {
                const productCount = sub._count?.products || 0;
                const parentName = sub.collection?.name || "Parent Collection";

                return (
                  <div
                    key={sub.id}
                    style={{
                      backgroundColor: "#FFF",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {/* Header with Cover Image & Parent Badge */}
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          backgroundColor: "#F1F5F9",
                          border: "1px solid #E2E8F0",
                          flexShrink: 0,
                          position: "relative",
                        }}
                      >
                        {sub.coverImage ? (
                          <Image
                            src={sub.coverImage}
                            alt={sub.name}
                            width={56}
                            height={56}
                            unoptimized={sub.coverImage.startsWith("http")}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                            <Layers size={24} />
                          </div>
                        )}
                      </div>

                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.75rem", color: "#0284C7", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                          <CornerDownRight size={12} /> {parentName}
                        </div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#0F172A", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {sub.name}
                        </h3>
                        <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          slug: /{sub.slug} • {productCount} Posters
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button onClick={() => handleOpenEditSub(sub)} style={{ border: "1px solid #E5E7EB", background: "#FFF", borderRadius: "8px", padding: "0.35rem 0.5rem", cursor: "pointer" }}>
                          <Edit size={14} style={{ color: "#3B82F6" }} />
                        </button>
                        <button onClick={() => handleDeleteSub(sub.id, sub.name)} style={{ border: "1px solid #FEE2E2", background: "#FEF2F2", borderRadius: "8px", padding: "0.35rem 0.5rem", cursor: "pointer" }}>
                          <Trash2 size={14} style={{ color: "#EF4444" }} />
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: 1.5 }}>
                      {sub.description || "No description provided."}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: CREATE / EDIT PARENT COLLECTION   */}
      {/* ========================================== */}
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
            <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "800" }}>
                  {editingCollection ? `Edit Collection: ${editingCollection.name}` : "Create New Collection"}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flexGrow: 1, overflowY: "auto", padding: "1.25rem 1.75rem", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>Collection Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Malayalam" style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>Description</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Curated Malayalam cinema artwork..." style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }} />
                </div>
              </div>

              {/* POSTER SELECTION CHECKLIST */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexGrow: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0F172A" }}>Select Posters ({selectedProductIds.length} selected)</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="button" onClick={handleSelectAllFiltered} style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10B981", background: "#ECFDF5", border: "none", borderRadius: "6px", padding: "0.3rem 0.6rem", cursor: "pointer" }}>Select All</button>
                    <button type="button" onClick={handleDeselectAllFiltered} style={{ fontSize: "0.75rem", fontWeight: 700, color: "#EF4444", background: "#FEF2F2", border: "none", borderRadius: "6px", padding: "0.3rem 0.6rem", cursor: "pointer" }}>Deselect All</button>
                  </div>
                </div>

                <div style={{ maxHeight: "240px", overflowY: "auto", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {filteredProducts.map((p) => {
                    const isSelected = selectedProductIds.includes(p.id);
                    return (
                      <div key={p.id} onClick={() => toggleProductSelection(p.id)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.75rem", borderRadius: "10px", backgroundColor: isSelected ? "#F0FDF4" : "#FFF", border: isSelected ? "1px solid #A7F3D0" : "1px solid #F1F5F9", cursor: "pointer" }}>
                        <div style={{ color: isSelected ? "#10B981" : "#94A3B8" }}>{isSelected ? <CheckSquare size={18} /> : <Square size={18} />}</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{p.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #F1F5F9" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "0.65rem 1.25rem", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#FFF", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={isPending} style={{ padding: "0.65rem 1.75rem", borderRadius: "10px", border: "none", background: "#10B981", color: "#FFF", fontWeight: 700, cursor: "pointer" }}>
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: CREATE / EDIT SUB COLLECTION     */}
      {/* ========================================== */}
      {isSubModalOpen && (
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
          onClick={() => setIsSubModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FFF",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "760px",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "800" }}>
                  {editingSubCollection ? `Edit Sub Collection: ${editingSubCollection.name}` : "Create New Sub Collection"}
                </h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#64748B" }}>
                  Define sub-collection (e.g. Malayalam → Mohanlal) and select posters to assign.
                </p>
              </div>
              <button onClick={() => setIsSubModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitSub} style={{ display: "flex", flexDirection: "column", flexGrow: 1, overflowY: "auto", padding: "1.25rem 1.75rem", gap: "1.25rem" }}>
              {/* Parent Collection Selector & Name */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                    Parent Collection *
                  </label>
                  <select
                    required
                    value={subParentCollectionId}
                    onChange={(e) => setSubParentCollectionId(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.85rem", backgroundColor: "#FFF" }}
                  >
                    <option value="" disabled>Select Parent Collection...</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                    Sub Collection Name * (e.g. Mohanlal)
                  </label>
                  <input
                    type="text"
                    required
                    value={subName}
                    onChange={(e) => handleSubNameChange(e.target.value)}
                    placeholder="e.g. Mohanlal"
                    style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              {/* Slug & Cover Image */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                    URL Slug * (Auto-generated)
                  </label>
                  <input
                    type="text"
                    required
                    value={subSlug}
                    onChange={(e) => setSubSlug(e.target.value)}
                    placeholder="e.g. mohanlal"
                    style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                    Cover Image URL (Optional)
                  </label>
                  <ImageUploader value={subCoverImage} onChange={(url) => setSubCoverImage(url)} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={subDescription}
                  onChange={(e) => setSubDescription(e.target.value)}
                  placeholder="Curated Mohanlal movie posters printed on high-quality art paper..."
                  style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}
                />
              </div>

              {/* SUB COLLECTION POSTER CHECKLIST */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexGrow: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Package size={16} style={{ color: "#10B981" }} /> Select Posters for {subName || "Sub Collection"}
                    </label>
                    <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                      {subSelectedProductIds.length} posters selected
                    </span>
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input
                    type="text"
                    value={subPosterSearch}
                    onChange={(e) => setSubPosterSearch(e.target.value)}
                    placeholder="Search posters by title, film, director..."
                    style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2rem", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.8rem", backgroundColor: "#F8FAFC" }}
                  />
                </div>

                <div
                  style={{
                    maxHeight: "220px",
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
                  {filteredSubProducts.map((p) => {
                    const isSelected = subSelectedProductIds.includes(p.id);
                    const imgUrl = p.images?.[0]?.url;

                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleSubProductSelection(p.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "10px",
                          backgroundColor: isSelected ? "#F0FDF4" : "#FFF",
                          border: isSelected ? "1px solid #A7F3D0" : "1px solid #F1F5F9",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ color: isSelected ? "#10B981" : "#94A3B8" }}>
                          {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </div>
                        <div style={{ width: "28px", height: "36px", borderRadius: "4px", overflow: "hidden", backgroundColor: "#E2E8F0", flexShrink: 0 }}>
                          {imgUrl && <Image src={imgUrl} alt={p.title} width={28} height={36} unoptimized style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, flexGrow: 1 }}>{p.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #F1F5F9" }}>
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  style={{ padding: "0.65rem 1.25rem", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#FFF", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
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
                  Save Sub Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
