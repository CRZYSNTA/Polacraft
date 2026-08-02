'use client';

import React, { useContext, useState, useMemo, useEffect, Suspense } from "react";
import { AppContext } from "../../features/cart/AppContext";
import PosterRenderer from "../../components/PosterRenderer";
import { collections as staticCollections, sizes } from "../../lib/cms/products";
import { Product } from "../../types";
import { StoreCollectionItem } from "@/lib/cms";
import { Filter, Search, Heart, ShoppingBag, Eye, X, LayoutGrid, Compass, BookOpen, SlidersHorizontal, CornerDownRight, Layers } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const STATIC_POSTER_MAP: Record<string, string> = {
  manichitrathazhu: "/assets/posters/manichitrathazhu-original-polacraft.png",
  "kumbalangi-nights": "/assets/posters/kumbalangi-original-polacraft.png",
  aavesham: "/assets/posters/aavesham-original-polacraft.png",
  thoovanathumbikal: "/assets/posters/thoovanathumbikal-original-polacraft.png",
  spadikam: "/assets/posters/spadikam-original-polacraft.png",
  premam: "/assets/posters/premam-original-polacraft.png",
  sandesham: "/assets/posters/sandesham-original-polacraft.png",
  mathilukal: "/assets/posters/mathilukal-original-polacraft.png",
  kireedam: "/assets/posters/kireedam-original-polacraft.png",
};

function mapDbProductToPoster(p: any): Product {
  const staticFallback = STATIC_POSTER_MAP[p.slug] || STATIC_POSTER_MAP[p.slug?.toLowerCase()];

  const heroImage =
    p.images?.find((img: any) => img.type === "HERO")?.url ||
    p.images?.[0]?.url ||
    staticFallback ||
    null;

  const galleryImages = p.images?.length
    ? p.images.map((img: any) => img.url)
    : heroImage
    ? [heroImage]
    : [];

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    film: p.film || p.title,
    tagline: p.tagline || "Handcrafted Archival Cinema Print",
    year: p.year || 1993,
    director: p.director || "Polacraft Studio",
    cast: Array.isArray(p.cast) && p.cast.length > 0 ? p.cast : ["Mohanlal"],
    collection: p.collectionName || p.collection?.name || "Classic Malayalam",
    genre: p.genre || "Drama",
    palette: {
      primary: p.primaryColor || "#E6C15C",
      accent: p.accentColor || "#802720",
      bg: p.bgColor || "#FAFAF8",
      text: p.textColor || "#1A1A1A",
    },
    story: p.story || "Museum-quality archival fine art poster print.",
    designNotes: p.designNotes || "High contrast archival cotton paper print.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "black", "white"],
    paperType: p.paperType || "Fine Art Cotton Archival",
    gsm: p.gsm || 250,
    finish: p.finish || "Ultra-Matte Giclée",
    price: p.price || 49,
    inventory: p.inventory ?? 25,
    lowStockThreshold: p.lowStockThreshold || 5,
    isPreorder: Boolean(p.isPreorder),
    limitedEditionCount: p.limitedEditionCount || 150,
    isSoldOut: p.inventory === 0 && !p.isPreorder,
    seoTitle: `${p.title} Poster | Polacraft Studio`,
    seoDescription: p.story || `Fine art poster of ${p.title}`,
    galleryImages: galleryImages,
    wallMockups: ["/assets/living_room_mockup.png"],
  };
}

