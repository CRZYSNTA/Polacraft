"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
