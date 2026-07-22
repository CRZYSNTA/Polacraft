'use client';

import React, { useState } from "react";
import { Bug, Send, Loader2, CheckCircle2, AlertTriangle, Terminal, Code, Eye } from "lucide-react";

export default function VisionDebuggerCard() {
  const [testImageUrl, setTestImageUrl] = useState("https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600");
  const [loading, setLoading] = useState(false);
  const [debugResult, setDebugResult] = useState<any | null>(null);

  const handleRunDebugger = async () => {
    if (!testImageUrl) return;

    setLoading(true);
    setDebugResult(null);

    try {
      const res = await fetch("/api/admin/ai/vision-debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: testImageUrl }),
      });

      const json = await res.json();
      setDebugResult(json.debugTrace || json);
    } catch (err: any) {
      setDebugResult({
        errorMessage: err.message || "Failed to execute Vision Debugger API call",
        executionTimeMs: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0F172A",
        border: "1px solid rgba(212, 175, 55, 0.35)",
        borderRadius: "24px",
        padding: "1.75rem",
        marginBottom: "2rem",
        color: "#F8FAFC",
        boxShadow: "0 15px 40px rgba(0,0,0,0.4)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "12px", backgroundColor: "rgba(212, 175, 55, 0.15)", border: "1px solid rgba(212, 175, 55, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#D4AF37" }}>
          <Bug size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, color: "#F8FAFC", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Phase 2.2 — Vision AI Debugger Inspector
            <span style={{ fontSize: "0.7rem", backgroundColor: "rgba(212, 175, 55, 0.2)", color: "#D4AF37", padding: "0.2rem 0.6rem", borderRadius: "100px", fontWeight: "700" }}>
              Live Trace
            </span>
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: "2px" }}>
            Inspect raw HTTP status, payload, OCR text extraction, and response JSON directly from OpenAI Vision.
          </p>
        </div>
      </div>

      {/* Input URL Bar */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <input
          type="text"
          value={testImageUrl}
          onChange={(e) => setTestImageUrl(e.target.value)}
          placeholder="Paste public poster image URL..."
          style={{ flexGrow: 1, padding: "0.75rem 1rem", borderRadius: "12px", backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.12)", color: "#F8FAFC", fontSize: "0.85rem", outline: "none" }}
        />
        <button
          type="button"
          onClick={handleRunDebugger}
          disabled={loading || !testImageUrl}
          style={{
            backgroundColor: loading || !testImageUrl ? "#334155" : "#D4AF37",
            color: "#0F172A",
            fontWeight: "800",
            fontSize: "0.88rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            border: "none",
            cursor: loading || !testImageUrl ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {loading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
          {loading ? "Inspecting..." : "Run Vision Debugger"}
        </button>
      </div>

      {/* Inspector Results Accordion */}
      {debugResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          
          {/* Status Header */}
          <div style={{ padding: "1rem 1.25rem", borderRadius: "14px", backgroundColor: debugResult.errorMessage ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.12)", border: debugResult.errorMessage ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: debugResult.errorMessage ? "#FCA5A5" : "#4ADE80", fontWeight: "700", fontSize: "0.88rem" }}>
              {debugResult.errorMessage ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              {debugResult.errorMessage ? `Vision Error: ${debugResult.errorMessage}` : `HTTP ${debugResult.httpStatus || 200} OK — Response parsed in ${debugResult.executionTimeMs}ms`}
            </div>
            <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
              Model: gpt-4o-mini
            </span>
          </div>

          {/* Grid Layout: Request Payload vs Parsed JSON */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {/* Step 1: Request Payload */}
            <div style={{ backgroundColor: "#1E293B", borderRadius: "16px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94A3B8", fontWeight: "800", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Terminal size={14} /> 1. Request Payload
              </h4>
              <pre style={{ backgroundColor: "#0F172A", padding: "1rem", borderRadius: "10px", color: "#CBD5E1", fontSize: "0.75rem", overflowX: "auto", maxHeight: "250px" }}>
                {JSON.stringify(debugResult.requestPayload, null, 2)}
              </pre>
            </div>

            {/* Step 2: Parsed Vision + OCR Facts */}
            <div style={{ backgroundColor: "#1E293B", borderRadius: "16px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94A3B8", fontWeight: "800", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Code size={14} /> 2. Extracted Vision Facts (JSON)
              </h4>
              <pre style={{ backgroundColor: "#0F172A", padding: "1rem", borderRadius: "10px", color: "#4ADE80", fontSize: "0.75rem", overflowX: "auto", maxHeight: "250px" }}>
                {JSON.stringify(debugResult.parsedJson || { error: debugResult.errorMessage }, null, 2)}
              </pre>
            </div>
          </div>

        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
