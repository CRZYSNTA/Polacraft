"use client";

import React, { useState, useTransition } from "react";
import { loginAdminAction } from "@/features/admin/actions";
import { ShieldCheck, Lock, Mail, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await loginAdminAction(null, formData);

      if (result?.success) {
        // Redirect to dashboard on successful login
        router.push(callbackUrl);
        router.refresh();
      } else {
        setErrorMessage(result?.error || "Invalid email or password.");
      }
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        backgroundImage: "radial-gradient(circle at 50% 30%, #1E293B 0%, #0F172A 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        color: "#FFFFFF",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "rgba(30, 41, 59, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          padding: "2.5rem 2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
              marginBottom: "0.5rem",
            }}
          >
            <ShieldCheck size={30} style={{ color: "#FFFFFF" }} />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "900", letterSpacing: "-0.03em", margin: 0 }}>
            POLACRAFT ADMIN
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#94A3B8", margin: 0 }}>
            Management Authentication Console
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              padding: "0.85rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.85rem",
              color: "#FCA5A5",
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#CBD5E1" }}>
              Administrator Email
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Mail size={18} style={{ position: "absolute", left: "14px", color: "#64748B" }} />
              <input
                type="email"
                required
                placeholder="admin@polacraft.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  padding: "0.8rem 1rem 0.8rem 2.6rem",
                  fontSize: "0.9rem",
                  color: "#FFFFFF",
                  outline: "none",
                  transition: "border 0.2s ease",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#CBD5E1" }}>
              Password
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Lock size={18} style={{ position: "absolute", left: "14px", color: "#64748B" }} />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  padding: "0.8rem 1rem 0.8rem 2.6rem",
                  fontSize: "0.9rem",
                  color: "#FFFFFF",
                  outline: "none",
                  transition: "border 0.2s ease",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{
              marginTop: "0.5rem",
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: "0.95rem",
              padding: "0.9rem",
              borderRadius: "12px",
              border: "none",
              cursor: isPending ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
              transition: "transform 0.1s ease, background-color 0.2s ease",
            }}
          >
            {isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Verifying Credentials...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        {/* Footer info */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Link
            href="/"
            style={{
              fontSize: "0.8rem",
              color: "#94A3B8",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <ArrowLeft size={14} /> Back to Storefront
          </Link>

          <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
            v1.0 • HTTPS Only
          </span>
        </div>
      </div>
    </div>
  );
}
