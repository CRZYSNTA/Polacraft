"use client";

import React, { useState, useEffect, useTransition } from "react";
import { saveBlogPostAction, deleteBlogPostAction } from "@/features/admin/businessActions";
import ImageUploader from "@/components/admin/ImageUploader";
import { BookOpen, Plus, Edit, Trash2, Loader2, X, Image as ImageIcon } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [categoryName, setCategoryName] = useState("Design Notes");
  const [authorName, setAuthorName] = useState("Polacraft Curators");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error("Failed to fetch blog posts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setImg("https://images.unsplash.com/photo-1579783900280-496030999557?w=600");
    setReadTime("5 min read");
    setCategoryName("Design Notes");
    setAuthorName("Polacraft Curators");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setImg(post.img);
    setReadTime(post.readTime || "5 min read");
    setCategoryName(post.category?.name || "Design Notes");
    setAuthorName(post.author?.name || "Polacraft Curators");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    startTransition(async () => {
      const res = await saveBlogPostAction({
        id: editingPost?.id,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt,
        content,
        img,
        readTime,
        categoryName,
        authorName,
      });

      if (res.success) {
        setIsModalOpen(false);
        fetchPosts();
      } else {
        alert("Error saving blog post: " + res.error);
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    startTransition(async () => {
      const res = await deleteBlogPostAction(id);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Error deleting article: " + res.error);
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-0.03em" }}>
            Journal & Blog Content Editor
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Publish behind-the-scenes stories, design notes, and cinema culture articles.
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
          <Plus size={18} /> New Article
        </button>
      </div>

      {/* Articles Table */}
      <div style={{ backgroundColor: "#FFF", borderRadius: "16px", padding: "1.5rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Loader2 size={24} className="animate-spin" /> Loading journal posts...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
            <BookOpen size={40} style={{ marginBottom: "1rem", opacity: 0.5 }} />
            <p>No journal articles found. Click "New Article" above to publish your first post!</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #EFECE6", color: "#666", fontWeight: "700" }}>
                <th style={{ padding: "1rem" }}>Article Details</th>
                <th style={{ padding: "1rem" }}>Category</th>
                <th style={{ padding: "1rem" }}>Author</th>
                <th style={{ padding: "1rem" }}>Read Time</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ width: "50px", height: "35px", borderRadius: "6px", overflow: "hidden", backgroundColor: "#F3F4F6", flexShrink: 0 }}>
                      {post.img && <img src={post.img} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <div>
                      <strong style={{ fontSize: "0.95rem", color: "#111" }}>{post.title}</strong>
                      <div style={{ fontSize: "0.75rem", color: "#888" }}>/{post.slug}</div>
                    </div>
                  </td>

                  <td style={{ padding: "1rem" }}>
                    <span style={{ fontSize: "0.75rem", backgroundColor: "#ECFDF5", color: "#047857", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px" }}>
                      {post.category?.name || "General"}
                    </span>
                  </td>

                  <td style={{ padding: "1rem", color: "#555" }}>{post.author?.name || "Admin"}</td>

                  <td style={{ padding: "1rem", color: "#666", fontSize: "0.85rem" }}>{post.readTime || "5 min read"}</td>

                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                      <button onClick={() => handleOpenEdit(post)} style={{ border: "1px solid #E5E7EB", background: "#FFF", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer" }}>
                        <Edit size={14} style={{ color: "#3B82F6" }} />
                      </button>
                      <button onClick={() => handleDelete(post.id, post.title)} style={{ border: "1px solid #FEE2E2", background: "#FEF2F2", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer" }}>
                        <Trash2 size={14} style={{ color: "#EF4444" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor Modal */}
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
              maxWidth: "750px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800" }}>
                {editingPost ? "Edit Journal Article" : "Create Journal Article"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Article Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The Art of Minimalist Cinema Posters" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Category Name</label>
                  <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Design Notes" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Author Name</label>
                  <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Polacraft Curators" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
                </div>
              </div>

              {/* Cloudinary ImageUploader for Blog Banner */}
              <ImageUploader
                label="Article Banner Image (Upload to Cloudinary)"
                value={img}
                folder="polacraft/blog"
                onChange={(newUrl) => setImg(newUrl)}
              />

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Excerpt Summary *</label>
                <textarea rows={2} required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief introductory summary..." style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Full Article Content *</label>
                <textarea rows={8} required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write full article content here..." style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem", fontFamily: "inherit" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "0.75rem 1.25rem", borderRadius: "10px", border: "1px solid #E5E7EB", background: "#FFF", fontWeight: 700, cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isPending} style={{ padding: "0.75rem 1.75rem", borderRadius: "10px", border: "none", background: "#10B981", color: "#FFF", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
