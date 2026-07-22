'use client';

import React from "react";
import { Sparkles, Sliders, Check } from "lucide-react";
import AIStatusCard from "./AIStatusCard";

interface AISettingsPanelProps {
  settings: {
    aiEnabled: boolean;
    aiProvider?: string;
    aiVisionEnabled: boolean;
    aiMetadataEnabled: boolean;
    aiSocialCaptionsEnabled: boolean;
    aiDefaultTone: string;
    aiDefaultLanguage: string;
    aiMaxDescriptionLength: number;
  };
  onChange: (field: string, value: any) => void;
}

export default function AISettingsPanel({ settings, onChange }: AISettingsPanelProps) {
  return (
    <div>
      {/* Infrastructure Status Card */}
      <AIStatusCard />

      <div
        style={{
          backgroundColor: "#1E293B",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          padding: "2rem",
          marginBottom: "2rem"
        }}
      >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <Sliders size={22} style={{ color: "#D4AF37" }} />
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#F8FAFC" }}>
            AI Product Assistant Settings
          </h3>
          <p style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "2px" }}>
            Configure Vision AI analysis, metadata verification, tone defaults, and description bounds.
          </p>
        </div>
      </div>

      {/* Provider Switcher Card */}
      <div style={{ backgroundColor: "#0F172A", padding: "1.25rem 1.5rem", borderRadius: "18px", border: "1px solid rgba(212, 175, 55, 0.25)", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.75rem", color: "#D4AF37", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>Single Setting Provider Switcher</span>
          <h4 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#F8FAFC", margin: "2px 0 0 0" }}>Active AI Model Provider</h4>
          <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "2px 0 0 0" }}>Switch instantly between OpenAI, Google Gemini, and Anthropic Claude.</p>
        </div>

        <select
          value={settings.aiProvider || "openai"}
          onChange={(e) => onChange("aiProvider", e.target.value)}
          style={{
            backgroundColor: "#1E293B",
            color: "#F8FAFC",
            border: "1.5px solid #D4AF37",
            borderRadius: "12px",
            padding: "0.65rem 1.25rem",
            fontSize: "0.9rem",
            fontWeight: "700",
            cursor: "pointer",
            outline: "none"
          }}
        >
          <option value="openai">OpenAI (GPT-4o Mini / GPT-4o)</option>
          <option value="gemini">Google Gemini (Gemini 1.5 Pro / Flash)</option>
          <option value="anthropic">Anthropic (Claude 3.5 Sonnet / Haiku)</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "1.75rem" }} className="ai-settings-grid">
        {/* Toggle 1: Enable AI */}
        <div style={{ backgroundColor: "#0F172A", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#F8FAFC" }}>Enable AI Assistant</span>
            <input
              type="checkbox"
              checked={settings.aiEnabled}
              onChange={(e) => onChange("aiEnabled", e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#D4AF37", cursor: "pointer" }}
            />
          </div>
          <p style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Master toggle for AI listing generation module.</p>
        </div>

        {/* Toggle 2: Enable Vision AI */}
        <div style={{ backgroundColor: "#0F172A", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#F8FAFC" }}>Enable Vision AI</span>
            <input
              type="checkbox"
              checked={settings.aiVisionEnabled}
              onChange={(e) => onChange("aiVisionEnabled", e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#D4AF37", cursor: "pointer" }}
            />
          </div>
          <p style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Analyze uploaded poster artwork & visual features.</p>
        </div>

        {/* Toggle 3: Enable Metadata Lookup */}
        <div style={{ backgroundColor: "#0F172A", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#F8FAFC" }}>Metadata Verification</span>
            <input
              type="checkbox"
              checked={settings.aiMetadataEnabled}
              onChange={(e) => onChange("aiMetadataEnabled", e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#D4AF37", cursor: "pointer" }}
            />
          </div>
          <p style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Verify film release year, director & main cast.</p>
        </div>

        {/* Toggle 4: Enable Social Captions */}
        <div style={{ backgroundColor: "#0F172A", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#F8FAFC" }}>Social Captions</span>
            <input
              type="checkbox"
              checked={settings.aiSocialCaptionsEnabled}
              onChange={(e) => onChange("aiSocialCaptionsEnabled", e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#D4AF37", cursor: "pointer" }}
            />
          </div>
          <p style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Auto-generate Instagram, FB & X launch posts.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="ai-settings-grid">
        <div>
          <label style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: "700" }}>Default Writing Tone</label>
          <select
            value={settings.aiDefaultTone}
            onChange={(e) => onChange("aiDefaultTone", e.target.value)}
            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "10px", backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.85rem", marginTop: "4px" }}
          >
            <option value="Collector Focused">Collector Focused</option>
            <option value="Elegant & Premium">Elegant & Premium</option>
            <option value="Minimalist Editorial">Minimalist Editorial</option>
            <option value="Professional Studio">Professional Studio</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: "700" }}>Default Language</label>
          <select
            value={settings.aiDefaultLanguage}
            onChange={(e) => onChange("aiDefaultLanguage", e.target.value)}
            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "10px", backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.85rem", marginTop: "4px" }}
          >
            <option value="English">English</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Bilingual">Bilingual (English + Malayalam)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: "700" }}>Max Description Length (Words)</label>
          <input
            type="number"
            value={settings.aiMaxDescriptionLength}
            onChange={(e) => onChange("aiMaxDescriptionLength", parseInt(e.target.value) || 120)}
            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "10px", backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: "0.85rem", marginTop: "4px" }}
          />
        </div>
      </div>
    </div>
  </div>
  );
}
