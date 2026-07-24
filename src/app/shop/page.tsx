'use client';

import React, { useContext, useState, useMemo, useEffect, Suspense } from "react";
import { AppContext } from "../../features/cart/AppContext";
import PosterRenderer from "../../components/PosterRenderer";
import { posters as staticPosters, collections as staticCollections, sizes } from "../../lib/cms/products";
import { Product } from "../../types";
import { Filter, Search, Heart, ShoppingBag, Eye, X, LayoutGrid, Compass, BookOpen, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const STATIC_POSTER_MAP: Record<string, string> = {
  manichitrathazhu: "/assets/posters/manichitrathazhu-original-polacraft.png",
  "kumbalangi-nights": "/assets/posters/kumbalangi-original-polacraft.png",
  aavesham: "/assets/posters/aavesham-original-polacraft.png",
  thoovanathumbikal: "/assets/posters/thoovanathumbikal-original-polacraft.png",
  spadikam: "/assets/posters/spadikam-original-polacraft.png",
  prenam: "/assets/posters/premam-original-polacraft.png",
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

// Sub-component that reads search parameters
function ShopContent() {
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

  const [posters, setPosters] = useState<Product[]>([]);
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

  // Fetch live products from database API on load with cache breaker
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

    loadLiveProducts();
  }, []);

  // Unique values for filter picks
  const uniqueActors = useMemo(() => {
    const actors = new Set<string>();
    posters.forEach((p) => p.cast.forEach((act) => actors.add(act)));
    return ["All", ...Array.from(actors)];
  }, [posters]);

  const uniqueDirectors = useMemo(() => {
    const directors = new Set<string>();
    posters.forEach((p) => directors.add(p.director));
    return ["All", ...Array.from(directors)];
  }, [posters]);

  // Filter & Search Logic
  const filteredPosters = useMemo(() => {
    return posters.filter((poster) => {
      const searchLower = searchQuery.toLowerCase();
      const matchSearch =
        searchQuery === "" ||
        poster.title.toLowerCase().includes(searchLower) ||
        poster.film.toLowerCase().includes(searchLower) ||
        poster.director.toLowerCase().includes(searchLower) ||
        poster.tagline.toLowerCase().includes(searchLower) ||
        poster.cast.some((act) => act.toLowerCase().includes(searchLower));

      const matchCollection =
        activeFilters.collection === "All Collections" ||
        poster.collection.toLowerCase().includes(activeFilters.collection.split(" ")[0].toLowerCase());

      const matchActor =
        activeFilters.actor === "All" ||
        poster.cast.includes(activeFilters.actor);

      const matchDirector =
        activeFilters.director === "All" ||
        poster.director === activeFilters.director;

      const matchPrice = poster.price <= activeFilters.priceRange;

      return matchSearch && matchCollection && matchActor && matchDirector && matchPrice;
    });
  }, [posters, searchQuery, activeFilters]);

  // Sorting
  const sortedPosters = useMemo(() => {
    const list = [...filteredPosters];
    const sortType = activeFilters.sort;

    if (sortType === "price-asc") {
      return list.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-desc") {
      return list.sort((a, b) => b.price - a.price);
    } else if (sortType === "year-desc") {
      return list.sort((a, b) => b.year - a.year);
    } else if (sortType === "year-asc") {
      return list.sort((a, b) => a.year - b.year);
    }
    return list;
  }, [filteredPosters, activeFilters.sort]);

  // Pagination
  const totalPages = Math.ceil(sortedPosters.length / itemsPerPage);
  const paginatedPosters = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedPosters.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedPosters, currentPage]);

  const handleFilterChange = (key: string, value: any) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({
      collection: "All Collections",
      priceRange: 500,
      actor: "All",
      director: "All",
      sort: "default"
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div style={{ paddingTop: isMobile ? "90px" : "140px", paddingBottom: "100px", minHeight: "100vh" }}>
      <div className="container">
        
        {/* EDITORIAL HEADER & TOGGLE */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: isMobile ? "1.5rem" : "4rem" }} className="shop-header">
          <div>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", fontWeight: "600" }}>
              The Catalog ({posters.length} Posters Available)
            </span>
            <h1 style={{ fontSize: isMobile ? "2.25rem" : "3.5rem", fontWeight: "800", letterSpacing: "-0.04em", marginTop: "0.5rem" }}>
              Fine Art Exhibition
            </h1>
          </div>

          {/* GALLERY MODE SWITCHER */}
          <div 
            style={{
              display: "flex",
              backgroundColor: "var(--accent-beige)",
              padding: "4px",
              borderRadius: "15px",
              border: "1px solid var(--border-color)"
            }}
          >
            <button
              onClick={() => setViewMode("shop")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.2rem",
                fontSize: "0.85rem",
                fontWeight: "600",
                borderRadius: "12px",
                cursor: "pointer",
                backgroundColor: viewMode === "shop" ? "#FFFFFF" : "transparent",
                boxShadow: viewMode === "shop" ? "var(--shadow-soft)" : "none",
                transition: "var(--transition-fast)"
              }}
            >
              <LayoutGrid size={16} /> Grid
            </button>
            <button
              onClick={() => setViewMode("gallery")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.2rem",
                fontSize: "0.85rem",
                fontWeight: "600",
                borderRadius: "12px",
                cursor: "pointer",
                backgroundColor: viewMode === "gallery" ? "#FFFFFF" : "transparent",
                boxShadow: viewMode === "gallery" ? "var(--shadow-soft)" : "none",
                transition: "var(--transition-fast)"
              }}
            >
              <Compass size={16} /> Gallery
            </button>
            <button
              onClick={() => setViewMode("story")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.2rem",
                fontSize: "0.85rem",
                fontWeight: "600",
                borderRadius: "12px",
                cursor: "pointer",
                backgroundColor: viewMode === "story" ? "#FFFFFF" : "transparent",
                boxShadow: viewMode === "story" ? "var(--shadow-soft)" : "none",
                transition: "var(--transition-fast)"
              }}
            >
              <BookOpen size={16} /> Story
            </button>
          </div>
        </div>

        {/* MOBILE SUB-BAR: Filter and sort (Matching Reference Image 1) */}
        {isMobile && viewMode === "shop" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 0", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", marginBottom: "1.5rem" }}>
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", fontSize: "0.95rem", fontWeight: 700, color: "#111111", cursor: "pointer" }}
            >
              <SlidersHorizontal size={18} /> Filter and sort
            </button>

            <span style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>
              {sortedPosters.length} products
            </span>
          </div>
        )}

        {/* MOBILE FILTER DRAWER OVERLAY */}
        {isFilterDrawerOpen && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", justifyContent: "flex-end" }} onClick={() => setIsFilterDrawerOpen(false)}>
            <div style={{ width: "85%", maxWidth: "380px", height: "100%", backgroundColor: "#FFFFFF", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0", paddingBottom: "1rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <SlidersHorizontal size={18} /> Filter and Sort
                </h3>
                <button onClick={() => setIsFilterDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>Search Title / Cast</label>
                <div style={{ position: "relative" }}>
                  <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posters..."
                    style={{ width: "100%", padding: "0.6rem 0.6rem 0.6rem 2.2rem", fontSize: "0.85rem", border: "1.5px solid #CBD5E1", borderRadius: "10px" }}
                  />
                </div>
              </div>

              {/* Collection */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>Collection</label>
                <select
                  value={activeFilters.collection}
                  onChange={(e) => handleFilterChange("collection", e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #CBD5E1", fontSize: "0.85rem", backgroundColor: "#FFF" }}
                >
                  {staticCollections.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              {/* Featured Cast */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>Featured Cast</label>
                <select
                  value={activeFilters.actor}
                  onChange={(e) => handleFilterChange("actor", e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #CBD5E1", fontSize: "0.85rem", backgroundColor: "#FFF" }}
                >
                  {uniqueActors.map((act) => (
                    <option key={act} value={act}>{act}</option>
                  ))}
                </select>
              </div>

              {/* Director */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>Director</label>
                <select
                  value={activeFilters.director}
                  onChange={(e) => handleFilterChange("director", e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #CBD5E1", fontSize: "0.85rem", backgroundColor: "#FFF" }}
                >
                  {uniqueDirectors.map((dir) => (
                    <option key={dir} value={dir}>{dir}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>Sort By</label>
                <select
                  value={activeFilters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #CBD5E1", fontSize: "0.85rem", backgroundColor: "#FFF" }}
                >
                  <option value="default">Default Curation</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="year-desc">Year: New to Old</option>
                  <option value="year-asc">Year: Old to New</option>
                </select>
              </div>

              {/* Drawer Footer Buttons */}
              <div style={{ marginTop: "auto", display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid #E2E8F0" }}>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1", background: "#FFF", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "none", background: "#111111", color: "#FFF", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer" }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. EDITORIAL STORY VIEW */}
        {viewMode === "story" ? (
          <section style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
            {sortedPosters.map((poster) => {
              const isWish = wishlist.includes(poster.id);
              return (
                <div 
                  key={poster.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.2fr",
                    gap: "5rem",
                    alignItems: "center",
                    borderBottom: "1px solid var(--border-color)",
                    paddingBottom: "5rem"
                  }}
                  className="editorial-story-row"
                >
                  <div style={{ backgroundColor: "var(--accent-beige)", padding: "4rem 3rem", borderRadius: "20px", display: "flex", justifyContent: "center" }} className="hover-lift">
                    <div style={{ width: "100%", maxWidth: "320px", cursor: "pointer" }} onClick={() => router.push(`/product/${poster.slug}`)}>
                      <PosterRenderer poster={poster} frame="black" />
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div>
                      <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
                        {poster.collection}
                      </span>
                      <h2 style={{ fontSize: "2.75rem", fontWeight: "800", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>
                        {poster.title}
                      </h2>
                      <p style={{ fontSize: "1.15rem", fontStyle: "italic", color: "var(--text-muted)" }}>
                        {poster.film} • Dir. {poster.director}
                      </p>
                    </div>

                    <blockquote style={{ borderLeft: "2px solid var(--text-dark)", paddingLeft: "1.5rem", fontStyle: "italic", fontSize: "1.1rem", margin: 0 }}>
                      "{poster.tagline}"
                    </blockquote>

                    <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.7" }}>
                      {poster.story}
                    </p>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                      <button onClick={() => router.push(`/product/${poster.slug}`)} className="btn-magnetic btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "0.85rem" }}>
                        View Details & Order
                      </button>
                      <button 
                        onClick={() => toggleWishlist(poster.id)}
                        className="btn-secondary" 
                        style={{ padding: "0.8rem 1.5rem", fontSize: "0.85rem", borderRadius: "12px", cursor: "pointer" }}
                      >
                        {isWish ? "Remove Wishlist" : "Wishlist"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        ) : viewMode === "gallery" ? (
          <section style={{ position: "relative" }}>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "2rem", fontStyle: "italic" }}>
              * Drag or scroll horizontally to walk through the framed Malayalam cinema catalog.
            </p>
            
            <div className="gallery-mode-row">
              {sortedPosters.map((poster) => {
                const isWish = wishlist.includes(poster.id);
                return (
                  <div
                    key={poster.id}
                    style={{
                      flex: "0 0 350px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      scrollSnapAlign: "center",
                      paddingBottom: "3rem"
                    }}
                  >
                    <div 
                      onClick={() => router.push(`/product/${poster.slug}`)}
                      style={{ 
                        width: "100%", 
                        cursor: "pointer",
                        position: "relative" 
                      }} 
                      className="hover-lift"
                    >
                      <PosterRenderer poster={poster} frame="black" />
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(poster.id);
                        }}
                        style={{
                          position: "absolute",
                          top: "1.5rem",
                          right: "1.5rem",
                          backgroundColor: isWish ? "#FFF5F5" : "#FAFAF8",
                          color: isWish ? "red" : "var(--text-dark)",
                          padding: "0.6rem",
                          borderRadius: "50%",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                          cursor: "pointer",
                          zIndex: 5
                        }}
                      >
                        <Heart size={16} fill={isWish ? "red" : "none"} />
                      </button>
                    </div>

                    <div className="gallery-museum-plaque" style={{ width: "85%", textAlign: "center", marginTop: "1.5rem" }}>
                      <h4 style={{ fontSize: "1.2rem", fontWeight: "700", fontFamily: "var(--font-serif)" }}>{poster.title}</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>{poster.film}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        Dir. {poster.director} • Cast: {poster.cast.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          /* 2. SHOP CATALOG GRID VIEW */
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "260px 1fr",
              gap: isMobile ? "1rem" : "3.5rem"
            }}
            className="shop-main-grid"
          >
            {/* DESKTOP FILTER SIDEBAR */}
            {!isMobile && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }} className="shop-sidebar">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Filter size={18} /> Filters
                  </h3>
                  <button 
                    onClick={handleClearFilters}
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)", cursor: "pointer" }}
                    className="underline-hover"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Search Title / Cast
                  </span>
                  <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search posters..."
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.6rem 0.6rem 2.2rem",
                        fontSize: "0.85rem",
                        border: "1.5px solid var(--border-color)",
                        borderRadius: "12px",
                        backgroundColor: "#FFFFFF"
                      }}
                    />
                  </div>
                </div>

                {/* Collection */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Collection
                  </span>
                  <select
                    value={activeFilters.collection}
                    onChange={(e) => handleFilterChange("collection", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      border: "1.5px solid var(--border-color)",
                      backgroundColor: "#FFFFFF",
                      fontSize: "0.85rem",
                      cursor: "pointer"
                    }}
                  >
                    {staticCollections.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* Actor */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Featured Cast
                  </span>
                  <select
                    value={activeFilters.actor}
                    onChange={(e) => handleFilterChange("actor", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      border: "1.5px solid var(--border-color)",
                      backgroundColor: "#FFFFFF",
                      fontSize: "0.85rem",
                      cursor: "pointer"
                    }}
                  >
                    {uniqueActors.map((act) => (
                      <option key={act} value={act}>{act}</option>
                    ))}
                  </select>
                </div>

                {/* Director */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Director
                  </span>
                  <select
                    value={activeFilters.director}
                    onChange={(e) => handleFilterChange("director", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      border: "1.5px solid var(--border-color)",
                      backgroundColor: "#FFFFFF",
                      fontSize: "0.85rem",
                      cursor: "pointer"
                    }}
                  >
                    {uniqueDirectors.map((dir) => (
                      <option key={dir} value={dir}>{dir}</option>
                    ))}
                  </select>
                </div>

                {/* Price range */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                      Max Price
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600", marginLeft: "auto" }}>₹{activeFilters.priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="500"
                    step="10"
                    value={activeFilters.priceRange}
                    onChange={(e) => handleFilterChange("priceRange", Number(e.target.value))}
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      accentColor: "var(--accent-charcoal)"
                    }}
                  />
                </div>

                {/* Sorting */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Sort By
                  </span>
                  <select
                    value={activeFilters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      border: "1.5px solid var(--border-color)",
                      backgroundColor: "#FFFFFF",
                      fontSize: "0.85rem",
                      cursor: "pointer"
                    }}
                  >
                    <option value="default">Default Curation</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="year-desc">Year: New to Old</option>
                    <option value="year-asc">Year: Old to New</option>
                  </select>
                </div>
              </div>
            )}

            {/* RESULTS CONTAINER */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
              {sortedPosters.length === 0 ? (
                <div style={{ padding: "6rem 0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "3rem" }}>🔍</span>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>No artwork found</h3>
                  <p style={{ color: "var(--text-muted)", maxWidth: "32ch" }}>
                    We couldn't find any posters matching your criteria. Try widening your price ranges.
                  </p>
                  <button onClick={handleClearFilters} className="btn-magnetic btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "0.9rem", marginTop: "1rem" }}>
                    Reset Curation
                  </button>
                </div>
              ) : (
                <div 
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
                    gap: isMobile ? "1.5rem 0.85rem" : "2.5rem 2rem"
                  }}
                  className="shop-poster-grid"
                >
                  {paginatedPosters.map((poster) => {
                    const isWish = wishlist.includes(poster.id);
                    const selectedSize = cardSizes[poster.id] || "A4";

                    return (
                      <div key={poster.id} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        <div 
                          style={{
                            position: "relative",
                            borderRadius: "16px",
                            overflow: "hidden",
                            backgroundColor: "var(--accent-beige)",
                            padding: isMobile ? "1.2rem 0.6rem" : "2.5rem 1.8rem",
                            cursor: "pointer"
                          }}
                          className="shop-art-box"
                        >
                          <div 
                            onClick={() => router.push(`/product/${poster.slug}`)}
                            className="shop-art-container"
                            style={{ transition: "transform 0.5s ease-out" }}
                          >
                            <PosterRenderer poster={poster} frame="unframed" />
                          </div>

                          {/* Sale Badge (Matching Reference Image 1) */}
                          <span style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem", fontSize: "0.65rem", fontWeight: "800", backgroundColor: "#000000", color: "#FFFFFF", padding: "0.25rem 0.65rem", borderRadius: "20px", zIndex: 5 }}>
                            Sale
                          </span>

                          {!isMobile && (
                            <div 
                              style={{
                                position: "absolute",
                                bottom: "1.5rem",
                                left: "50%",
                                transform: "translateX(-50%)",
                                display: "flex",
                                gap: "0.5rem",
                                zIndex: 10
                              }}
                              className="shop-action-reveal"
                            >
                              <button
                                onClick={() => openQuickView(poster)}
                                style={{
                                  backgroundColor: "#FAFAF8",
                                  color: "var(--text-dark)",
                                  padding: "0.75rem",
                                  borderRadius: "50%",
                                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                  cursor: "pointer"
                                }}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => addToCart(poster, "A4", "unframed", 1)}
                                style={{
                                  backgroundColor: "var(--accent-charcoal)",
                                  color: "#FAFAF8",
                                  padding: "0.75rem",
                                  borderRadius: "50%",
                                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                  cursor: "pointer"
                                }}
                              >
                                <ShoppingBag size={16} />
                              </button>
                              <button
                                onClick={() => toggleWishlist(poster.id)}
                                style={{
                                  backgroundColor: isWish ? "#FFF5F5" : "#FAFAF8",
                                  color: isWish ? "red" : "var(--text-dark)",
                                  padding: "0.75rem",
                                  borderRadius: "50%",
                                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                  cursor: "pointer"
                                }}
                              >
                                <Heart size={16} fill={isWish ? "red" : "none"} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h4
                          onClick={() => router.push(`/product/${poster.slug}`)}
                          style={{
                            fontSize: isMobile ? "0.82rem" : "1.05rem",
                            fontWeight: "700",
                            lineHeight: "1.3",
                            margin: "0.25rem 0 0 0",
                            cursor: "pointer",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            color: "#111111"
                          }}
                        >
                          {poster.title} | {poster.director} | {poster.collection}
                        </h4>

                        {/* Pricing Row (Matching Reference Image 1) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                          <span style={{ fontSize: "0.75rem", color: "#94A3B8", textDecoration: "line-through" }}>
                            Rs. {(poster.price * 2).toFixed(2)}
                          </span>
                          <span style={{ fontSize: isMobile ? "0.9rem" : "1.05rem", fontWeight: "800", color: "#111111" }}>
                            From Rs. {poster.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Size Dropdown Selector (Matching Reference Image 1) */}
                        <select
                          value={selectedSize}
                          onChange={(e) => handleCardSizeChange(poster.id, e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.6rem",
                            borderRadius: "10px",
                            border: "1.5px solid #CBD5E1",
                            backgroundColor: "#FFFFFF",
                            fontSize: "0.78rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            color: "#1E293B"
                          }}
                        >
                          <option value="A5">A5 - Rs. {poster.price.toFixed(2)}</option>
                          <option value="A4">A4 - Rs. {(poster.price + 30).toFixed(2)}</option>
                          <option value="A3">A3 - Rs. {(poster.price + 70).toFixed(2)}</option>
                        </select>

                        {/* Add to Cart Full-Width Dark Button (Matching Reference Image 1) */}
                        <button
                          onClick={() => addToCart(poster, selectedSize, "unframed", 1)}
                          style={{
                            width: "100%",
                            padding: "0.65rem",
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: "#111111",
                            color: "#FFFFFF",
                            fontWeight: "800",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease"
                          }}
                        >
                          Add to cart
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "2rem" }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    style={{
                      padding: "0.6rem 1rem",
                      border: "1.5px solid var(--border-color)",
                      borderRadius: "12px",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      opacity: currentPage === 1 ? 0.4 : 1,
                      fontSize: "0.85rem",
                      fontWeight: "500"
                    }}
                    className="page-nav-btn"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      style={{
                        width: "36px",
                        height: "36px",
                        border: currentPage === p ? "1.5px solid var(--text-dark)" : "1.5px solid var(--border-color)",
                        backgroundColor: currentPage === p ? "var(--text-dark)" : "transparent",
                        color: currentPage === p ? "#FFFFFF" : "var(--text-dark)",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    style={{
                      padding: "0.6rem 1rem",
                      border: "1.5px solid var(--border-color)",
                      borderRadius: "12px",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      opacity: currentPage === totalPages ? 0.4 : 1,
                      fontSize: "0.85rem",
                      fontWeight: "500"
                    }}
                    className="page-nav-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .shop-action-reveal {
          opacity: 0;
          transform: translate(-50%, 10px);
          transition: var(--transition-smooth);
        }
        .shop-art-box:hover .shop-action-reveal {
          opacity: 1;
          transform: translate(-50%, 0px);
        }
        .shop-art-box:hover .shop-art-container {
          transform: scale(1.03) translateY(-2px);
        }
        .page-nav-btn:hover:not(:disabled) {
          border-color: var(--text-dark) !important;
          background-color: var(--accent-beige) !important;
        }
        @media (max-width: 900px) {
          .shop-main-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .shop-sidebar {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 1.5rem !important;
          }
          .shop-sidebar > div:first-child {
            grid-column: span 2 !important;
          }
        }
        @media (max-width: 768px) {
          .shop-poster-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .shop-sidebar {
            grid-template-columns: 1fr !important;
          }
          .shop-sidebar > div:first-child {
            grid-column: span 1 !important;
          }
          .shop-poster-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div style={{ paddingTop: "200px", paddingBottom: "100px", textAlign: "center" }}>
        <h3>Loading Art Exhibition...</h3>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
