"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Apple, ChevronDown, ChevronUp } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);

  // Manual form state
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await signIn("google", { callbackUrl });
    } catch (e) {
      console.error("[Google Auth Error]:", e);
      setErrorMsg("Failed to initialize Google Sign-In.");
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const endpoint = isRegisterMode ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegisterMode ? { email, password, name, phone } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.authenticated || data.user)) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setErrorMsg(data.error || "Authentication failed.");
      }
    } catch (err) {
      console.error("[Manual Auth Error]:", err);
      setErrorMsg("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0B0C10",
        color: "#F3F4F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 1.5rem 80px 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND LUXURY GLOW */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "500px",
          backgroundColor: "#D4AF37",
          opacity: 0.05,
          filter: "blur(120px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "440px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        
        {/* BRANDING HEADER */}
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: "#D4AF37",
              fontWeight: 800,
            }}
          >
            Polacraft Cinema Club
          </span>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2.5rem",
              fontWeight: "900",
              margin: "0.5rem 0 0 0",
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
            }}
          >
            Collector Account
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#9CA3AF", marginTop: "0.5rem" }}>
            Join the archival fine art cinema poster community.
          </p>
        </div>

        {/* GLASS CARD */}
        <div
          style={{
            backgroundColor: "rgba(18, 20, 26, 0.85)",
            backdropFilter: "blur(16px)",
            borderRadius: "24px",
            padding: "2.5rem 2rem",
            border: "1px solid rgba(212, 175, 55, 0.15)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          {errorMsg && (
            <div
              style={{
                padding: "0.8rem 1rem",
                borderRadius: "12px",
                backgroundColor: "rgba(220, 38, 38, 0.15)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                color: "#FCA5A5",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* 1. PRIMARY LOW-FRICTION ACTION: CONTINUE WITH GOOGLE */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.9rem 1rem",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backgroundColor: "#FFFFFF",
              color: "#111827",
              fontWeight: 800,
              fontSize: "0.98rem",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* 2. DIVIDER */}
          <div style={{ display: "flex", alignItems: "center", margin: "1.75rem 0", color: "#6B7280" }}>
            <div style={{ flex: 1, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}></div>
            <span style={{ padding: "0 0.85rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              ──────── OR ────────
            </span>
            <div style={{ flex: 1, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}></div>
          </div>

          {/* 3. EXPANDABLE MANUAL ACCOUNT CREATION */}
          {!showManualForm ? (
            <button
              type="button"
              onClick={() => setShowManualForm(true)}
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "14px",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                backgroundColor: "rgba(212, 175, 55, 0.05)",
                color: "#D4AF37",
                fontWeight: 800,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease",
              }}
            >
              Create account manually <ChevronDown size={16} />
            </button>
          ) : (
            <form onSubmit={handleManualSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "4px", marginBottom: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: !isRegisterMode ? "#D4AF37" : "transparent",
                    color: !isRegisterMode ? "#111" : "#AAA",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: isRegisterMode ? "#D4AF37" : "transparent",
                    color: isRegisterMode ? "#111" : "#AAA",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </button>
              </div>

              {isRegisterMode && (
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9CA3AF", marginBottom: "0.3rem" }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", backgroundColor: "#1A1D24", border: "1px solid #333", color: "#FFF", fontSize: "0.85rem" }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9CA3AF", marginBottom: "0.3rem" }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", backgroundColor: "#1A1D24", border: "1px solid #333", color: "#FFF", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9CA3AF", marginBottom: "0.3rem" }}>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", backgroundColor: "#1A1D24", border: "1px solid #333", color: "#FFF", fontSize: "0.85rem" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#D4AF37",
                  color: "#111111",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                {isRegisterMode ? "Create Account" : "Log In"}
              </button>
            </form>
          )}

          {/* PRIVACY NOTICE */}
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", marginTop: "1.75rem", lineHeight: 1.5 }}>
            By continuing, you agree to Polacraft’s{" "}
            <Link href="/terms" style={{ color: "#D4AF37", textDecoration: "none" }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ color: "#D4AF37", textDecoration: "none" }}>
              Privacy Policy
            </Link>.
          </p>
        </div>

        {/* STOREFRONT FOOTER */}
        <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
          <Link href="/shop" style={{ fontSize: "0.85rem", color: "#9CA3AF", textDecoration: "none", fontWeight: 600 }}>
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", backgroundColor: "#0B0C10", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
          <Loader2 className="animate-spin" style={{ color: "#D4AF37" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
