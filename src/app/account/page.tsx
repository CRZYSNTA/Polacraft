"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Award,
  Clock,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function AccountDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [addressesCount, setAddressesCount] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(50);
  const [loadingData, setLoadingData] = useState(true);

  // Profile completion state declared unconditionally at top level
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [completePhone, setCompletePhone] = useState("");
  const [completeStreet, setCompleteStreet] = useState("");
  const [completeCity, setCompleteCity] = useState("");
  const [completeZip, setCompleteZip] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function fetchAccountOverview() {
      try {
        const res = await fetch("/api/auth/me?t=" + Date.now(), { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setOrdersCount(data.user.orders?.length || 0);
            setWishlistCount(data.user.wishlists?.length || 0);
            setAddressesCount(data.user.addresses?.length || 0);
            setLoyaltyPoints(data.user.loyaltyPoints || 50);
          }
        }
      } catch (e) {
        console.warn("[Account Overview Load Error]:", e);
      } finally {
        setLoadingData(false);
      }
    }
    if (session?.user) {
      fetchAccountOverview();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0B0C10", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "#D4AF37" }} />
      </div>
    );
  }

  const user = session?.user;

  const handleSaveProfileDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (completeStreet && completeCity && completeZip) {
        await fetch("/api/auth/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: session?.user?.name || "Collector",
            street: completeStreet,
            city: completeCity,
            state: "Kerala",
            zip: completeZip,
          }),
        });
      }
      setShowCompletionForm(false);
      const res = await fetch("/api/auth/me?t=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setAddressesCount(data.user.addresses?.length || 0);
        }
      }
    } catch (e) {
      console.error("[Save Profile Details Error]:", e);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0B0C10", color: "#F3F4F6", paddingTop: "120px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* POST-LOGIN LOW-FRICTION PROFILE COMPLETION BANNER */}
        {addressesCount === 0 && (
          <div
            style={{
              backgroundColor: "rgba(212, 175, 55, 0.08)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "20px",
              padding: "1.5rem 1.75rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#D4AF37", marginBottom: "0.2rem" }}>
                ⚡ Quick Step: Add Your Delivery Address
              </div>
              <div style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>
                Complete your profile once to enable 1-click Express WhatsApp checkout & automatic address filling.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCompletionForm(!showCompletionForm)}
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#D4AF37",
                color: "#111111",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              {showCompletionForm ? "Hide Form" : "Add Address Now"}
            </button>

            {showCompletionForm && (
              <form onSubmit={handleSaveProfileDetails} style={{ width: "100%", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(212,175,55,0.2)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <input required value={completePhone} onChange={(e) => setCompletePhone(e.target.value)} placeholder="WhatsApp Phone # (e.g. 9876543210)" style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#1A1D24", border: "1px solid #333", color: "#FFF", fontSize: "0.85rem" }} />
                <input required value={completeStreet} onChange={(e) => setCompleteStreet(e.target.value)} placeholder="Street / Door No." style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#1A1D24", border: "1px solid #333", color: "#FFF", fontSize: "0.85rem" }} />
                <input required value={completeCity} onChange={(e) => setCompleteCity(e.target.value)} placeholder="City / District" style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#1A1D24", border: "1px solid #333", color: "#FFF", fontSize: "0.85rem" }} />
                <input required value={completeZip} onChange={(e) => setCompleteZip(e.target.value)} placeholder="PIN / ZIP Code" style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#1A1D24", border: "1px solid #333", color: "#FFF", fontSize: "0.85rem" }} />
                <button type="submit" disabled={savingProfile} style={{ gridColumn: "span 2", padding: "0.75rem", borderRadius: "10px", backgroundColor: "#10B981", color: "#FFF", fontWeight: 800, border: "none", cursor: "pointer" }}>
                  {savingProfile ? "Saving Profile..." : "Save WhatsApp # & Delivery Address"}
                </button>
              </form>
            )}
          </div>
        )}
        
        {/* HEADER DASHBOARD BANNER */}
        <div
          style={{
            backgroundColor: "rgba(18, 20, 26, 0.85)",
            backdropFilter: "blur(16px)",
            borderRadius: "24px",
            padding: "2.5rem 2rem",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2.5rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "Customer"}
                width={72}
                height={72}
                unoptimized={user.image.startsWith("http")}
                style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #D4AF37" }}
              />
            ) : (
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(212, 175, 55, 0.15)",
                  border: "2px solid #D4AF37",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#D4AF37",
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : "C"}
              </div>
            )}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#FFFFFF", margin: 0 }}>
                  {user?.name || "Collector"}
                </h1>
                <span
                  style={{
                    backgroundColor: "rgba(212, 175, 55, 0.15)",
                    color: "#D4AF37",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {(session?.user as any)?.role || "CUSTOMER"}
                </span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "#9CA3AF", margin: "0.35rem 0 0 0" }}>{user?.email}</p>
            </div>
          </div>

          {/* LOYALTY REWARDS COUNTER */}
          <div
            style={{
              backgroundColor: "rgba(212, 175, 55, 0.08)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "18px",
              padding: "1rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Award size={32} style={{ color: "#D4AF37" }} />
            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3AF", fontWeight: 700 }}>
                Collector Rewards Points
              </span>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#D4AF37" }}>
                {loyaltyPoints} Points
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY FEATURE CARDS GRID */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "1.25rem", letterSpacing: "-0.01em" }}>
          Account Navigation
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* MY ORDERS */}
          <Link href="/account/orders" style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "#12141A",
                borderRadius: "20px",
                padding: "1.75rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(212, 175, 55, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Package size={22} style={{ color: "#D4AF37" }} />
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#D4AF37", backgroundColor: "rgba(212, 175, 55, 0.1)", padding: "0.25rem 0.65rem", borderRadius: "12px" }}>
                  {ordersCount} Orders
                </span>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.35rem 0" }}>My Orders</h3>
              <p style={{ fontSize: "0.85rem", color: "#9CA3AF", margin: 0 }}>Track shipments, view invoices & purchase details.</p>
            </div>
          </Link>

          {/* WISHLIST */}
          <Link href="/account/wishlist" style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "#12141A",
                borderRadius: "20px",
                padding: "1.75rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(239, 68, 68, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Heart size={22} style={{ color: "#EF4444" }} />
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#EF4444", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.25rem 0.65rem", borderRadius: "12px" }}>
                  {wishlistCount} Saved
                </span>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.35rem 0" }}>Wishlist</h3>
              <p style={{ fontSize: "0.85rem", color: "#9CA3AF", margin: 0 }}>View saved cinema posters & instant checkout.</p>
            </div>
          </Link>

          {/* SAVED ADDRESSES */}
          <Link href="/account/addresses" style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "#12141A",
                borderRadius: "20px",
                padding: "1.75rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={22} style={{ color: "#10B981" }} />
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "0.25rem 0.65rem", borderRadius: "12px" }}>
                  {addressesCount} Saved
                </span>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.35rem 0" }}>Saved Addresses</h3>
              <p style={{ fontSize: "0.85rem", color: "#9CA3AF", margin: 0 }}>Manage delivery locations for 1-click checkout.</p>
            </div>
          </Link>

          {/* ACCOUNT SETTINGS */}
          <Link href="/account/settings" style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "#12141A",
                borderRadius: "20px",
                padding: "1.75rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(99, 102, 241, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Settings size={22} style={{ color: "#6366F1" }} />
                </div>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.35rem 0" }}>Account Settings</h3>
              <p style={{ fontSize: "0.85rem", color: "#9CA3AF", margin: 0 }}>Profile details, security & notifications.</p>
            </div>
          </Link>
        </div>

        {/* FUTURE PLACEHOLDERS SECTION */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "1.25rem", letterSpacing: "-0.01em" }}>
          Collector Suite (Upcoming)
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div style={{ backgroundColor: "#12141A", borderRadius: "20px", padding: "1.5rem", border: "1px solid rgba(255, 255, 255, 0.05)", opacity: 0.6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <Clock size={20} style={{ color: "#D4AF37" }} />
              <h4 style={{ margin: 0, color: "#FFF", fontSize: "1rem" }}>Recently Viewed Posters</h4>
            </div>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>Quickly re-visit posters you inspected earlier.</p>
          </div>

          <div style={{ backgroundColor: "#12141A", borderRadius: "20px", padding: "1.5rem", border: "1px solid rgba(255, 255, 255, 0.05)", opacity: 0.6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <Sparkles size={20} style={{ color: "#D4AF37" }} />
              <h4 style={{ margin: 0, color: "#FFF", fontSize: "1rem" }}>Curated Recommendations</h4>
            </div>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>AI recommendations based on director & genre preferences.</p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            padding: "0.85rem 1.75rem",
            borderRadius: "14px",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            color: "#FCA5A5",
            fontWeight: 800,
            fontSize: "0.9rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <LogOut size={18} /> Sign Out of Account
        </button>

      </div>
    </div>
  );
}
