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
  Image as ImageIcon, 
  Check, 
  ShoppingBag, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Info,
  RefreshCw,
  X,
  Ruler
} from "lucide-react";
import SizeGuideModal from "../../components/SizeGuideModal";

export default function CustomPrintStudio() {
  const { addToCart, setCartOpen } = useContext(AppContext);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Frame Rates by Size
  const FRAMED_TOTALS: Record<string, number> = {
    A5: 200,
    A4: 250,
    A3: 300
  };

  // Calculate Unit Price
  const basePrice = BASE_RATES[selectedSize] || 70;
  const isFramed = selectedFrame !== "unframed";
  const unitPrice = isFramed ? (FRAMED_TOTALS[selectedSize] || 250) : basePrice;
  const subtotal = unitPrice * quantity;
  const shippingCost = subtotal >= 800 ? 0 : 60;
  const grandTotal = subtotal + shippingCost;

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
        console.warn("Upload fallback to local object URL:", data.error);
        setUploadedUrl(objectUrl);
      }
    } catch (e) {
      console.warn("Upload connection warning, using local preview:", e);
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

  // Construct Synthetic Poster Object for Live PosterRenderer Preview
  const customPoster: Product = {
    id: "custom-print-" + Date.now(),
    slug: "custom-artwork",
    title: customTitle || "Custom Fine Art Print",
    film: "Custom Collector Design",
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
    price: basePrice,
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
  };

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
    <div style={{ paddingTop: "140px", paddingBottom: "100px", minHeight: "100vh" }}>
      <div className="container">
        
        {/* EDITORIAL HEADER */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", fontWeight: "600" }}>
            Custom Fine Art Studio
          </span>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: "800", letterSpacing: "-0.04em", marginTop: "0.5rem" }}>
            Print Your Custom Design
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "48ch", margin: "1rem auto 0 auto" }}>
            Upload your personal artwork, movie posters, or photography for museum-quality 250 GSM cotton archival giclée printing.
          </p>
        </div>

        {/* MAIN CUSTOMIZER GRID */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: "5rem",
            alignItems: "start"
          }}
          className="customizer-studio-grid"
        >
          
          {/* LEFT: LIVE 3D REAL FRAME PREVIEW */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div 
              style={{
                backgroundColor: "var(--accent-beige)",
                padding: "3.5rem 2.5rem",
                borderRadius: "28px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)"
              }}
            >
              {/* Size Badge Overlay */}
              <span style={{ position: "absolute", top: "1.5rem", left: "1.5rem", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-dark)", backgroundColor: "#FFFFFF", padding: "0.35rem 0.8rem", borderRadius: "100px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                {selectedSize} • {isFramed ? `${selectedFrame.toUpperCase()} FRAME` : "UNFRAMED"}
              </span>

              {/* 3D Frame Rendering */}
              <div style={{ width: "100%", maxWidth: "340px" }} className="hover-lift">
                <PosterRenderer poster={customPoster} frame={selectedFrame} />
              </div>

              {!previewUrl && (
                <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center" }}>
                  * Upload your custom artwork on the right to see live 3D frame preview.
                </p>
              )}
            </div>

            {/* Quality Guarantee Specs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--border-color)", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <ShieldCheck size={24} style={{ color: "var(--text-dark)", flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "700" }}>250 GSM Cotton</h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Acid-free archival paper</p>
                </div>
              </div>

              <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--border-color)", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Truck size={24} style={{ color: "var(--text-dark)", flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "700" }}>Safe Tube Ship</h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>3.5mm thick eco tube</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTROLS & FILE UPLOAD */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* 1. FILE UPLOAD DROPZONE */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
                Step 1: Upload Your Custom Design
              </span>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed var(--border-color)",
                  borderRadius: "20px",
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  backgroundColor: previewUrl ? "#FAFAF8" : "#FFFFFF",
                  cursor: "pointer",
                  transition: "var(--transition-smooth)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem"
                }}
                className="hover-warm"
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
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
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
                      style={{ padding: "0.5rem", borderRadius: "50%", backgroundColor: "var(--accent-beige)", cursor: "pointer" }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "var(--accent-beige)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Upload size={24} style={{ color: "var(--text-dark)" }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: "700" }}>Drag & Drop your artwork here</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
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

            {/* 2. ARTWORK TITLE / CAPTION */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
                Step 2: Custom Title / Caption (Optional)
              </span>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. My Custom Movie Artwork"
                style={{
                  width: "100%",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "14px",
                  border: "1.5px solid var(--border-color)",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.95rem"
                }}
              />
            </div>

            {/* 3. SIZE SELECTION */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
                  Step 3: Choose Size
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "var(--text-dark)",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  <Ruler size={14} /> Size Guide & Scale
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
                  { id: "A5", label: "A5 (15x21 cm)", diff: "-₹25" },
                  { id: "A4", label: "A4 (21x30 cm)", diff: "Base" },
                  { id: "A3", label: "A3 (30x42 cm)", diff: "+₹30" }
                ].map((item) => {
                  const isSelected = selectedSize === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedSize(item.id as any)}
                      style={{
                        padding: "1rem 0.5rem",
                        borderRadius: "14px",
                        border: isSelected ? "2px solid var(--text-dark)" : "1.5px solid var(--border-color)",
                        backgroundColor: isSelected ? "var(--text-dark)" : "#FFFFFF",
                        color: isSelected ? "#FFFFFF" : "var(--text-dark)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.25rem",
                        transition: "var(--transition-fast)"
                      }}
                    >
                      <span style={{ fontSize: "0.95rem", fontWeight: "700" }}>{item.id}</span>
                      <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. FRAME SELECTION */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
                  Step 4: Select Real 3D Gallery Frame
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-dark)" }}>
                  Total: ₹{unitPrice}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {[
                  { id: "unframed", title: "Unframed (Print Only)", total: `₹${basePrice}` },
                  { id: "black", title: "Sleek Matte Black Frame", total: `₹${FRAMED_TOTALS[selectedSize]}` },
                  { id: "white", title: "Minimal Studio White Frame", total: `₹${FRAMED_TOTALS[selectedSize]}` },
                  { id: "wood", title: "Teak Solid Wood Frame", total: `₹${FRAMED_TOTALS[selectedSize]}` }
                ].map((f) => {
                  const isSelected = selectedFrame === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFrame(f.id as any)}
                      style={{
                        padding: "1rem 1.25rem",
                        borderRadius: "14px",
                        border: isSelected ? "2px solid var(--text-dark)" : "1.5px solid var(--border-color)",
                        backgroundColor: isSelected ? "var(--accent-beige)" : "#FFFFFF",
                        color: "var(--text-dark)",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "var(--transition-fast)"
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: "0.85rem", fontWeight: "700" }}>{f.title}</h4>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{f.total} incl. frame</p>
                      </div>
                      {isSelected && <Check size={16} style={{ color: "var(--text-dark)" }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. PRICING & SHIPPING NOTIFICATION SUMMARY */}
            <div style={{ backgroundColor: "#F7F7F4", padding: "1.5rem", borderRadius: "18px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Unit Price ({selectedSize}, {selectedFrame}):</span>
                <span style={{ fontWeight: "600" }}>₹{unitPrice}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Shipping Fee:</span>
                <span style={{ fontWeight: "600", color: shippingCost === 0 ? "green" : "var(--text-dark)" }}>
                  {shippingCost === 0 ? "FREE Shipping 🎉" : "₹60 Flat Rate"}
                </span>
              </div>
              <div style={{ width: "100%", height: "1px", backgroundColor: "var(--border-color)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "800" }}>
                <span>Grand Total:</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* 6. ORDER ACTION BUTTONS */}
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
                className="btn-magnetic"
              >
                <MessageSquare size={20} /> Order Custom Design via WhatsApp
              </button>

              <button
                onClick={handleAddToCart}
                style={{
                  width: "100%",
                  backgroundColor: "var(--accent-charcoal)",
                  color: "#FAFAF8",
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
                className="btn-magnetic"
              >
                <ShoppingBag size={20} /> Add Custom Print to Bag (₹{subtotal})
              </button>
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
