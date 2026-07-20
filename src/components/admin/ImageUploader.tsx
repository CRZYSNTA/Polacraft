"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Link2, CheckCircle2 } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  publicId?: string;
  onChange: (url: string, publicId?: string) => void;
  label?: string;
  folder?: string;
  placeholder?: string;
}

export default function ImageUploader({
  value,
  publicId,
  onChange,
  label = "Upload Image",
  folder = "GALLERY",
  placeholder = "https://images.unsplash.com/...",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP, AVIF).");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.secure_url) {
        onChange(data.secure_url, data.public_id);
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("[ImageUploader Error]:", err);
      alert("An error occurred while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>{label}</label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            style={{
              fontSize: "0.75rem",
              color: "#3B82F6",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600,
            }}
          >
            <Link2 size={12} /> {showUrlInput ? "Use File Upload" : "Paste URL directly"}
          </button>
        </div>
      )}

      {value && !showUrlInput ? (
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0.75rem",
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#1E1E1E",
              flexShrink: 0,
              border: "1px solid #E2E8F0",
            }}
          >
            <img
              src={value}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          <div style={{ flexGrow: 1, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#10B981", fontSize: "0.75rem", fontWeight: 800 }}>
              <CheckCircle2 size={12} /> Cloudinary secure_url
            </div>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {value}
            </p>
            {publicId && (
              <span style={{ fontSize: "0.65rem", color: "#94A3B8" }}>
                ID: {publicId}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onChange("", undefined)}
            title="Remove image"
            style={{
              background: "#FEE2E2",
              color: "#EF4444",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>
      ) : showUrlInput ? (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value, undefined)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
            fontSize: "0.85rem",
          }}
        />
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: dragActive ? "2px solid #10B981" : "2px dashed #CBD5E1",
            backgroundColor: dragActive ? "#ECFDF5" : "#F8FAFC",
            borderRadius: "12px",
            padding: "1.25rem 1rem",
            textAlign: "center",
            cursor: isUploading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {isUploading ? (
            <>
              <Loader2 size={24} className="animate-spin" style={{ color: "#10B981" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10B981" }}>
                Uploading to Cloudinary & optimizing format...
              </span>
            </>
          ) : (
            <>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#E2E8F0",
                  color: "#475569",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UploadCloud size={20} />
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B" }}>
                Click to Choose Image or Drag & Drop
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                Uploads to Cloudinary, auto-compresses (WebP/AVIF) & stores <code style={{ backgroundColor: "#E2E8F0", padding: "1px 4px", borderRadius: "3px" }}>public_id</code>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
