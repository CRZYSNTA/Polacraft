'use client';

import React, { useState, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "../../features/cart/AppContext";
import PosterRenderer from "../../components/PosterRenderer";
import { Product } from "../../types";
import { 
  Upload, 
  Check, 
  ShoppingBag, 
  MessageSquare, 
  ShieldCheck, 
  Truck, 
  X,
  Ruler,
  SlidersHorizontal,
  ArrowRight
} from "lucide-react";
import SizeGuideModal from "../../components/SizeGuideModal";

export default function CustomPrintStudio() {
  const { addToCart, setCartOpen } = useContext(AppContext);
  const router = useRouter();

  const studioRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Layout Selection
  const [activeLayout, setActiveLayout] = useState<"single" | "split-3" | "split-2x2">("single");
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Customizer state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [customTitle, setCustomTitle] = useState("Custom Artwork Print");
  const [selectedSize, setSelectedSize] = useState<"A5" | "A4" | "A3">("A4");
  const [selectedFrame, setSelectedFrame] = useState<"unframed" | "black" | "white" | "wood">("unframed");
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Size Base Rates
  const BASE_RATES: Record<string, number> = {
    A5: 45,
    A4: 70,
    A3: 100
  };

  // Multipliers for Split Formats
  const MULTIPLIERS: Record<string, number> = {
    "single": 1,
    "split-3": 2.5,
    "split-2x2": 3.2
  };

  // Frame Rates by Size
  const FRAMED_TOTALS: Record<string, number> = {
    A5: 200,
    A4: 250,
    A3: 300
  };

  // Calculate Unit Price
  const multiplier = MULTIPLIERS[activeLayout] || 1;
  const basePrice = Math.round((BASE_RATES[selectedSize] || 70) * multiplier);
  const isFramed = selectedFrame !== "unframed";
  const unitPrice = isFramed ? Math.round((FRAMED_TOTALS[selectedSize] || 250) * multiplier) : basePrice;
  const subtotal = unitPrice * quantity;
  const shippingCost = subtotal >= 800 ? 0 : 60;
  const grandTotal = subtotal + shippingCost;

  const openStudio = (layout: "single" | "split-3" | "split-2x2") => {
    setActiveLayout(layout);
    setIsStudioOpen(true);
    setTimeout(() => {
      studioRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // File Upload Handler
  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds maximum limit of 10 MB.");
      return;
    }

    setUploadError(null);
    setSelectedFile(file);

    // Instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Background upload to Cloudinary
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.secure_url) {
        setUploadedUrl(data.secure_url);
      } else {
        setUploadedUrl(objectUrl);
      }
    } catch (e) {
      setUploadedUrl(objectUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Construct Synthetic Poster Object
  const layoutLabel = activeLayout === "single" ? "Single Poster" : activeLayout === "split-3" ? "3-Panel Split Poster" : "2x2 Grid Split Poster";

  const customPoster: Product = React.useMemo(() => ({
    id: `custom-print-${activeLayout}`,
    slug: "custom-artwork",
    title: customTitle || `Custom ${layoutLabel}`,
    film: `Custom ${layoutLabel}`,
    tagline: "Archival Fine Art Custom Print",
    year: new Date().getFullYear(),
    director: "Custom Artwork",
    cast: ["Custom Design"],
    collection: "Custom Studio Print",
    genre: "Custom Art",
    palette: { primary: "#1E1E1E", accent: "#E5A93C", bg: "#FAFAF8", text: "#FAFAF8" },
    story: "Handcrafted 250 GSM Giclée Archival Cotton Fine Art Print.",
    designNotes: "Custom customer design print.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "black", "white", "wood"],
    paperType: "Fine Art Cotton Archival",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    price: unitPrice,
    inventory: 99,
    lowStockThreshold: 5,
    isPreorder: false,
    limitedEditionCount: 1,
    isSoldOut: false,
    seoTitle: "Custom Fine Art Print | Polacraft Studio",
    seoDescription: "Upload your custom design for archival fine art printing.",
    heroImage: previewUrl || undefined,
    galleryImages: previewUrl ? [previewUrl] : [],
    wallMockups: ["/assets/living_room_mockup.png"]
  }), [customTitle, unitPrice, previewUrl, activeLayout, layoutLabel]);

  // WhatsApp Order Redirect
  const handleWhatsAppOrder = () => {
    const frameLabel = selectedFrame === "unframed" 
      ? "Unframed (Print Only)" 
      : selectedFrame === "black" 
      ? "Sleek Matte Black Frame" 
      : selectedFrame === "white" 
      ? "Minimal Studio White Frame" 
      : "Teak Wood Frame";

    const imageRefText = uploadedUrl 
      ? `🖼️ *Artwork Link:* ${uploadedUrl}` 
      : `🖼️ *Artwork File:* ${selectedFile?.name || "Uploaded File"}`;

    const textMessage = 
      `🎨 *POLACRAFT CUSTOM DESIGN ORDER*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📌 *Format:* ${layoutLabel}\n` +
      `📌 *Title:* ${customTitle}\n` +
      `📏 *Size:* ${selectedSize}\n` +
      `🖼️ *Frame:* ${frameLabel}\n` +
      `🔢 *Quantity:* ${quantity}\n` +
      `💵 *Item Total:* ₹${subtotal}\n` +
      `🚚 *Shipping:* ${shippingCost === 0 ? "FREE" : "₹60"}\n` +
      `💰 *Grand Total:* ₹${grandTotal}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `${imageRefText}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Please confirm payment and delivery details!`;

    const encodedMessage = encodeURIComponent(textMessage);
    window.open(`https://wa.me/919496682919?text=${encodedMessage}`, "_blank");
  };

  // Add Custom Item to Shopping Cart
  const handleAddToCart = () => {
    const frameId = selectedFrame === "wood" ? "black" : selectedFrame;
    addToCart(customPoster, selectedSize, frameId, quantity);
    setCartOpen(true);
  };

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "100px", minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
      <div className="container">
        
        {/* 1. TOP HEADER SECTION */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem", marginTop: "1rem" }}>
          <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: "900", letterSpacing: "0.18em", textTransform: "uppercase", color: "#111111", margin: 0 }}>
            DESIGN YOUR OWN
          </h1>
          <div style={{ fontSize: "0.85rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#666666", fontWeight: "700", marginTop: "0.35rem" }}>
            P R I N T S
          </div>
        </div>

        {/* 2. 3-COLUMN SELECTION GRID (MATCHING POSTERIZED.IN) */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
            gap: "2rem", 
            marginBottom: "5rem" 
          }}
        >
          
          {/* CARD 1: SINGLE POSTER */}
          <div 
            style={{ 
              backgroundColor: "#FAFAF8", 
              borderRadius: "20px", 
              border: activeLayout === "single" && isStudioOpen ? "2px solid #111111" : "1px solid rgba(17,17,17,0.08)", 
              overflow: "hidden", 
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              transition: "all 0.3s ease"
            }}
          >
            <div style={{ textAlign: "center", padding: "1.75rem 1rem 1.25rem 1rem", backgroundColor: "#F4F3EF" }}>
              <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.25rem", color: "#555555", display: "block" }}>
                Custom
              </span>
              <h2 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#111111", margin: "0 0 1rem 0", letterSpacing: "0.04em" }}>
                POSTER
              </h2>
              <button 
                onClick={() => openStudio("single")} 
                style={{ 
                  padding: "0.6rem 1.4rem", 
                  borderRadius: "100px", 
                  backgroundColor: "#2C2C2A", 
                  color: "#FFFFFF", 
                  border: "none", 
                  fontWeight: "700", 
                  fontSize: "0.85rem", 
                  cursor: "pointer", 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "0.4rem" 
                }}
              >
                Get Yours ➔
              </button>
            </div>
            <div 
              style={{ position: "relative", width: "100%", height: "420px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} 
              onClick={() => openStudio("single")}
            >
              <Image src="/assets/custom_single.jpg" alt="Custom Single Poster" fill style={{ objectFit: "cover" }} />
              <div style={{ position: "relative", zIndex: 2, width: "185px", height: "250px", backgroundColor: "#F5F5F0", border: "4px solid #E2DDD5", boxShadow: "0 15px 35px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1rem" }}>
                <span style={{ fontSize: "1.25rem", fontWeight: "900", color: "#333333", letterSpacing: "0.05em", lineHeight: "1.2" }}>UPLOAD YOUR</span>
                <span style={{ fontSize: "1.25rem", fontWeight: "900", color: "#333333", letterSpacing: "0.05em", lineHeight: "1.2" }}>IMAGE HERE</span>
              </div>
            </div>
          </div>

          {/* CARD 2: 3-PANEL SPLIT POSTER */}
          <div 
            style={{ 
              backgroundColor: "#FAFAF8", 
              borderRadius: "20px", 
              border: activeLayout === "split-3" && isStudioOpen ? "2px solid #111111" : "1px solid rgba(17,17,17,0.08)", 
              overflow: "hidden", 
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              transition: "all 0.3s ease"
            }}
          >
            <div style={{ textAlign: "center", padding: "1.75rem 1rem 1.25rem 1rem", backgroundColor: "#F4F3EF" }}>
              <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.25rem", color: "#555555", display: "block" }}>
                Custom
              </span>
              <h2 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#111111", margin: "0 0 1rem 0", letterSpacing: "0.04em" }}>
                SPLIT POSTER
              </h2>
              <button 
                onClick={() => openStudio("split-3")} 
                style={{ 
                  padding: "0.6rem 1.4rem", 
                  borderRadius: "100px", 
                  backgroundColor: "#2C2C2A", 
                  color: "#FFFFFF", 
                  border: "none", 
                  fontWeight: "700", 
                  fontSize: "0.85rem", 
                  cursor: "pointer", 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "0.4rem" 
                }}
              >
                Get Yours ➔
              </button>
            </div>
            <div 
              style={{ position: "relative", width: "100%", height: "420px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} 
              onClick={() => openStudio("split-3")}
            >
              <Image src="/assets/custom_split_3.jpg" alt="Custom Split Poster" fill style={{ objectFit: "cover" }} />
              <div style={{ position: "relative", zIndex: 2, display: "flex", gap: "6px" }}>
                {[1, 2, 3].map((panel) => (
                  <div key={panel} style={{ width: "80px", height: "230px", backgroundColor: "#F5F5F0", border: "3px solid #E2DDD5", boxShadow: "0 10px 25px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    {panel === 2 && (
                      <div style={{ textAlign: "center" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "#333333", letterSpacing: "0.05em", display: "block", lineHeight: "1.2" }}>UPLOAD YOUR</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "#333333", letterSpacing: "0.05em", display: "block", lineHeight: "1.2" }}>IMAGE HERE</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 3: 2X2 GRID SPLIT POSTER */}
          <div 
            style={{ 
              backgroundColor: "#FAFAF8", 
              borderRadius: "20px", 
              border: activeLayout === "split-2x2" && isStudioOpen ? "2px solid #111111" : "1px solid rgba(17,17,17,0.08)", 
              overflow: "hidden", 
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              transition: "all 0.3s ease"
            }}
          >
            <div style={{ textAlign: "center", padding: "1.75rem 1rem 1.25rem 1rem", backgroundColor: "#F4F3EF" }}>
              <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.25rem", color: "#555555", display: "block" }}>
                Custom
              </span>
              <h2 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#111111", margin: "0 0 0.2rem 0", letterSpacing: "0.04em" }}>
                SPLIT POSTER
              </h2>
              <div style={{ fontSize: "0.95rem", fontWeight: "900", color: "#111111", marginBottom: "0.8rem" }}>2X2</div>
              <button 
                onClick={() => openStudio("split-2x2")} 
                style={{ 
                  padding: "0.6rem 1.4rem", 
                  borderRadius: "100px", 
                  backgroundColor: "#2C2C2A", 
                  color: "#FFFFFF", 
                  border: "none", 
                  fontWeight: "700", 
                  fontSize: "0.85rem", 
                  cursor: "pointer", 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "0.4rem" 
                }}
              >
                Get Yours ➔
              </button>
            </div>
            <div 
              style={{ position: "relative", width: "100%", height: "420px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} 
              onClick={() => openStudio("split-2x2")}
            >
              <Image src="/assets/custom_split_2x2.jpg" alt="Custom 2x2 Split Poster" fill style={{ objectFit: "cover" }} />
              <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                <div style={{ width: "115px", height: "115px", backgroundColor: "#F5F5F0", border: "3px solid #E2DDD5", boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }} />
                <div style={{ width: "115px", height: "115px", backgroundColor: "#F5F5F0", border: "3px solid #E2DDD5", boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }} />
                <div style={{ width: "115px", height: "115px", backgroundColor: "#F5F5F0", border: "3px solid #E2DDD5", boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }} />
                <div style={{ width: "115px", height: "115px", backgroundColor: "#F5F5F0", border: "3px solid #E2DDD5", boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }} />
              </div>
              <div style={{ position: "absolute", zIndex: 3, textAlign: "center" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "#333333", letterSpacing: "0.05em", display: "block", lineHeight: "1.2" }}>UPLOAD YOUR</span>
                <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "#333333", letterSpacing: "0.05em", display: "block", lineHeight: "1.2" }}>IMAGE HERE</span>
                <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "#333333", display: "block", marginTop: "4px" }}>2X2</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. INTERACTIVE CUSTOM STUDIO SECTION */}
        <div ref={studioRef} style={{ paddingTop: "2rem" }}>
          
          <div style={{ backgroundColor: "#FAFAF8", borderRadius: "28px", padding: "3rem 2.5rem", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 15px 40px rgba(0,0,0,0.03)" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#666", fontWeight: "700" }}>
                  Polacraft Archival Studio
                </span>
                <h2 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#111111", margin: "0.25rem 0 0 0" }}>
                  Customizing: {layoutLabel}
                </h2>
              </div>

              {/* Layout Switcher Tabs */}
              <div style={{ display: "flex", backgroundColor: "#EFECE6", borderRadius: "100px", padding: "4px" }}>
                {[
                  { id: "single", label: "Single Poster" },
                  { id: "split-3", label: "3-Panel Split" },
                  { id: "split-2x2", label: "2x2 Grid Split" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveLayout(tab.id as any)}
                    style={{
                      padding: "0.55rem 1.1rem",
                      borderRadius: "100px",
                      border: "none",
                      backgroundColor: activeLayout === tab.id ? "#111111" : "transparent",
                      color: activeLayout === tab.id ? "#FFFFFF" : "#555555",
                      fontWeight: "700",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* STUDIO MAIN GRID */}
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.1fr",
                gap: "4rem",
                alignItems: "start"
              }}
              className="customizer-studio-grid"
            >
              
              {/* LEFT PREVIEW */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div 
                  style={{
                    backgroundColor: "#EFECE6",
                    padding: "3.5rem 2.5rem",
                    borderRadius: "24px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)"
                  }}
                >
                  <span style={{ position: "absolute", top: "1.25rem", left: "1.25rem", fontSize: "0.75rem", fontWeight: "700", color: "#111111", backgroundColor: "#FFFFFF", padding: "0.35rem 0.8rem", borderRadius: "100px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                    {selectedSize} • {isFramed ? `${selectedFrame.toUpperCase()} FRAME` : "UNFRAMED"}
                  </span>

                  <div style={{ width: "100%", maxWidth: "340px" }}>
                    <PosterRenderer poster={customPoster} frame={selectedFrame} />
                  </div>

                  {!previewUrl && (
                    <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "#666666", fontStyle: "italic", textAlign: "center" }}>
                      * Upload your custom artwork on the right to see live preview.
                    </p>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(17,17,17,0.08)", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <ShieldCheck size={24} style={{ color: "#111111", flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: "0.85rem", fontWeight: "700" }}>250 GSM Cotton</h4>
                      <p style={{ fontSize: "0.75rem", color: "#666666" }}>Acid-free archival paper</p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(17,17,17,0.08)", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <Truck size={24} style={{ color: "#111111", flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: "0.85rem", fontWeight: "700" }}>Safe Tube Ship</h4>
                      <p style={{ fontSize: "0.75rem", color: "#666666" }}>3.5mm thick eco tube</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT CONTROLS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                
                {/* UPLOAD DROPZONE */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666666" }}>
                    Step 1: Upload Your Custom Design
                  </span>

                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: "2px dashed rgba(17,17,17,0.15)",
                      borderRadius: "20px",
                      padding: "2.5rem 1.5rem",
                      textAlign: "center",
                      backgroundColor: previewUrl ? "#FFFFFF" : "#FFFFFF",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "1rem"
                    }}
                  >
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp, image/avif" 
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      style={{ display: "none" }}
                    />

                    {previewUrl ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", width: "100%" }}>
                        <div style={{ width: "64px", height: "64px", borderRadius: "12px", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                          <Image src={previewUrl} alt="Custom Preview" fill style={{ objectFit: "cover" }} />
                        </div>
                        <div style={{ textAlign: "left", flexGrow: 1, overflow: "hidden" }}>
                          <h4 style={{ fontSize: "0.95rem", fontWeight: "700", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {selectedFile?.name || "Uploaded Artwork"}
                          </h4>
                          <p style={{ fontSize: "0.8rem", color: "#666666" }}>
                            {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "Ready to print"} • {isUploading ? "Uploading..." : "Uploaded ✓"}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setUploadedUrl(null);
                          }}
                          style={{ padding: "0.5rem", borderRadius: "50%", backgroundColor: "#EFECE6", cursor: "pointer", border: "none" }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#EFECE6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Upload size={24} style={{ color: "#111111" }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#111111" }}>Drag & Drop your artwork here</h4>
                          <p style={{ fontSize: "0.85rem", color: "#666666", marginTop: "4px" }}>
                            or click to browse files (PNG, JPG, WEBP up to 10MB)
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {uploadError && (
                    <p style={{ fontSize: "0.85rem", color: "red", fontWeight: "500" }}>⚠️ {uploadError}</p>
                  )}
                </div>

                {/* CUSTOM TITLE */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666666" }}>
                    Step 2: Title / Caption (Optional)
                  </span>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. My Custom Artwork"
                    style={{
                      width: "100%",
                      padding: "0.85rem 1.25rem",
                      borderRadius: "14px",
                      border: "1.5px solid rgba(17,17,17,0.12)",
                      backgroundColor: "#FFFFFF",
                      fontSize: "0.95rem",
                      outline: "none"
                    }}
                  />
                </div>

                {/* SIZE SELECTION */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666666" }}>
                      Step 3: Choose Size
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "#111111",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                    >
                      <Ruler size={14} /> Size Guide
                    </button>
                  </div>

                  <SizeGuideModal
                    isOpen={isSizeGuideOpen}
                    onClose={() => setIsSizeGuideOpen(false)}
                    selectedSize={selectedSize}
                    onSelectSize={(sz) => {
                      setSelectedSize(sz);
                      setIsSizeGuideOpen(false);
                    }}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                    {[
                      { id: "A5", label: "A5 (15x21 cm)" },
                      { id: "A4", label: "A4 (21x30 cm)" },
                      { id: "A3", label: "A3 (30x42 cm)" }
                    ].map((item) => {
                      const isSelected = selectedSize === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedSize(item.id as any)}
                          style={{
                            padding: "1rem 0.5rem",
                            borderRadius: "14px",
                            border: isSelected ? "2px solid #111111" : "1.5px solid rgba(17,17,17,0.12)",
                            backgroundColor: isSelected ? "#111111" : "#FFFFFF",
                            color: isSelected ? "#FFFFFF" : "#111111",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.25rem"
                          }}
                        >
                          <span style={{ fontSize: "0.95rem", fontWeight: "700" }}>{item.id}</span>
                          <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FRAME SELECTION */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666666" }}>
                    Step 4: Select Frame Option
                  </span>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    {[
                      { id: "unframed", title: "Unframed (Print Only)", total: `₹${basePrice}` },
                      { id: "black", title: "Matte Black Frame", total: `₹${unitPrice}` },
                      { id: "white", title: "Studio White Frame", total: `₹${unitPrice}` },
                      { id: "wood", title: "Teak Wood Frame", total: `₹${unitPrice}` }
                    ].map((f) => {
                      const isSelected = selectedFrame === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFrame(f.id as any)}
                          style={{
                            padding: "1rem 1.25rem",
                            borderRadius: "14px",
                            border: isSelected ? "2px solid #111111" : "1.5px solid rgba(17,17,17,0.12)",
                            backgroundColor: isSelected ? "#EFECE6" : "#FFFFFF",
                            color: "#111111",
                            cursor: "pointer",
                            textAlign: "left",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <div>
                            <h4 style={{ fontSize: "0.85rem", fontWeight: "700" }}>{f.title}</h4>
                            <p style={{ fontSize: "0.75rem", color: "#666666", marginTop: "2px" }}>{f.total} total</p>
                          </div>
                          {isSelected && <Check size={16} style={{ color: "#111111" }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PRICE & ORDER SUMMARY */}
                <div style={{ backgroundColor: "#FFFFFF", padding: "1.5rem", borderRadius: "18px", border: "1px solid rgba(17,17,17,0.08)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span style={{ color: "#666666" }}>Format & Size ({layoutLabel}, {selectedSize}):</span>
                    <span style={{ fontWeight: "600" }}>₹{unitPrice}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span style={{ color: "#666666" }}>Shipping:</span>
                    <span style={{ fontWeight: "600", color: shippingCost === 0 ? "green" : "#111111" }}>
                      {shippingCost === 0 ? "FREE Shipping 🎉" : "₹60 Flat Rate"}
                    </span>
                  </div>
                  <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(17,17,17,0.08)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "800" }}>
                    <span>Grand Total:</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <button
                    onClick={handleWhatsAppOrder}
                    style={{
                      width: "100%",
                      backgroundColor: "#25D366",
                      color: "#FFFFFF",
                      padding: "1.1rem",
                      borderRadius: "100px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.75rem",
                      boxShadow: "0 10px 25px rgba(37, 211, 102, 0.25)",
                      cursor: "pointer",
                      border: "none"
                    }}
                  >
                    <MessageSquare size={20} /> Order Custom Design via WhatsApp
                  </button>

                  <button
                    onClick={handleAddToCart}
                    style={{
                      width: "100%",
                      backgroundColor: "#111111",
                      color: "#FFFFFF",
                      padding: "1.1rem",
                      borderRadius: "100px",
                      fontSize: "1rem",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.75rem",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      border: "none"
                    }}
                  >
                    <ShoppingBag size={20} /> Add Custom Print to Bag (₹{subtotal})
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .customizer-studio-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </div>
  );
}
