"use client";

import React, { useState, useEffect, useTransition } from "react";
import { saveCollectionAction, deleteCollectionAction } from "@/features/admin/businessActions";
import { FolderKanban, Plus, Edit, Trash2, Loader2, X, Package } from "lucide-react";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleOpenCreate = () => {
    setEditingCollection(null);
    setName("");
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col: any) => {
    setEditingCollection(col);
    setName(col.name);
    setDescription(col.description || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      const res = await saveCollectionAction(name, description, editingCollection?.id);
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
            Organize art posters into curated thematic series and film eras.
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {collections.map((col) => (
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
                gap: "1rem",
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
                      <Package size={12} /> {col._count?.products ?? col.products?.length ?? 0} Listed Products
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

              <p style={{ fontSize: "0.85rem", color: "#555", margin: 0, lineHeight: 1.5 }}>
                {col.description || "No description provided."}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
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
              maxWidth: "500px",
              padding: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800" }}>
                {editingCollection ? "Edit Collection" : "Create Collection"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Collection Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Classic Malayalam" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Curated series celebrating vintage cinema artwork..." style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "0.75rem 1.25rem", borderRadius: "10px", border: "1px solid #E5E7EB", background: "#FFF", fontWeight: 700, cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isPending} style={{ padding: "0.75rem 1.75rem", borderRadius: "10px", border: "none", background: "#10B981", color: "#FFF", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
