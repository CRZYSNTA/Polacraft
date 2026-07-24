"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { ShieldCheck, Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/profile";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleGoogleSignIn = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1029384756102-polacraft.apps.googleusercontent.com";
      const redirectUri = `${window.location.origin}/api/auth/google/callback`;
      
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent("openid email profile")}&prompt=select_account`;

      // Redirect immediately to Google's official account selector page
      window.location.href = googleAuthUrl;
    } catch (e) {
      console.error("[Google Redirect Error]:", e);
      setErrorMsg("Failed to open Google Sign-In.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload = mode === "login" ? { email, password } : { email, password, name, phone };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(mode === "login" ? "Login successful! Redirecting..." : "Account created! Redirecting...");
        setTimeout(() => {
          router.push(redirectTarget);
          router.refresh();
        }, 800);
      } else {
        setErrorMsg(data.error || "Authentication failed. Please check details.");
      }
    } catch (err) {
      console.error("[Auth Form Error]:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <div style={{ width: "100%", maxWidth: "460px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* POLACRAFT BRANDING */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#64748B", fontWeight: 700 }}>
            Polacraft Cinema Club
          </span>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "900", margin: "0.35rem 0 0 0", letterSpacing: "-0.03em" }}>
            {mode === "login" ? "Welcome Back" : "Create Collector Account"}
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#64748B", marginTop: "0.5rem" }}>
            {mode === "login" ? "Access your saved addresses, order history, and reward points." : "Join the archival fine art cinema poster community."}
          </p>
        </div>

        {/* CARD CONTAINER */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "2.25rem", border: "1px solid #EFECE6", boxShadow: "0 15px 35px rgba(0,0,0,0.04)" }}>
          
          {/* TAB SWITCHER */}
          <div style={{ display: "flex", backgroundColor: "#F1F5F9", borderRadius: "14px", padding: "4px", marginBottom: "1.75rem" }}>
            <button
              type="button"
              onClick={() => { setMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
              style={{
                flex: 1,
                padding: "0.65rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: mode === "login" ? "#FFFFFF" : "transparent",
                color: mode === "login" ? "#111111" : "#64748B",
                fontWeight: mode === "login" ? 800 : 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: mode === "login" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setErrorMsg(""); setSuccessMsg(""); }}
              style={{
                flex: 1,
                padding: "0.65rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: mode === "register" ? "#FFFFFF" : "transparent",
                color: mode === "register" ? "#111111" : "#64748B",
                fontWeight: mode === "register" ? 800 : 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: mode === "register" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              Sign Up
            </button>
          </div>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "12px",
              border: "1.5px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
              color: "#1E293B",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.65rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              transition: "all 0.2s ease",
              marginBottom: "1.25rem"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          {/* DIVIDER */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "1.25rem", color: "#94A3B8" }}>
            <div style={{ flex: 1, borderBottom: "1px solid #E2E8F0" }}></div>
            <span style={{ padding: "0 0.75rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>OR EMAIL</span>
            <div style={{ flex: 1, borderBottom: "1px solid #E2E8F0" }}></div>
          </div>

          {/* ERROR & SUCCESS MESSAGES */}
          {errorMsg && (
            <div style={{ padding: "0.75rem 1rem", borderRadius: "12px", backgroundColor: "#FEE2E2", color: "#DC2626", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem" }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: "0.75rem 1rem", borderRadius: "12px", backgroundColor: "#ECFDF5", color: "#047857", fontSize: "0.85rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            
            {/* FULL NAME (REGISTRATION ONLY) */}
            {mode === "register" && (
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                  Full Name *
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.4rem", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.9rem" }}
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Email Address *
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.4rem", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.9rem" }}
                />
              </div>
            </div>

            {/* PHONE (REGISTRATION ONLY) */}
            {mode === "register" && (
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                  WhatsApp Phone #
                </label>
                <div style={{ position: "relative" }}>
                  <Phone size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit phone number"
                    style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.4rem", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.9rem" }}
                  />
                </div>
              </div>
            )}

            {/* PASSWORD */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Password *
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "At least 6 characters" : "Enter your password"}
                  style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.4rem", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.9rem" }}
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                marginTop: "0.75rem",
                padding: "0.85rem",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              {isLoading ? (mode === "login" ? "Authenticating..." : "Creating Account...") : (mode === "login" ? "Log In" : "Create Account")}
            </button>
          </form>
        </div>

        {/* STOREFRONT RETURN FOOTER */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link href="/shop" style={{ fontSize: "0.85rem", color: "#64748B", textDecoration: "none", fontWeight: 600 }}>
            ← Return to Storefront
          </Link>
        </div>

      </div>
    </div>
  );
}
