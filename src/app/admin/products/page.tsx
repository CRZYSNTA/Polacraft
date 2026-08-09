"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  saveProductAction,
  deleteProductAction,
  updateStockAction,
  toggleHeroProductAction,
  ProductInput,
} from "@/features/admin/businessActions";
import ImageUploader from "@/components/admin/ImageUploader";
import AIAssistantModule from "@/components/admin/AIAssistant/AIAssistantModule";
import BulkPosterModal from "@/components/admin/AIAssistant/BulkPosterModal";
import {
  Package,
  Plus,
  Minus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
  X,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  CheckCircle2,
  Eye,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<string[]>([
    "Classic Malayalam",
    "Modern Cult Classics",
    "Retro Gallery",
  ]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [film, setFilm] = useState("");
  const [year, setYear] = useState(2024);
  const [director, setDirector] = useState("");
  const [collectionName, setCollectionName] = useState("Classic Malayalam");
  const [subCollectionId, setSubCollectionId] = useState<string>("");
  const [subCollections, setSubCollections] = useState<any[]>([]);
  const [rawCollections, setRawCollections] = useState<any[]>([]);

  const fetchSubCollectionsForCollection = async (cName: string, allCols: any[] = rawCollections) => {
    const colObj = allCols.find((c) => c.name === cName);
    if (!colObj) {
      setSubCollections([]);
      return;
    }
    try {
      const res = await fetch(`/api/admin/sub-collections?collectionId=${colObj.id}`);
      if (res.ok) {
        const data = await res.json();
        setSubCollections(data.subCollections || []);
      }
    } catch (e) {
      console.error("Failed to fetch sub collections:", e);
    }
  };

  const handleCollectionNameChange = (newColName: string) => {
    setCollectionName(newColName);
    setSubCollectionId("");
    fetchSubCollectionsForCollection(newColName);
  };
  const [genre, setGenre] = useState("Drama");
  const [price, setPrice] = useState(350);
  const [costPrice, setCostPrice] = useState(60);
  const [inventory, setInventory] = useState(20);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [isPreorder, setIsPreorder] = useState(false);
  const [limitedEditionCount, setLimitedEditionCount] = useState<number | "">("");
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [bestSeller, setBestSeller] = useState(false);
  const [isHero, setIsHero] = useState(false);

  // Colors & Paper
  const [primaryColor, setPrimaryColor] = useState("#1E1E1E");
  const [accentColor, setAccentColor] = useState("#10B981");
  const [bgColor, setBgColor] = useState("#FAFAF8");
  const [textColor, setTextColor] = useState("#1E1E1E");
  const [gsm, setGsm] = useState(250);
  const [finish, setFinish] = useState("Ultra-Matte Giclée");
  const [paperType, setPaperType] = useState("Fine Art Cotton Archival");
  const [tagline, setTagline] = useState("");
  const [story, setStory] = useState("");
  const [designNotes, setDesignNotes] = useState("");

  // Multiple Product Images (with publicId + sortOrder)
  const [images, setImages] = useState<
    { url: string; publicId?: string; alt: string; type: any; sortOrder: number }[]
  >([]);

  // AI Vision & Ingestion State
  const [categoryType, setCategoryType] = useState<string>("CINEMA");
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiConfidenceScores, setAiConfidenceScores] = useState<Record<string, number> | null>(null);
  const [aiDuplicateWarning, setAiDuplicateWarning] = useState<string | null>(null);

  // Duplicate Detection & Warning State
  const [duplicateConfirmModalOpen, setDuplicateConfirmModalOpen] = useState(false);
  const [duplicateFoundMatch, setDuplicateFoundMatch] = useState<any | null>(null);

  const checkDuplicatePoster = (inputTitle: string, inputFilm: string, currentId?: string) => {
    if (!inputTitle && !inputFilm) return null;
    const cleanTitle = inputTitle.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    const cleanFilm = inputFilm.toLowerCase().replace(/[^a-z0-9]/g, "").trim();

    if (!cleanTitle && !cleanFilm) return null;

    return products.find((p) => {
      if (currentId && p.id === currentId) return false;
      const pTitle = (p.title || "").toLowerCase().replace(/[^a-z0-9]/g, "").trim();
      const pFilm = (p.film || "").toLowerCase().replace(/[^a-z0-9]/g, "").trim();

      const titleMatch = cleanTitle.length > 2 && pTitle === cleanTitle;
      const filmMatch = cleanFilm.length > 2 && pFilm === cleanFilm;
      return titleMatch || filmMatch;
    });
  };

  const handleAiVisionAutoFill = async (overrideUrl?: string) => {
    const targetUrl = overrideUrl || images[0]?.url;
    if (!targetUrl) {
      alert("Please upload at least one poster image first to analyze with AI Vision.");
      return;
    }

    setIsAnalyzingAi(true);
    setAiDuplicateWarning(null);

    try {
      const res = await fetch("/api/admin/ai/vision-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: targetUrl }),
      });

      if (res.ok) {
        const { analysis } = await res.json();
        if (analysis) {
          if (analysis.categoryType) setCategoryType(analysis.categoryType);
          setTitle(analysis.title || title);
          setFilm(analysis.film || film);
          setYear(analysis.year || year);
          setDirector(analysis.director || director);
          if (analysis.collectionName) setCollectionName(analysis.collectionName);
          if (analysis.subCollectionId) setSubCollectionId(analysis.subCollectionId);
          setGenre(analysis.genre || genre);
          setStory(analysis.story || story);
          setTagline(analysis.tagline || tagline);
          if (analysis.colors?.primary) setPrimaryColor(analysis.colors.primary);
          if (analysis.colors?.accent) setAccentColor(analysis.colors.accent);
          if (analysis.colors?.bg) setBgColor(analysis.colors.bg);
          if (analysis.colors?.text) setTextColor(analysis.colors.text);
          setAiConfidenceScores(analysis.confidenceScores || null);

          if (analysis.isDuplicate) {
            setAiDuplicateWarning(analysis.duplicateWarning);
          }
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to analyze poster image with AI.");
      }
    } catch (e: any) {
      alert("Error analyzing poster: " + e.message);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        if (data.collections?.length) {
          setRawCollections(data.collections);
          setCollections(data.collections.map((c: any) => c.name));
        }
      }
    } catch (e) {
      console.error("Failed to fetch products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setTitle("");
    setSlug("");
    setFilm("");
    setYear(2024);
    setDirector("");
    const defaultCol = collections[0] || "Classic Malayalam";
    setCollectionName(defaultCol);
    setSubCollectionId("");
    fetchSubCollectionsForCollection(defaultCol);
    setGenre("Drama");
    setPrice(49);
    setInventory(20);
    setLowStockThreshold(5);
    setIsPreorder(false);
    setLimitedEditionCount("");
    setFeatured(false);
    setNewArrival(true);
    setBestSeller(false);
    setIsHero(false);
    setPrimaryColor("#1E1E1E");
    setAccentColor("#10B981");
    setBgColor("#FAFAF8");
    setTextColor("#1E1E1E");
    setGsm(250);
    setFinish("Ultra-Matte Giclée");
    setPaperType("Fine Art Cotton Archival");
    setTagline("Limited Edition Fine Art Print");
    setStory("");
    setDesignNotes("");
    setImages([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSlug(p.slug);
    setFilm(p.film);
    setYear(p.year);
    setDirector(p.director);
    setCollectionName(p.collectionName);
    setSubCollectionId(p.subCollectionId || "");
    fetchSubCollectionsForCollection(p.collectionName);
    setGenre(p.genre);
    setPrice(p.price);
    setCostPrice(p.costPrice || 60);
    setInventory(p.inventory);
    setLowStockThreshold(p.lowStockThreshold);
    setIsPreorder(p.isPreorder);
    setLimitedEditionCount(p.limitedEditionCount ?? "");
    setFeatured(p.featured);
    setNewArrival(p.newArrival);
    setBestSeller(p.bestSeller);
    setIsHero(Boolean(p.isHero));
    setPrimaryColor(p.primaryColor || "#1E1E1E");
    setAccentColor(p.accentColor || "#10B981");
    setBgColor(p.bgColor || "#FAFAF8");
    setTextColor(p.textColor || "#1E1E1E");
    setGsm(p.gsm || 250);
    setFinish(p.finish || "Ultra-Matte Giclée");
    setPaperType(p.paperType || "Fine Art Cotton Archival");
    setTagline(p.tagline || "");
    setStory(p.story || "");
    setDesignNotes(p.designNotes || "");
    setImages(
      p.images?.length
        ? p.images.map((img: any, idx: number) => ({
            url: img.url,
            publicId: img.publicId,
            alt: img.alt,
            type: img.type,
            sortOrder: img.sortOrder ?? idx,
          }))
        : []
    );
    setIsModalOpen(true);
  };

  const handleApplyAIDraft = (draft: any) => {
    if (!draft) return;

    if (draft.title && !draft.title.toLowerCase().includes("poster poster")) {
      setTitle(draft.title);
    } else if (draft.movie) {
      setTitle(`${draft.movie} Poster`);
    }

    if (draft.movie) setFilm(draft.movie);
    if (draft.year) setYear(draft.year);
    if (draft.director) setDirector(draft.director);
    if (draft.genre) setGenre(draft.genre);
    if (draft.tagline) setTagline(draft.tagline);
    if (draft.longDescription) setStory(draft.longDescription);
    if (draft.shortDescription) setDesignNotes(draft.shortDescription);
    if (draft.suggestedCollections?.[0]) {
      const match = collections.find((c) => c.toLowerCase() === draft.suggestedCollections[0].toLowerCase());
      if (match) {
        setCollectionName(match);
        fetchSubCollectionsForCollection(match);
      }
    }
  };

  const handleAddImageField = () => {
    setImages((prev) => [
      ...prev,
      {
        url: "",
        alt: title || "Product image",
        type: "GALLERY",
        sortOrder: prev.length,
      },
    ]);
  };

  const handleRemoveImageField = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Reorder Images (Move Up / Move Down)
  const handleMoveImage = (index: number, direction: "UP" | "DOWN") => {
    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Update sortOrder
    const reordered = updated.map((img, idx) => ({ ...img, sortOrder: idx }));
    setImages(reordered);
  };

  const handleSubmitProduct = (e: React.FormEvent, forceSave: boolean = false) => {
    e.preventDefault();

    const dupMatch = checkDuplicatePoster(title, film, editingProduct?.id);
    if (dupMatch && !forceSave) {
      setDuplicateFoundMatch(dupMatch);
      setDuplicateConfirmModalOpen(true);
      return;
    }

    startTransition(async () => {
      const payload: ProductInput = {
        id: editingProduct?.id,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        film,
        year,
        director,
        collectionName,
        subCollectionId: subCollectionId || null,
        genre,
        price,
        costPrice,
        inventory,
        lowStockThreshold,
        isPreorder,
        limitedEditionCount: limitedEditionCount ? Number(limitedEditionCount) : undefined,
        featured,
        newArrival,
        bestSeller,
        isHero,
        primaryColor,
        accentColor,
        bgColor,
        textColor,
        gsm,
        finish,
        paperType,
        tagline,
        story,
        designNotes,
        images: images
          .filter((img) => img.url.trim() !== "")
          .map((img, idx) => ({ ...img, sortOrder: idx })),
      };

      const res = await saveProductAction(payload);
      if (res.success) {
        setIsModalOpen(false);
        setDuplicateConfirmModalOpen(false);
        setDuplicateFoundMatch(null);
        fetchProducts();
      } else {
        alert("Error saving product: " + res.error);
      }
    });
  };

  const handleAdjustStock = (id: string, delta: number) => {
    startTransition(async () => {
      const res = await updateStockAction(id, delta);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  inventory: res.newInventory ?? p.inventory + delta,
                  isSoldOut: (res.newInventory ?? p.inventory + delta) === 0 && !p.isPreorder,
                }
              : p
          )
        );
      }
    });
  };

  const handleToggleHero = (id: string, currentIsHero: boolean) => {
    startTransition(async () => {
      const res = await toggleHeroProductAction(id, !currentIsHero);
      if (res.success) {
        fetchProducts();
      } else {
        alert("Failed to update Hero section status: " + res.error);
      }
    });
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    startTransition(async () => {
      const res = await deleteProductAction(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Error deleting product: " + res.error);
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-0.03em" }}>
            Product Catalog & Inventory
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Manage artwork inventory, gallery order, Cloudinary media, and stock limits.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
              color: "#FFF",
              border: "none",
              borderRadius: "12px",
              padding: "0.75rem 1.25rem",
              fontSize: "0.9rem",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(139, 92, 246, 0.35)",
            }}
          >
            <Sparkles size={18} /> Bulk AI Creator
          </button>
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
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </div>

      {/* Variants & Framing Banner */}
      <div
        style={{
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#ECFDF5", color: "#047857", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>Supported Product Variants</h4>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
              Sizes: <strong>A4 (21x30cm)</strong>, <strong>A3 (30x42cm)</strong>, <strong>A2 (42x59cm)</strong> • Framing: <strong>Unframed</strong>, <strong>Classic Black Wood</strong>, <strong>Natural Teak Wood</strong>
            </p>
          </div>
        </div>
        <span style={{ fontSize: "0.75rem", backgroundColor: "#E5E7EB", padding: "0.25rem 0.6rem", borderRadius: "6px", fontWeight: 700 }}>
          Global Pricing System
        </span>
      </div>

      {/* 🌟 HOMEPAGE HERO SECTION POSTERS SELECTOR CARD */}
      <div
        style={{
          backgroundColor: "#FFF",
          border: "1.5px solid #F59E0B",
          borderRadius: "18px",
          padding: "1.25rem 1.5rem",
          boxShadow: "0 4px 16px rgba(245, 158, 11, 0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "900", color: "#92400E", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Star size={20} style={{ color: "#F59E0B", fill: "#F59E0B" }} /> Homepage Hero Section Posters ({products.filter((p) => p.isHero).length} Selected)
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#78350F" }}>
              Selected posters appear in the animated fan carousel in your store's main Hero section. Click any poster below to add or remove it from the Hero section.
            </p>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, backgroundColor: "#FEF3C7", color: "#B45309", padding: "0.3rem 0.75rem", borderRadius: "8px", border: "1px solid #FCD34D" }}>
            {products.filter((p) => p.isHero).length > 0 ? `${products.filter((p) => p.isHero).length} Hero Posters Selected` : "Defaulting to Top 6 Latest Posters"}
          </span>
        </div>

        {products.filter((p) => p.isHero).length === 0 ? (
          <div style={{ padding: "1rem", textAlign: "center", backgroundColor: "#FEFCE8", borderRadius: "12px", border: "1px dashed #FDE047", color: "#A16207", fontSize: "0.82rem", fontWeight: 600 }}>
            No specific posters selected for Hero section yet. Click the <strong>"🌟 Add to Hero"</strong> button on any poster row below!
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.85rem" }}>
            {products
              .filter((p) => p.isHero)
              .map((p) => {
                const imgUrl = p.images?.find((img: any) => img.type === "HERO")?.url || p.images?.[0]?.url;
                return (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: "#FFFBEB",
                      border: "1px solid #FCD34D",
                      borderRadius: "12px",
                      padding: "0.65rem 0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    {imgUrl ? (
                      <Image src={imgUrl} alt={p.title} width={38} height={50} unoptimized style={{ objectFit: "cover", borderRadius: "6px" }} />
                    ) : (
                      <div style={{ width: "38px", height: "50px", backgroundColor: "#CBD5E1", borderRadius: "6px" }} />
                    )}
                    <div style={{ flexGrow: 1, overflow: "hidden" }}>
                      <strong style={{ fontSize: "0.82rem", color: "#92400E", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.title}
                      </strong>
                      <span style={{ fontSize: "0.72rem", color: "#B45309" }}>{p.film}</span>
                    </div>
                    <button
                      onClick={() => handleToggleHero(p.id, true)}
                      title="Remove from Hero"
                      style={{
                        background: "#FEE2E2",
                        border: "1px solid #FCA5A5",
                        color: "#DC2626",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Products Table */}
      <div style={{ backgroundColor: "#FFF", borderRadius: "16px", padding: "1.5rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Loader2 size={24} className="animate-spin" /> Loading product inventory...
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
            <Package size={40} style={{ marginBottom: "1rem", opacity: 0.5 }} />
            <p>No products found in the database. Click "Add New Product" above to create one!</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #EFECE6", color: "#666", fontWeight: "700" }}>
                <th style={{ padding: "1rem" }}>Art & Title</th>
                <th style={{ padding: "1rem" }}>Collection</th>
                <th style={{ padding: "1rem" }}>Base Price</th>
                <th style={{ padding: "1rem" }}>Stock Level</th>
                <th style={{ padding: "1rem" }}>Images</th>
                <th style={{ padding: "1rem" }}>Flags</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const isLowStock = p.inventory > 0 && p.inventory <= p.lowStockThreshold;
                const isOut = p.inventory === 0;
                const heroImg = p.images?.find((img: any) => img.type === "HERO")?.url || p.images?.[0]?.url;

                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div
                        style={{
                          width: "42px",
                          height: "56px",
                          backgroundColor: p.bgColor || "#1E1E1E",
                          borderRadius: "6px",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "1px solid #E5E7EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {heroImg ? (
                          <Image
                            src={heroImg}
                            alt={p.title}
                            width={40}
                            height={52}
                            unoptimized={heroImg.startsWith("http")}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <span style={{ fontSize: "0.5rem", color: "#FFF", fontWeight: 800 }}>
                            {p.title.substring(0, 3).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <strong style={{ fontSize: "0.95rem", color: "#111" }}>{p.title}</strong>
                        <div style={{ fontSize: "0.75rem", color: "#666" }}>
                          {p.film} ({p.year}) • Dir. {p.director}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontSize: "0.75rem", backgroundColor: "#F3F4F6", padding: "0.25rem 0.6rem", borderRadius: "6px", fontWeight: "600" }}>
                        {p.collectionName}
                      </span>
                    </td>

                    <td style={{ padding: "1rem", fontWeight: "800" }}>₹{p.price}</td>

                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <button
                            onClick={() => handleAdjustStock(p.id, -1)}
                            style={{ cursor: "pointer", border: "1px solid #E5E7EB", background: "#FFF", borderRadius: "4px", padding: "2px 6px" }}
                          >
                            <Minus size={12} />
                          </button>
                          <strong style={{ minWidth: "24px", textAlign: "center" }}>{p.inventory}</strong>
                          <button
                            onClick={() => handleAdjustStock(p.id, 1)}
                            style={{ cursor: "pointer", border: "1px solid #E5E7EB", background: "#FFF", borderRadius: "4px", padding: "2px 6px" }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        {isLowStock && (
                          <span style={{ fontSize: "0.65rem", fontWeight: "800", color: "#D97706", backgroundColor: "#FEF3C7", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                            LOW
                          </span>
                        )}
                        {isOut && !p.isPreorder && (
                          <span style={{ fontSize: "0.65rem", fontWeight: "800", color: "#DC2626", backgroundColor: "#FEE2E2", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                            SOLD OUT
                          </span>
                        )}
                        {p.isPreorder && (
                          <span style={{ fontSize: "0.65rem", fontWeight: "800", color: "#2563EB", backgroundColor: "#DBEAFE", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                            PREORDER
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "#555", display: "flex", alignItems: "center", gap: "4px" }}>
                        <ImageIcon size={14} /> {p.images?.length || 0} assets
                      </span>
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {p.featured && <span style={{ fontSize: "0.65rem", backgroundColor: "#ECFDF5", color: "#047857", fontWeight: 700, padding: "2px 6px", borderRadius: "4px" }}>Featured</span>}
                        {p.bestSeller && <span style={{ fontSize: "0.65rem", backgroundColor: "#FEF3C7", color: "#B45309", fontWeight: 700, padding: "2px 6px", borderRadius: "4px" }}>Best Seller</span>}
                      </div>
                    </td>

                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", alignItems: "center" }}>
                        <button
                          onClick={() => handleToggleHero(p.id, Boolean(p.isHero))}
                          disabled={isPending}
                          style={{
                            border: p.isHero ? "1.5px solid #F59E0B" : "1px solid #CBD5E1",
                            background: p.isHero ? "#FEF3C7" : "#FFF",
                            color: p.isHero ? "#92400E" : "#475569",
                            borderRadius: "8px",
                            padding: "0.4rem 0.75rem",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          title={p.isHero ? "Remove from Hero Section" : "Show in Homepage Hero Section"}
                        >
                          <Star size={14} style={{ color: p.isHero ? "#D97706" : "#94A3B8", fill: p.isHero ? "#D97706" : "none" }} />
                          {p.isHero ? "Hero Active" : "Add to Hero"}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          style={{ border: "1px solid #E5E7EB", background: "#FFF", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer" }}
                          title="Edit Product"
                        >
                          <Edit size={16} style={{ color: "#3B82F6" }} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          style={{ border: "1px solid #FEE2E2", background: "#FEF2F2", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer" }}
                          title="Delete Product"
                        >
                          <Trash2 size={16} style={{ color: "#EF4444" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
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
              maxWidth: "860px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #EFECE6" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "800" }}>
                  {editingProduct ? "Edit Product Listing" : "Add New Poster Artwork"}
                </h2>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
                  Configure product details, Cloudinary gallery order, pricing, and paper specs.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitProduct} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* AI VISION AUTO-FILL TOOLBAR & WARNINGS */}
              <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: "16px", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Sparkles size={18} style={{ color: "#10B981" }} />
                    <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#065F46" }}>
                      AI Vision & OCR Auto-Fill Assistant
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAiVisionAutoFill()}
                    disabled={isAnalyzingAi}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "100px",
                      border: "none",
                      backgroundColor: "#10B981",
                      color: "#FFF",
                      fontWeight: "800",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
                    }}
                  >
                    {isAnalyzingAi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Auto-Fill Fields with AI
                  </button>
                </div>

                {/* Duplicate Warning */}
                {aiDuplicateWarning && (
                  <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2", color: "#DC2626", borderRadius: "8px", padding: "0.6rem 0.85rem", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                    <AlertTriangle size={16} /> {aiDuplicateWarning}
                  </div>
                )}

                {/* Confidence Score Pill Indicators */}
                {aiConfidenceScores && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#047857" }}>AI Confidence Scores:</span>
                    {Object.entries(aiConfidenceScores).map(([key, score]) => (
                      <span
                        key={key}
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "6px",
                          backgroundColor: score >= 0.9 ? "#D1FAE5" : score >= 0.7 ? "#FEF3C7" : "#FEE2E2",
                          color: score >= 0.9 ? "#065F46" : score >= 0.7 ? "#92400E" : "#991B1B",
                        }}
                      >
                        {key}: {Math.round(score * 100)}%
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Single Source of Truth for Hero Poster Image URL */}
              {(() => {
                const heroImageUrl = images.find((img) => img.type === "HERO")?.url || images[0]?.url || "";
                return (
                  <AIAssistantModule
                    imageUrl={heroImageUrl}
                    onApplyAIDraft={handleApplyAIDraft}
                  />
                );
              })()}

              {/* Row 1: Title & Slug */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Product Title *</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter product title..." style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
                  {(() => {
                    const liveDup = checkDuplicatePoster(title, film, editingProduct?.id);
                    if (!liveDup) return null;
                    return (
                      <div style={{ backgroundColor: "#FEF3C7", border: "1px solid #F59E0B", color: "#92400E", padding: "0.5rem 0.75rem", borderRadius: "8px", marginTop: "0.4rem", fontSize: "0.78rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                        <AlertTriangle size={16} style={{ color: "#D97706", flexShrink: 0 }} />
                        <span>
                          <strong>Duplicate Warning:</strong> A poster titled <u>"{liveDup.title}"</u> ({liveDup.film}) already exists!
                        </span>
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>URL Slug (auto-generated if empty)</label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. poster-slug" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
                </div>
              </div>

              {/* Row 2: Film / Subject, Year / Season, Director / Studio */}
              {(() => {
                const isNonCinema = categoryType === "SPORTS" || categoryType === "FINE_ART" || categoryType === "MUSIC" || collectionName.toLowerCase().includes("sport") || collectionName.toLowerCase().includes("art");
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>
                        {isNonCinema ? "Athlete / Subject / Team" : "Film Name *"}
                      </label>
                      <input
                        type="text"
                        required={!isNonCinema}
                        value={film}
                        onChange={(e) => setFilm(e.target.value)}
                        placeholder={isNonCinema ? "e.g. Lionel Messi - Argentina" : "Enter film title..."}
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>
                        {isNonCinema ? "Season / Year (Optional)" : "Release Year *"}
                      </label>
                      <input
                        type="number"
                        required={!isNonCinema}
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        placeholder="e.g. 2024"
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>
                        {isNonCinema ? "League / Event / Studio (Optional)" : "Director *"}
                      </label>
                      <input
                        type="text"
                        required={!isNonCinema}
                        value={director}
                        onChange={(e) => setDirector(e.target.value)}
                        placeholder={isNonCinema ? "e.g. FIFA World Cup Qatar" : "Enter director name..."}
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Row 3: Collection, SubCollection, Genre, Price, Cost Price */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Collection *</label>
                  <select value={collectionName} onChange={(e) => handleCollectionNameChange(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}>
                    {collections.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Sub Collection</label>
                  <select value={subCollectionId} onChange={(e) => setSubCollectionId(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem", backgroundColor: "#FFF" }}>
                    <option value="">None (Top-Level Only)</option>
                    {subCollections.map((sub: any) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Genre *</label>
                  <input type="text" required value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Drama" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Selling Price (₹) *</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="350" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#059669" }}>Cost Expense (₹) *</label>
                  <input type="number" required value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} placeholder="60" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #A7F3D0", backgroundColor: "#ECFDF5", fontSize: "0.9rem", fontWeight: 700, color: "#047857" }} />
                </div>
              </div>

              {/* Row 4: Inventory & Stock Rules */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Inventory Stock *</label>
                  <input type="number" required value={inventory} onChange={(e) => setInventory(Number(e.target.value))} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Low Stock Alert</label>
                  <input type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(Number(e.target.value))} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Edition Limit</label>
                  <input type="number" value={limitedEditionCount} onChange={(e) => setLimitedEditionCount(e.target.value ? Number(e.target.value) : "")} placeholder="e.g. 500" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingTop: "1.5rem" }}>
                  <input type="checkbox" id="preorder" checked={isPreorder} onChange={(e) => setIsPreorder(e.target.checked)} />
                  <label htmlFor="preorder" style={{ fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>Preorder Mode</label>
                </div>
              </div>

              {/* Gallery Reordering & Cloudinary Upload Section */}
              <div style={{ border: "1px solid #E5E7EB", borderRadius: "16px", padding: "1.25rem", backgroundColor: "#F9FAFB" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ImageIcon size={18} /> Cloudinary Gallery & Visual Reordering
                    </h4>
                    <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#666" }}>
                      Use ▲ and ▼ to reorder gallery assets. Position #1 is the primary storefront hero.
                    </p>
                  </div>
                  <button type="button" onClick={handleAddImageField} style={{ fontSize: "0.8rem", backgroundColor: "#FFF", border: "1px solid #CBD5E1", padding: "0.35rem 0.75rem", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>
                    + Add Image Asset
                  </button>
                </div>

                {images.length === 0 ? (
                  <div
                    style={{
                      border: "2px dashed #CBD5E1",
                      borderRadius: "16px",
                      padding: "2rem 1.5rem",
                      textAlign: "center",
                      backgroundColor: "#FFF",
                    }}
                  >
                    <ImageIcon size={40} style={{ color: "#94A3B8", marginBottom: "0.75rem" }} />
                    <h4 style={{ margin: "0 0 0.4rem 0", fontSize: "1.1rem", fontWeight: "800", color: "#0F172A" }}>
                      Upload a Hero Poster
                    </h4>
                    <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.85rem", color: "#64748B" }}>
                      No poster uploaded yet. Upload a high-resolution poster to activate the AI Product Assistant.
                    </p>
                    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                      <ImageUploader
                        value=""
                        onChange={(url, publicId) => {
                          console.log("[FLOW AUDIT 1: ImageUploader Uploaded Hero Poster]", { secure_url: url, public_id: publicId });
                          setImages([{ url, publicId, alt: title || "Hero Poster", type: "HERO", sortOrder: 0 }]);
                        }}
                        label="Upload Primary Hero Poster"
                      />
                    </div>
                  </div>
                ) : (
                  images.map((img, idx) => (
                  <div key={idx} style={{ border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem", backgroundColor: "#FFF", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ backgroundColor: "#1E293B", color: "#FFF", fontSize: "0.7rem", fontWeight: 800, padding: "2px 8px", borderRadius: "12px" }}>
                          ORDER #{idx + 1}
                        </span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569" }}>
                          Slot: {img.type}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveImage(idx, "UP")}
                          title="Move Up in Gallery"
                          style={{
                            border: "1px solid #CBD5E1",
                            background: idx === 0 ? "#F1F5F9" : "#FFF",
                            color: idx === 0 ? "#94A3B8" : "#1E293B",
                            borderRadius: "6px",
                            padding: "0.25rem 0.4rem",
                            cursor: idx === 0 ? "not-allowed" : "pointer",
                          }}
                        >
                          <ArrowUp size={14} />
                        </button>
                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={idx === images.length - 1}
                          onClick={() => handleMoveImage(idx, "DOWN")}
                          title="Move Down in Gallery"
                          style={{
                            border: "1px solid #CBD5E1",
                            background: idx === images.length - 1 ? "#F1F5F9" : "#FFF",
                            color: idx === images.length - 1 ? "#94A3B8" : "#1E293B",
                            borderRadius: "6px",
                            padding: "0.25rem 0.4rem",
                            cursor: idx === images.length - 1 ? "not-allowed" : "pointer",
                          }}
                        >
                          <ArrowDown size={14} />
                        </button>
                        {images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImageField(idx)}
                            style={{
                              background: "#FEE2E2",
                              border: "none",
                              color: "#EF4444",
                              borderRadius: "6px",
                              padding: "0.25rem 0.5rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              marginLeft: "0.5rem",
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr", gap: "1rem", alignItems: "start" }}>
                      <ImageUploader
                        label={`Upload Poster File`}
                        value={img.url}
                        publicId={img.publicId}
                        folder={img.type || "GALLERY"}
                        onChange={(newUrl, newPublicId) => {
                          const updated = [...images];
                          updated[idx].url = newUrl;
                          if (newPublicId) updated[idx].publicId = newPublicId;
                          setImages(updated);
                        }}
                      />

                      <div>
                        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Folder Slot</label>
                        <select
                          value={img.type}
                          onChange={(e) => {
                            const updated = [...images];
                            updated[idx].type = e.target.value;
                            setImages(updated);
                          }}
                          style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}
                        >
                          <option value="HERO">HERO (Main Banner)</option>
                          <option value="GALLERY">GALLERY (Product View)</option>
                          <option value="WALL_MOCKUP">WALL_MOCKUP (Interior)</option>
                          <option value="PACKAGING">PACKAGING (Box view)</option>
                          <option value="DETAIL">DETAIL (Close-up)</option>
                          <option value="MOBILE">MOBILE (Portrait)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Alt Description</label>
                        <input
                          type="text"
                          placeholder="Alt text"
                          value={img.alt}
                          onChange={(e) => {
                            const updated = [...images];
                            updated[idx].alt = e.target.value;
                            setImages(updated);
                          }}
                          style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
              </div>

              {/* Checkboxes: Flags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", color: "#D97706" }}>
                  <input type="checkbox" checked={isHero} onChange={(e) => setIsHero(e.target.checked)} /> 🌟 Show in Homepage Hero Section
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured on Homepage
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={newArrival} onChange={(e) => setNewArrival(e.target.checked)} /> New Arrival Tag
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} /> Best Seller Tag
                </label>
              </div>

              {/* Submit Button */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid #EFECE6" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "12px", border: "1px solid #E5E7EB", background: "#FFF", fontWeight: 700, cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isPending} style={{ padding: "0.75rem 2rem", borderRadius: "12px", border: "none", background: "#10B981", color: "#FFF", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {isPending ? <Loader2 size={18} className="animate-spin" /> : "Save Product Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✨ BULK POSTER CREATOR & IMPORTER MODAL */}
      <BulkPosterModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        collections={rawCollections}
        onComplete={fetchProducts}
      />

      {/* ⚠️ DUPLICATE POSTER WARNING DIALOG */}
      {duplicateConfirmModalOpen && duplicateFoundMatch && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setDuplicateConfirmModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FFF",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "520px",
              padding: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
              border: "2px solid #F59E0B",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "#D97706" }}>
              <AlertTriangle size={28} />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 900, color: "#0F172A" }}>
                Duplicate Poster Warning
              </h3>
            </div>

            <p style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", color: "#334155", lineHeight: "1.5" }}>
              This poster is already added to the website catalog!
            </p>

            {/* Existing Poster Info Card */}
            <div style={{ backgroundColor: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: "14px", padding: "1rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
              {duplicateFoundMatch.heroImage ? (
                <Image src={duplicateFoundMatch.heroImage} alt="Existing Poster" width={54} height={70} unoptimized style={{ objectFit: "cover", borderRadius: "8px" }} />
              ) : (
                <div style={{ width: "54px", height: "70px", backgroundColor: "#CBD5E1", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ImageIcon size={20} style={{ color: "#64748B" }} />
                </div>
              )}
              <div style={{ flexGrow: 1 }}>
                <strong style={{ fontSize: "0.95rem", color: "#92400E", display: "block" }}>{duplicateFoundMatch.title}</strong>
                <div style={{ fontSize: "0.8rem", color: "#B45309" }}>Film: {duplicateFoundMatch.film} ({duplicateFoundMatch.year})</div>
                <div style={{ fontSize: "0.75rem", color: "#B45309", marginTop: "2px" }}>Collection: {duplicateFoundMatch.collectionName} • Price: ₹{duplicateFoundMatch.price}</div>
              </div>
            </div>

            <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A" }}>
              Do you want to continue creating/saving this duplicate poster listing?
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setDuplicateConfirmModalOpen(false)}
                style={{
                  padding: "0.7rem 1.25rem",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFF",
                  color: "#334155",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Cancel & Review
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmitProduct(e as any, true)}
                disabled={isPending}
                style={{
                  padding: "0.7rem 1.25rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#D97706",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save Duplicate Poster Anyway"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
