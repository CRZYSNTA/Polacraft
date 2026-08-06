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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", color: "#111111" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "#5A31F4" }} />
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
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", color: "#111111", paddingTop: "120px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* POST-LOGIN LOW-FRICTION PROFILE COMPLETION BANNER */}
        {addressesCount === 0 && (
          <div
            style={{
              backgroundColor: "#F3F4F6",
              border: "1px solid #E5E7EB",
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
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#111111", marginBottom: "0.2rem" }}>
                ⚡ Quick Step: Add Your Delivery Address
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
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
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              {showCompletionForm ? "Hide Form" : "Add Address Now"}
            </button>

            {showCompletionForm && (
              <form onSubmit={handleSaveProfileDetails} style={{ width: "100%", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #E5E7EB", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <input required value={completePhone} onChange={(e) => setCompletePhone(e.target.value)} placeholder="WhatsApp Phone # (e.g. 9876543210)" style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", color: "#111", fontSize: "0.85rem" }} />
                <input required value={completeStreet} onChange={(e) => setCompleteStreet(e.target.value)} placeholder="Street / Door No." style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", color: "#111", fontSize: "0.85rem" }} />
                <input required value={completeCity} onChange={(e) => setCompleteCity(e.target.value)} placeholder="City / District" style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", color: "#111", fontSize: "0.85rem" }} />
                <input required value={completeZip} onChange={(e) => setCompleteZip(e.target.value)} placeholder="PIN / ZIP Code" style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB", color: "#111", fontSize: "0.85rem" }} />
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
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "2.5rem 2rem",
            border: "1px solid rgba(17, 17, 17, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2.5rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
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
                style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #111111" }}
              />
            ) : (
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: "#F3F4F6",
                  border: "2px solid #111111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#111111",
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : "C"}
              </div>
            )}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#111111", margin: 0 }}>
                  {user?.name || "Collector"}
                </h1>
                <span
                  style={{
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
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
              <p style={{ fontSize: "0.9rem", color: "#666666", margin: "0.35rem 0 0 0" }}>{user?.email}</p>
            </div>
          </div>

          {/* LOYALTY REWARDS COUNTER */}
          <div
            style={{
              backgroundColor: "#FAFAFA",
              border: "1px solid #E5E7EB",
              borderRadius: "18px",
              padding: "1rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Award size={32} style={{ color: "#D4AF37" }} />
            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666666", fontWeight: 700 }}>
                Collector Rewards Points
              </span>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111111" }}>
                {loyaltyPoints} Points
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY FEATURE CARDS GRID */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111111", marginBottom: "1.25rem", letterSpacing: "-0.01em" }}>
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
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                padding: "1.75rem",
                border: "1px solid rgba(17, 17, 17, 0.08)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Package size={22} style={{ color: "#111111" }} />
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111111", backgroundColor: "#F3F4F6", padding: "0.25rem 0.65rem", borderRadius: "12px" }}>
                  {ordersCount} Orders
                </span>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111111", margin: "0 0 0.35rem 0" }}>My Orders</h3>
              <p style={{ fontSize: "0.85rem", color: "#666666", margin: 0 }}>Track shipments, view invoices & purchase details.</p>
            </div>
          </Link>

          {/* WISHLIST */}
          <Link href="/account/wishlist" style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                padding: "1.75rem",
                border: "1px solid rgba(17, 17, 17, 0.08)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Heart size={22} style={{ color: "#EF4444" }} />
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#EF4444", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.25rem 0.65rem", borderRadius: "12px" }}>
                  {wishlistCount} Saved
                </span>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111111", margin: "0 0 0.35rem 0" }}>Wishlist</h3>
              <p style={{ fontSize: "0.85rem", color: "#666666", margin: 0 }}>View saved cinema posters & instant checkout.</p>
            </div>
          </Link>

          {/* SAVED ADDRESSES */}
          <Link href="/account/addresses" style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                padding: "1.75rem",
                border: "1px solid rgba(17, 17, 17, 0.08)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={22} style={{ color: "#10B981" }} />
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "0.25rem 0.65rem", borderRadius: "12px" }}>
                  {addressesCount} Saved
                </span>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111111", margin: "0 0 0.35rem 0" }}>Saved Addresses</h3>
              <p style={{ fontSize: "0.85rem", color: "#666666", margin: 0 }}>Manage delivery locations for 1-click checkout.</p>
            </div>
          </Link>

          {/* ACCOUNT SETTINGS */}
          <Link href="/account/settings" style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                padding: "1.75rem",
                border: "1px solid rgba(17, 17, 17, 0.08)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Settings size={22} style={{ color: "#6366F1" }} />
                </div>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111111", margin: "0 0 0.35rem 0" }}>Account Settings</h3>
              <p style={{ fontSize: "0.85rem", color: "#666666", margin: 0 }}>Profile details, security & notifications.</p>
            </div>
          </Link>
        </div>

        {/* FUTURE PLACEHOLDERS SECTION */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111111", marginBottom: "1.25rem", letterSpacing: "-0.01em" }}>
          Collector Suite (Upcoming)
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "1.5rem", border: "1px solid rgba(17, 17, 17, 0.08)", opacity: 0.7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <Clock size={20} style={{ color: "#111111" }} />
              <h4 style={{ margin: 0, color: "#111111", fontSize: "1rem" }}>Recently Viewed Posters</h4>
            </div>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#666666" }}>Quickly re-visit posters you inspected earlier.</p>
          </div>

          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "1.5rem", border: "1px solid rgba(17, 17, 17, 0.08)", opacity: 0.7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <Sparkles size={20} style={{ color: "#111111" }} />
              <h4 style={{ margin: 0, color: "#111111", fontSize: "1rem" }}>Curated Recommendations</h4>
            </div>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#666666" }}>AI recommendations based on director & genre preferences.</p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            padding: "0.85rem 1.75rem",
            borderRadius: "14px",
            border: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
            color: "#DC2626",
            fontWeight: 800,
            fontSize: "0.9rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
          }}
        >
          <LogOut size={18} /> Sign Out of Account
        </button>

      </div>
    </div>
  );
}
