"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl = rawCallback && !rawCallback.startsWith("/admin") ? rawCallback : "/account";

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [emailOffers, setEmailOffers] = useState(true);

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (!showPasswordInput) {
      setShowPasswordInput(true);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.authenticated || data.user)) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setErrorMsg(data.error || "Authentication failed. Please check credentials.");
      }
    } catch (err) {
      console.error("[Auth Error]:", err);
      setErrorMsg("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        color: "#111111",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "3rem 1.5rem 2rem 1.5rem",
        fontFamily: "var(--font-sans), sans-serif",
      }}
    >
      {/* 1. TOP CENTERED BRAND LOGO */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#111111", fontWeight: "900", fontSize: "1.5rem", letterSpacing: "0.15em" }}>
          POLACRAFT
        </Link>
      </div>

      {/* 2. CENTERED FORM CONTAINER */}
      <div style={{ width: "100%", maxWidth: "400px", margin: "auto 0" }}>
        {/* HEADING */}
        <h1 style={{ fontSize: "1.85rem", fontWeight: "800", color: "#111111", margin: "0 0 0.35rem 0", letterSpacing: "-0.02em" }}>
          Sign in
        </h1>
        <p style={{ fontSize: "0.92rem", color: "#666666", margin: "0 0 1.75rem 0" }}>
          Sign in or create an account
        </p>

        {errorMsg && (
          <div
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "10px",
              backgroundColor: "#FEE2E2",
              border: "1px solid #FCA5A5",
              color: "#991B1B",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "1.25rem",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* PRIMARY ACTION BUTTON: CONTINUE WITH SHOP / GOOGLE */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.88rem 1.25rem",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#5A31F4",
            color: "#FFFFFF",
            fontWeight: "700",
            fontSize: "0.98rem",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            boxShadow: "0 4px 14px rgba(90, 49, 244, 0.25)",
            transition: "background-color 0.2s ease",
          }}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" fill="#FFFFFF"/>
            </svg>
          )}
          Continue with shop
        </button>

        {/* DIVIDER */}
        <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", color: "#9CA3AF" }}>
          <div style={{ flex: 1, borderBottom: "1px solid #E5E7EB" }}></div>
          <span style={{ padding: "0 0.85rem", fontSize: "0.8rem", color: "#9CA3AF" }}>
            or
          </span>
          <div style={{ flex: 1, borderBottom: "1px solid #E5E7EB" }}></div>
        </div>

        {/* EMAIL INPUT WITH ACTION ARROW */}
        <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                width: "100%",
                padding: "0.85rem 3rem 0.85rem 1rem",
                borderRadius: "12px",
                border: "1px solid #D1D5DB",
                fontSize: "0.95rem",
                outline: "none",
                color: "#111111",
                backgroundColor: "#FFFFFF",
                transition: "border-color 0.2s ease",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "#111111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {showPasswordInput && (
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid #D1D5DB",
                  fontSize: "0.95rem",
                  outline: "none",
                  color: "#111111",
                  backgroundColor: "#FFFFFF",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "0.5rem",
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#111111",
                  color: "#FFFFFF",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {loading ? "Signing in..." : "Continue"}
              </button>
            </div>
          )}

          {/* CHECKBOX */}
          <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.88rem", color: "#374151", cursor: "pointer", marginTop: "0.25rem" }}>
            <input
              type="checkbox"
              checked={emailOffers}
              onChange={(e) => setEmailOffers(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                accentColor: "#2563EB",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            />
            <span>Email me with news and offers</span>
          </label>
        </form>

        {/* TERMS DISCLAIMER */}
        <p style={{ fontSize: "0.78rem", color: "#6B7280", textAlign: "center", marginTop: "1.5rem", lineHeight: "1.5" }}>
          By continuing, you agree to our{" "}
          <Link href="/terms" style={{ color: "#2563EB", textDecoration: "underline" }}>
            Terms of service
          </Link>
        </p>
      </div>

      {/* 3. BOTTOM PRIVACY POLICY LINK */}
      <div style={{ marginTop: "3rem" }}>
        <Link href="/privacy" style={{ color: "#2563EB", fontSize: "0.85rem", textDecoration: "none" }}>
          Privacy policy
        </Link>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#111" }}>
          <Loader2 className="animate-spin" style={{ color: "#5A31F4" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
