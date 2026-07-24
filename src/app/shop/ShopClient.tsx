'use client';

import React, { useContext, useState, useMemo, useEffect, Suspense } from "react";
import { AppContext } from "../../features/cart/AppContext";
import PosterRenderer from "../../components/PosterRenderer";
import { collections as staticCollections, sizes } from "../../lib/cms/products";
import { Product } from "../../types";
import { Filter, Search, Heart, ShoppingBag, Eye, X, LayoutGrid, Compass, BookOpen, SlidersHorizontal } from "lucide-react";
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

export default function ShopClient({ initialPosters = [] }: { initialPosters?: Product[] }) {
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

  // Background refresh of live catalog
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

      // 2. Collection Filter
      if (
        activeFilters.collection !== "All Collections" &&
        !poster.collection.toLowerCase().includes(activeFilters.collection.toLowerCase())
      ) {
        return false;
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
  }, [posters, searchQuery, activeFilters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosters.length / itemsPerPage);
  const currentPosters = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPosters.slice(start, start + itemsPerPage);
  }, [filteredPosters, currentPage, itemsPerPage]);

  const handleFilterChange = (key: string, value: any) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to page 1 on filter update
  };

  const clearFilters = () => {
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
    <div style={{ paddingTop: "140px", paddingBottom: "120px", backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      <div className="container">
        
        {/* HEADER TITLE */}
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "#666", fontWeight: "700" }}>
            The Complete Archival Catalog
          </span>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111", marginTop: "0.4rem" }}>
            Art Gallery & Shop
          </h1>
          <p style={{ maxWidth: "600px", margin: "0.75rem auto 0", color: "#555", fontSize: "1rem", lineHeight: 1.6 }}>
            Explore museum-grade giclée prints capturing legendary moments, iconic dialogues, and golden eras of cinema.
          </p>
        </div>

        {/* CONTROLS BAR: SEARCH, VIEWS, MOBILE FILTER */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.25rem",
            justifyContent: "space-between",
            alignItems: "center",
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

                {/* COLLECTIONS FILTER */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", display: "block", marginBottom: "0.75rem" }}>
                    Collections
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {staticCollections.map((col) => (
                      <button
                        key={col}
                        onClick={() => handleFilterChange("collection", col)}
                        style={{
                          textAlign: "left",
                          padding: "0.55rem 0.85rem",
                          borderRadius: "10px",
                          border: "none",
                          backgroundColor: activeFilters.collection === col ? "#111" : "transparent",
                          color: activeFilters.collection === col ? "#FFF" : "#444",
                          fontSize: "0.85rem",
                          fontWeight: activeFilters.collection === col ? "700" : "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {col}
                      </button>
                    ))}
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
                    Lead Actor
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
                            padding: "1.5rem",
                            border: "1px solid rgba(17,17,17,0.08)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "1.25rem",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.02)",
                            transition: "transform 0.25s ease, box-shadow 0.25s ease"
                          }}
                          className="poster-shop-card"
                        >
                          <div>
                            {/* ARTWORK DISPLAY */}
                            <Link href={`/product/${poster.slug}`} prefetch={true} style={{ display: "block", textDecoration: "none" }}>
                              <div style={{ borderRadius: "14px", overflow: "hidden", backgroundColor: "#EFECE6", padding: "1.25rem 0.85rem", marginBottom: "1rem", position: "relative" }}>
                                <PosterRenderer poster={poster} frame="unframed" />
                              </div>
                            </Link>

                            {/* TITLE & DETAILS */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                              <div>
                                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#888", fontWeight: "700" }}>
                                  {poster.collection}
                                </span>
                                <h3 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#111", margin: "0.2rem 0 0 0", letterSpacing: "-0.02em" }}>
                                  {poster.title}
                                </h3>
                                <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.2rem 0 0 0" }}>
                                  {poster.film} • Dir. {poster.director}
                                </p>
                              </div>

                              <button
                                onClick={() => toggleWishlist(poster.id)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: isWish ? "#E63946" : "#CCC", padding: "0.2rem" }}
                              >
                                <Heart size={20} fill={isWish ? "#E63946" : "none"} />
                              </button>
                            </div>
                          </div>

                          {/* SIZE SELECTOR & CART ACTION */}
                          <div>
                            <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1rem" }}>
                              {sizes.map((s) => (
                                <button
                                  key={s.id}
                                  onClick={() => handleCardSizeChange(poster.id, s.id)}
                                  style={{
                                    flex: 1,
                                    padding: "0.35rem",
                                    borderRadius: "8px",
                                    border: selectedSize === s.id ? "1.5px solid #111" : "1px solid #E2E8F0",
                                    backgroundColor: selectedSize === s.id ? "#111" : "#FAFAFA",
                                    color: selectedSize === s.id ? "#FFF" : "#666",
                                    fontWeight: "800",
                                    fontSize: "0.75rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  {s.id}
                                </button>
                              ))}
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.85rem", borderTop: "1px solid #F1F5F9" }}>
                              <div>
                                <span style={{ fontSize: "0.7rem", color: "#888", display: "block" }}>Archival Print</span>
                                <span style={{ fontSize: "1.15rem", fontWeight: "900", color: "#111" }}>₹{displayPrice}</span>
                              </div>

                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button
                                  onClick={() => openQuickView(poster)}
                                  style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1px solid #E2E8F0", backgroundColor: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                  title="Quick View"
                                >
                                  <Eye size={16} />
                                </button>

                                <button
                                  onClick={() => addToCart(poster, selectedSize, "unframed", 1)}
                                  style={{ padding: "0.5rem 1rem", borderRadius: "100px", backgroundColor: "#111", color: "#FFF", border: "none", fontWeight: "800", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
                                >
                                  <ShoppingBag size={14} /> Add
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

                {/* MODE 2: VISUAL GALLERY MODE */}
                {viewMode === "gallery" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2.5rem" }}>
                    {currentPosters.map((poster) => (
                      <div key={poster.id} style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 15px 40px rgba(0,0,0,0.03)" }}>
                        <Link href={`/product/${poster.slug}`} prefetch={true} style={{ display: "block", textDecoration: "none" }}>
                          <div style={{ borderRadius: "16px", overflow: "hidden", backgroundColor: "#EFECE6", padding: "2rem 1.5rem", marginBottom: "1.5rem" }}>
                            <PosterRenderer poster={poster} frame="unframed" />
                          </div>
                        </Link>
                        <h3 style={{ fontSize: "1.4rem", fontWeight: "900", margin: "0 0 0.3rem 0" }}>{poster.title}</h3>
                        <p style={{ fontStyle: "italic", color: "#555", fontSize: "0.9rem", marginBottom: "1.25rem" }}>&quot;{poster.tagline}&quot;</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: "900", fontSize: "1.2rem" }}>₹{poster.price}</span>
                          <button onClick={() => openQuickView(poster)} style={{ padding: "0.6rem 1.25rem", borderRadius: "100px", backgroundColor: "#111", color: "#FFF", border: "none", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer" }}>
                            Inspect Fine Art Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* MODE 3: FILM LORE MODE */}
                {viewMode === "story" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {currentPosters.map((poster) => (
                      <div key={poster.id} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "240px 1fr", gap: "2rem", backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(17,17,17,0.08)" }}>
                        <Link href={`/product/${poster.slug}`} prefetch={true} style={{ display: "block", textDecoration: "none" }}>
                          <div style={{ borderRadius: "14px", overflow: "hidden", backgroundColor: "#EFECE6", padding: "1.25rem" }}>
                            <PosterRenderer poster={poster} frame="unframed" />
                          </div>
                        </Link>
                        <div>
                          <span style={{ fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.2em", color: "#888" }}>{poster.film}</span>
                          <h3 style={{ fontSize: "1.6rem", fontWeight: "900", margin: "0.3rem 0 0.75rem 0" }}>{poster.title}</h3>
                          <p style={{ color: "#444", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1rem" }}>{poster.story}</p>
                          <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1.5rem" }}>
                            <strong>Design Curatorial Notes:</strong> {poster.designNotes}
                          </div>
                          <button onClick={() => openQuickView(poster)} style={{ padding: "0.65rem 1.4rem", borderRadius: "100px", backgroundColor: "#111", color: "#FFF", border: "none", fontWeight: "800", fontSize: "0.85rem", cursor: "pointer" }}>
                            Acquire Archival Print • ₹{poster.price}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "4rem" }}>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            border: isActive ? "2px solid #111" : "1px solid #E2E8F0",
                            backgroundColor: isActive ? "#111" : "#FFF",
                            color: isActive ? "#FFF" : "#444",
                            fontWeight: "800",
                            fontSize: "0.9rem",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
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
