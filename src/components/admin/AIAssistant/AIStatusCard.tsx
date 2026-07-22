'use client';

import React, { useState, useEffect } from "react";
import { Cpu, CheckCircle2, XCircle, ShieldCheck, Activity, Loader2, RefreshCw } from "lucide-react";

export default function AIStatusCard() {
  const [statusData, setStatusData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAIStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/ai/status");
      if (res.ok) {
        const json = await res.json();
        setStatusData(json);
      } else {
        const errJson = await res.json();
        setError(errJson.reason || "Failed to load AI status");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error fetching AI status";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIStatus();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#0F172A",
        border: "1px solid rgba(212, 175, 55, 0.3)",
        borderRadius: "20px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        color: "#F8FAFC",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Cpu size={20} style={{ color: "#D4AF37" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: 0 }}>
            AI Provider Infrastructure Status
          </h3>
          <span style={{ fontSize: "0.7rem", backgroundColor: "rgba(212, 175, 55, 0.2)", color: "#D4AF37", padding: "0.2rem 0.6rem", borderRadius: "100px", fontWeight: "700" }}>
            Polacraft v1.2.1
          </span>
        </div>

        <button
          type="button"
          onClick={fetchAIStatus}
          disabled={loading}
          style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem" }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "1.5rem", textAlign: "center", color: "#94A3B8", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <Loader2 size={18} className="animate-spin" /> Querying AI Provider Factory & Health Checks...
        </div>
      ) : error ? (
        <div style={{ padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.15)", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#FCA5A5", fontSize: "0.85rem" }}>
          ⚠️ {error}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Current Active Provider Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "#1E293B", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "700", textTransform: "uppercase" }}>Active Provider</span>
              <h4 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#F8FAFC", margin: "2px 0 0 0" }}>
                {statusData?.currentProvider?.name || "OpenAI"}
              </h4>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "100px", backgroundColor: "rgba(212, 175, 55, 0.15)", color: "#D4AF37", fontWeight: "800", border: "1px solid rgba(212, 175, 55, 0.3)" }}>
                Mock Mode Active
              </span>
              <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "100px", backgroundColor: statusData?.currentProvider?.available ? "rgba(34, 197, 94, 0.15)" : "rgba(148, 163, 184, 0.15)", color: statusData?.currentProvider?.available ? "#4ADE80" : "#94A3B8", fontWeight: "800" }}>
                {statusData?.currentProvider?.available ? "✓ API Key Configured" : "Fallback Available"}
              </span>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.85rem" }}>
            <div style={{ padding: "0.85rem", backgroundColor: "#1E293B", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#CBD5E1", fontWeight: "600" }}>Text Generation</span>
              {statusData?.currentProvider?.capabilities?.textGeneration ? (
                <CheckCircle2 size={16} style={{ color: "#4ADE80" }} />
              ) : (
                <XCircle size={16} style={{ color: "#F87171" }} />
              )}
            </div>

            <div style={{ padding: "0.85rem", backgroundColor: "#1E293B", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#CBD5E1", fontWeight: "600" }}>Vision Analysis</span>
              {statusData?.currentProvider?.capabilities?.visionAnalysis ? (
                <CheckCircle2 size={16} style={{ color: "#4ADE80" }} />
              ) : (
                <XCircle size={16} style={{ color: "#F87171" }} />
              )}
            </div>

            <div style={{ padding: "0.85rem", backgroundColor: "#1E293B", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#CBD5E1", fontWeight: "600" }}>Structured Output</span>
              {statusData?.currentProvider?.capabilities?.structuredOutput ? (
                <CheckCircle2 size={16} style={{ color: "#4ADE80" }} />
              ) : (
                <XCircle size={16} style={{ color: "#F87171" }} />
              )}
            </div>
          </div>

          {/* All Registered Providers Health List */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
            {statusData?.allProviders?.map((prov: any, idx: number) => (
              <div key={idx} style={{ flex: 1, padding: "0.75rem 1rem", backgroundColor: "#1E293B", borderRadius: "12px", fontSize: "0.78rem", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700", color: "#F8FAFC" }}>{prov.providerName}</span>
                <span style={{ color: prov.available ? "#4ADE80" : "#94A3B8", fontWeight: "600" }}>
                  {prov.available ? "Configured" : "Mock Ready"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