export default function ShopClient({
  initialPosters = [],
  initialCollections = [],
}: {
  initialPosters?: Product[];
  initialCollections?: StoreCollectionItem[];
}) {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    openQuickView
  } = useContext(AppContext);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial filter from URL if present (e.g. ?filter=Classic)
  const initialFilter = searchParams.get("filter");

  const [posters, setPosters] = useState<Product[]>(initialPosters);
  const [storeCollections, setStoreCollections] = useState<StoreCollectionItem[]>(initialCollections);
  const [activeSubCollection, setActiveSubCollection] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState("shop"); // "shop", "gallery", or "story"
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [cardSizes, setCardSizes] = useState<Record<string, string>>({});
  const itemsPerPage = 12;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCardSizeChange = (posterId: string, sizeId: string) => {
    setCardSizes((prev) => ({ ...prev, [posterId]: sizeId }));
  };

  const [activeFilters, setActiveFilters] = useState({
    collection: initialFilter ? `${initialFilter} Malayalam` : "All Collections",
    priceRange: 500,
    actor: "All",
    director: "All",
    sort: "default"
  });

  // Background refresh of live catalog & collections
  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch(`/api/search?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.products && Array.isArray(data.products)) {
            setPosters(data.products.map(mapDbProductToPoster));
          }
        }
      } catch (e) {
        console.warn("[Shop Live Products Fetch Warning]:", e);
      }
    }

    async function loadLiveCollections() {
      try {
        const res = await fetch(`/api/admin/collections?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.collections && Array.isArray(data.collections)) {
            setStoreCollections(data.collections);
          }
        }
      } catch (e) {
        console.warn("[Shop Live Collections Fetch Warning]:", e);
      }
    }

    loadLiveProducts();
    loadLiveCollections();
  }, []);

  // Compute top-level collections for sidebar
  const topLevelCollections = useMemo(() => {
    if (storeCollections.length === 0) {
      return staticCollections.map((name) => ({ id: name, name, subCollections: [] }));
    }
    return storeCollections.filter((c) => !c.parentId);
  }, [storeCollections]);

  // Find active parent collection object
  const activeParentColObj = useMemo(() => {
    if (activeFilters.collection === "All Collections") return null;
    return storeCollections.find(
      (c) => c.name.toLowerCase() === activeFilters.collection.toLowerCase()
    );
  }, [storeCollections, activeFilters.collection]);

  // Sub-collections under active parent collection
  const currentSubCollections = useMemo(() => {
    if (!activeParentColObj) return [];
    return activeParentColObj.subCollections || [];
  }, [activeParentColObj]);

  // Unique values for filter picks
  const uniqueActors = useMemo(() => {
    const actors = new Set<string>();
    posters.forEach((p) => p.cast.forEach((act) => actors.add(act)));
    return ["All", ...Array.from(actors)];
  }, [posters]);

  const uniqueDirectors = useMemo(() => {
    const dirs = new Set<string>();
    posters.forEach((p) => dirs.add(p.director));
    return ["All", ...Array.from(dirs)];
  }, [posters]);

  // Filter & Search Logic
  const filteredPosters = useMemo(() => {
    return posters.filter((poster) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        poster.title.toLowerCase().includes(q) ||
        poster.film.toLowerCase().includes(q) ||
        poster.director.toLowerCase().includes(q) ||
        poster.cast.some((actor) => actor.toLowerCase().includes(q)) ||
        poster.tagline.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // 2. Collection & Sub-Collection Filter
      if (activeFilters.collection !== "All Collections") {
        const posterCol = poster.collection.toLowerCase();

        if (activeSubCollection !== "ALL") {
          // Specific Sub-Collection Active
          if (!posterCol.includes(activeSubCollection.toLowerCase())) {
            return false;
          }
        } else {
          // Parent Collection Active: Match parent collection OR any nested sub-collection name
          const allowedNames = new Set<string>();
          allowedNames.add(activeFilters.collection.toLowerCase());

          if (activeParentColObj?.subCollections?.length) {
            activeParentColObj.subCollections.forEach((sub) => {
              allowedNames.add(sub.name.toLowerCase());
            });
          }

          const matchesCollection = Array.from(allowedNames).some(
            (name) => posterCol.includes(name) || name.includes(posterCol)
          );

          if (!matchesCollection) return false;
        }
      }

      // 3. Actor Filter
      if (activeFilters.actor !== "All" && !poster.cast.includes(activeFilters.actor)) {
        return false;
      }

      // 4. Director Filter
      if (activeFilters.director !== "All" && poster.director !== activeFilters.director) {
        return false;
      }

      // 5. Price Filter
      if (poster.price > activeFilters.priceRange) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (activeFilters.sort === "price-low") return a.price - b.price;
      if (activeFilters.sort === "price-high") return b.price - a.price;
      if (activeFilters.sort === "year-desc") return b.year - a.year;
      if (activeFilters.sort === "year-asc") return a.year - b.year;
      return 0; // Default order
    });
  }, [posters, searchQuery, activeFilters, activeSubCollection, activeParentColObj]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosters.length / itemsPerPage);
  const currentPosters = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPosters.slice(start, start + itemsPerPage);
  }, [filteredPosters, currentPage]);

  const handleFilterChange = (filterType: string, value: any) => {
    setActiveFilters((prev) => ({ ...prev, [filterType]: value }));
    if (filterType === "collection") {
      setActiveSubCollection("ALL");
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({
      collection: "All Collections",
      priceRange: 500,
      actor: "All",
      director: "All",
      sort: "default"
    });
    setActiveSubCollection("ALL");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh", paddingBottom: "5rem" }}>
      
      {/* 1. HERO HEADER SECTION */}
      <section
        style={{
          paddingTop: "7.5rem",
          paddingBottom: "3rem",
          backgroundColor: "#111111",
          color: "#FAFAF8",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.15), transparent 70%)",
            pointerEvents: "none"
          }}
        />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "#D4AF37", fontWeight: "700" }}>
            The Polacraft Vault
          </span>
          <h1 style={{ fontSize: isMobile ? "2.5rem" : "3.75rem", fontWeight: "900", letterSpacing: "-0.04em", margin: "0.75rem 0 1rem 0" }}>
            Cinema Art Exhibition
          </h1>
          <p style={{ maxWidth: "650px", margin: "0 auto", fontSize: "1.05rem", color: "#A0A0A0", lineHeight: "1.6" }}>
            Museum-grade 250 GSM Giclée prints celebrating legendary Malayalam cinematic masterpieces, original posters, and vintage art editions.
          </p>
        </div>
      </section>

      {/* 2. FILTER & SEARCH CONTROL BAR */}
      <div style={{ maxWidth: "1350px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        
        {/* TOP SEARCH & VIEW MODE TOOLBAR */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.25rem",
            marginBottom: "2.5rem",
            backgroundColor: "#FFFFFF",
            padding: "1.25rem 1.75rem",
            borderRadius: "20px",
            border: "1px solid rgba(17,17,17,0.08)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
          }}
        >
          {/* SEARCH INPUT */}
          <div style={{ position: "relative", flex: "1 1 300px", maxWidth: "450px" }}>
            <Search size={18} style={{ position: "absolute", left: "1.1rem", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search films, actors, directors, dialogues..."
              style={{
                width: "100%",
                padding: "0.8rem 1rem 0.8rem 2.8rem",
                borderRadius: "100px",
                border: "1px solid rgba(17,17,17,0.12)",
                fontSize: "0.9rem",
                outline: "none",
                backgroundColor: "#FAFAFA"
              }}
            />
            {searchQuery && (
              <X
                size={16}
                onClick={() => setSearchQuery("")}
                style={{ position: "absolute", right: "1.1rem", top: "50%", transform: "translateY(-50%)", color: "#888", cursor: "pointer" }}
              />
            )}
          </div>

          {/* VIEW MODES */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={() => setViewMode("shop")}
              style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "100px",
                border: "none",
                backgroundColor: viewMode === "shop" ? "#111" : "#F3F3F0",
                color: viewMode === "shop" ? "#FFF" : "#555",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <LayoutGrid size={15} /> Shop Grid
            </button>

            <button
              onClick={() => setViewMode("gallery")}
              style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "100px",
                border: "none",
                backgroundColor: viewMode === "gallery" ? "#111" : "#F3F3F0",
                color: viewMode === "gallery" ? "#FFF" : "#555",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <Compass size={15} /> Visual Gallery
            </button>

            <button
              onClick={() => setViewMode("story")}
              style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "100px",
                border: "none",
                backgroundColor: viewMode === "story" ? "#111" : "#F3F3F0",
                color: viewMode === "story" ? "#FFF" : "#555",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <BookOpen size={15} /> Film Lore
            </button>
          </div>

          {/* MOBILE FILTER TRIGGER */}
          {isMobile && (
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "100px",
                border: "1.5px solid #111",
                backgroundColor: "#111",
                color: "#FFF",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          )}
        </div>

        {/* MAIN LAYOUT: SIDEBAR FILTERS + PRODUCTS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "260px 1fr", gap: "2.5rem" }}>
          
          {/* SIDEBAR FILTERS (DESKTOP) */}
          {!isMobile && (
            <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ backgroundColor: "#FFFFFF", padding: "1.75rem", borderRadius: "24px", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Filter size={16} /> Filter Gallery
                  </h3>
                  <button
                    onClick={clearFilters}
                    style={{ background: "none", border: "none", color: "#888", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600", textDecoration: "underline" }}
                  >
                    Reset All
                  </button>
                </div>

                {/* COLLECTIONS & SUB-COLLECTIONS HIERARCHY FILTER */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", display: "block", marginBottom: "0.75rem" }}>
                    Collections
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    
                    {/* All Collections Button */}
                    <button
                      onClick={() => handleFilterChange("collection", "All Collections")}
                      style={{
                        textAlign: "left",
                        padding: "0.55rem 0.85rem",
                        borderRadius: "10px",
                        border: "none",
                        backgroundColor: activeFilters.collection === "All Collections" ? "#111" : "transparent",
                        color: activeFilters.collection === "All Collections" ? "#FFF" : "#444",
                        fontSize: "0.85rem",
                        fontWeight: activeFilters.collection === "All Collections" ? "700" : "500",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      All Collections
                    </button>

                    {/* Top Level Parent Collections & Sub-Collections */}
                    {topLevelCollections.map((col: any) => {
                      const colName = typeof col === "string" ? col : col.name;
                      const isSelected = activeFilters.collection === colName;
                      const subCols = col.subCollections || [];

                      return (
                        <div key={colName} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                          <button
                            onClick={() => handleFilterChange("collection", colName)}
                            style={{
                              textAlign: "left",
                              padding: "0.55rem 0.85rem",
                              borderRadius: "10px",
                              border: "none",
                              backgroundColor: isSelected ? "#111" : "transparent",
                              color: isSelected ? "#FFF" : "#444",
                              fontSize: "0.85rem",
                              fontWeight: isSelected ? "700" : "500",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <span>{colName}</span>
                            {subCols.length > 0 && (
                              <span style={{ fontSize: "0.7rem", opacity: isSelected ? 0.9 : 0.6 }}>
                                ({subCols.length})
                              </span>
                            )}
                          </button>

                          {/* Nested Sub-Collections */}
                          {subCols.map((sub: any) => {
                            const isSubActive = activeSubCollection === sub.name;
                            return (
                              <button
                                key={sub.id || sub.name}
                                onClick={() => {
                                  handleFilterChange("collection", colName);
                                  setActiveSubCollection(sub.name);
                                }}
                                style={{
                                  textAlign: "left",
                                  padding: "0.4rem 0.85rem 0.4rem 1.6rem",
                                  borderRadius: "8px",
                                  border: "none",
                                  backgroundColor: isSubActive ? "#F0FDF4" : "transparent",
                                  color: isSubActive ? "#065F46" : "#64748B",
                                  fontSize: "0.8rem",
                                  fontWeight: isSubActive ? "700" : "500",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.35rem",
                                  transition: "all 0.15s ease"
                                }}
                              >
                                <CornerDownRight size={12} style={{ color: isSubActive ? "#10B981" : "#94A3B8" }} />
                                {sub.name}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SORT BY */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", display: "block", marginBottom: "0.75rem" }}>
                    Sort Artwork
                  </label>
                  <select
                    value={activeFilters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid rgba(17,17,17,0.15)",
                      fontSize: "0.85rem",
                      outline: "none",
                      backgroundColor: "#FAFAFA"
                    }}
                  >
                    <option value="default">Featured Curated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="year-desc">Release: Newest First</option>
                    <option value="year-asc">Release: Vintage Classics</option>
                  </select>
                </div>

                {/* ACTOR FILTER */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", display: "block", marginBottom: "0.75rem" }}>
                    Lead Actor / Cast
                  </label>
                  <select
                    value={activeFilters.actor}
                    onChange={(e) => handleFilterChange("actor", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid rgba(17,17,17,0.15)",
                      fontSize: "0.85rem",
                      outline: "none",
                      backgroundColor: "#FAFAFA"
                    }}
                  >
                    {uniqueActors.map((act) => (
                      <option key={act} value={act}>{act}</option>
                    ))}
                  </select>
                </div>

                {/* DIRECTOR FILTER */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", display: "block", marginBottom: "0.75rem" }}>
                    Filmmaker / Director
                  </label>
                  <select
                    value={activeFilters.director}
                    onChange={(e) => handleFilterChange("director", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid rgba(17,17,17,0.15)",
                      fontSize: "0.85rem",
                      outline: "none",
                      backgroundColor: "#FAFAFA"
                    }}
                  >
                    {uniqueDirectors.map((dir) => (
                      <option key={dir} value={dir}>{dir}</option>
                    ))}
                  </select>
                </div>

              </div>
            </aside>
          )}

          {/* PRODUCTS GALLERY GRID */}
          <main>
            {/* SUB-COLLECTION HEADER PILLS BAR (Shown when a parent collection with subcollections is active) */}
            {currentSubCollections.length > 0 && (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "1rem 1.25rem",
                  marginBottom: "1.75rem",
                  border: "1px solid rgba(17,17,17,0.08)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Layers size={14} style={{ color: "#10B981" }} />
                  Sub-Collections in "{activeFilters.collection}":
                </div>

                <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "2px" }}>
                  <button
                    onClick={() => setActiveSubCollection("ALL")}
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      padding: "0.4rem 0.85rem",
                      borderRadius: "100px",
                      border: activeSubCollection === "ALL" ? "1.5px solid #111" : "1px solid #E2E8F0",
                      backgroundColor: activeSubCollection === "ALL" ? "#111" : "#F8FAFC",
                      color: activeSubCollection === "ALL" ? "#FFF" : "#475569",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    All {activeFilters.collection}
                  </button>

                  {currentSubCollections.map((sub: any) => {
                    const isSelected = activeSubCollection === sub.name;
                    return (
                      <button
                        key={sub.id || sub.name}
                        onClick={() => setActiveSubCollection(sub.name)}
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          padding: "0.4rem 0.85rem",
                          borderRadius: "100px",
                          border: isSelected ? "1.5px solid #10B981" : "1px solid #E2E8F0",
                          backgroundColor: isSelected ? "#10B981" : "#F8FAFC",
                          color: isSelected ? "#FFF" : "#475569",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CornerDownRight size={12} />
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentPosters.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 1rem", backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid rgba(17,17,17,0.08)" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>No Cinema Art Found</h3>
                <p style={{ color: "#666", fontSize: "0.95rem" }}>Try adjusting your search query or reset active filters.</p>
                <button
                  onClick={clearFilters}
                  style={{ marginTop: "1.25rem", padding: "0.75rem 1.5rem", borderRadius: "100px", backgroundColor: "#111", color: "#FFF", border: "none", fontWeight: "700", cursor: "pointer" }}
                >
                  Reset Catalog Filters
                </button>
              </div>
            ) : (
              <>
                {/* MODE 1: STANDARD SHOP GRID */}
                {viewMode === "shop" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
                    {currentPosters.map((poster) => {
                      const isWish = wishlist.includes(poster.id);
                      const selectedSize = cardSizes[poster.id] || "A5";
                      const currentSizeObj = sizes.find((s) => s.id === selectedSize) || sizes[0];
                      const displayPrice = poster.price + currentSizeObj.priceModifier;

                      return (
                        <div
                          key={poster.id}
                          style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "20px",
                            padding: "1.25rem",
                            border: "1px solid rgba(17,17,17,0.06)",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.02)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease"
                          }}
                          className="hover-card"
                        >
                          <div>
                            {/* POSTER RENDERER PREVIEW */}
                            <div
                              onClick={() => router.push(`/product/${poster.slug}`)}
                              style={{ cursor: "pointer", position: "relative", marginBottom: "1.25rem", overflow: "hidden", borderRadius: "12px" }}
                            >
                              <PosterRenderer poster={poster} selectedSize={selectedSize} />

                              {/* WISHLIST BUTTON */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(poster.id);
                                }}
                                style={{
                                  position: "absolute",
                                  top: "0.75rem",
                                  right: "0.75rem",
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgba(255,255,255,0.9)",
                                  backdropFilter: "blur(4px)",
                                  border: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  color: isWish ? "#EF4444" : "#111"
                                }}
                              >
                                <Heart size={18} fill={isWish ? "#EF4444" : "none"} />
                              </button>

                              {/* QUICK VIEW TRIGGER */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openQuickView(poster);
                                }}
                                style={{
                                  position: "absolute",
                                  bottom: "0.75rem",
                                  right: "0.75rem",
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgba(17,17,17,0.85)",
                                  color: "#FFF",
                                  border: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                                }}
                                title="Quick View Artwork"
                              >
                                <Eye size={18} />
                              </button>
                            </div>

                            {/* TITLE & DETAILS */}
                            <Link href={`/product/${poster.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: "0 0 0.25rem 0", color: "#111" }}>
                                {poster.title}
                              </h3>
                            </Link>

                            <p style={{ fontSize: "0.85rem", color: "#666", margin: "0 0 1rem 0" }}>
                              {poster.film} ({poster.year}) • {poster.director}
                            </p>
                          </div>

                          <div>
                            {/* SIZE SELECTOR PILLS */}
                            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem" }}>
                              {sizes.map((s) => (
                                <button
                                  key={s.id}
                                  onClick={() => handleCardSizeChange(poster.id, s.id)}
                                  style={{
                                    flex: 1,
                                    padding: "0.35rem 0",
                                    borderRadius: "8px",
                                    border: selectedSize === s.id ? "1.5px solid #111" : "1px solid #E5E7EB",
                                    backgroundColor: selectedSize === s.id ? "#111" : "#FFF",
                                    color: selectedSize === s.id ? "#FFF" : "#444",
                                    fontSize: "0.75rem",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease"
                                  }}
                                >
                                  {s.label}
                                </button>
                              ))}
                            </div>

                            {/* PRICE & ADD TO CART */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F3F3F0", paddingTop: "0.85rem" }}>
                              <div>
                                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#888", display: "block", fontWeight: "700" }}>Price</span>
                                <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "#111" }}>₹{displayPrice}</span>
                              </div>

                              <button
                                onClick={() => addToCart(poster, selectedSize, "unframed", 1)}
                                style={{
                                  padding: "0.65rem 1.1rem",
                                  borderRadius: "100px",
                                  border: "none",
                                  backgroundColor: "#10B981",
                                  color: "#FFF",
                                  fontWeight: "700",
                                  fontSize: "0.85rem",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.4rem",
                                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)"
                                }}
                              >
                                <ShoppingBag size={15} /> Add to Order
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

                {/* MODE 2: VISUAL GALLERY MODE */}
                {viewMode === "gallery" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                    {currentPosters.map((poster) => (
                      <div
                        key={poster.id}
                        onClick={() => router.push(`/product/${poster.slug}`)}
                        style={{
                          borderRadius: "24px",
                          overflow: "hidden",
                          position: "relative",
                          cursor: "pointer",
                          boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
                          height: "450px"
                        }}
                        className="hover-card"
                      >
                        <PosterRenderer poster={poster} selectedSize="A4" />

                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            padding: "1.75rem",
                            color: "#FFF"
                          }}
                        >
                          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#D4AF37", fontWeight: 700 }}>
                            {poster.collection}
                          </span>
                          <h3 style={{ fontSize: "1.4rem", fontWeight: "900", margin: "0.25rem 0 0.5rem 0" }}>
                            {poster.title}
                          </h3>
                          <p style={{ fontSize: "0.85rem", color: "#CCC", margin: "0 0 1rem 0" }}>
                            {poster.tagline}
                          </p>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "1.25rem", fontWeight: "900" }}>₹{poster.price}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(poster, "A4", "unframed", 1);
                              }}
                              style={{ padding: "0.6rem 1.2rem", borderRadius: "100px", backgroundColor: "#FFF", color: "#111", border: "none", fontWeight: "800", cursor: "pointer" }}
                            >
                              Collect Art
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* MODE 3: FILM LORE / STORY MODE */}
                {viewMode === "story" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {currentPosters.map((poster) => (
                      <div
                        key={poster.id}
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "24px",
                          padding: "2rem",
                          border: "1px solid rgba(17,17,17,0.08)",
                          display: "grid",
                          gridTemplateColumns: isMobile ? "1fr" : "280px 1fr",
                          gap: "2rem",
                          alignItems: "center"
                        }}
                      >
                        <div onClick={() => router.push(`/product/${poster.slug}`)} style={{ cursor: "pointer" }}>
                          <PosterRenderer poster={poster} selectedSize="A4" />
                        </div>

                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                            <span style={{ fontSize: "0.75rem", backgroundColor: "#F3F3F0", padding: "0.25rem 0.6rem", borderRadius: "6px", fontWeight: "700" }}>
                              {poster.collection}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: "600" }}>
                              Released {poster.year}
                            </span>
                          </div>

                          <h2 style={{ fontSize: "1.6rem", fontWeight: "900", margin: "0 0 0.5rem 0", color: "#111" }}>
                            {poster.title}
                          </h2>

                          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.6", marginBottom: "1.25rem" }}>
                            {poster.story}
                          </p>

                          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                            <span style={{ fontSize: "1.4rem", fontWeight: "900", color: "#111" }}>₹{poster.price}</span>
                            <button
                              onClick={() => router.push(`/product/${poster.slug}`)}
                              style={{ padding: "0.7rem 1.4rem", borderRadius: "100px", backgroundColor: "#111", color: "#FFF", border: "none", fontWeight: "700", cursor: "pointer" }}
                            >
                              Explore Print Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PAGINATION NUMBERS */}
                {totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem" }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: currentPage === pageNum ? "none" : "1px solid #DDD",
                          backgroundColor: currentPage === pageNum ? "#111" : "#FFF",
                          color: currentPage === pageNum ? "#FFF" : "#444",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
