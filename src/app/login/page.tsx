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

        {/* PRIMARY ACTION BUTTON: CONTINUE WITH GOOGLE */}
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
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          )}
          Continue with Google
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
