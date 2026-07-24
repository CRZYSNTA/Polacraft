"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, Award, LogOut, Plus, CheckCircle2, Clock, Truck, ShieldCheck, Loader2 } from "lucide-react";

export default function CustomerProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "loyalty">("orders");

  // Address modal form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrName, setAddrName] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrZip, setAddrZip] = useState("");
  const [savingAddr, setSavingAddr] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/auth/me?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("[Profile Fetch Error]:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("[Logout Error]:", e);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingAddr(true);
      const res = await fetch("/api/auth/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addrName,
          street: addrStreet,
          city: addrCity,
          state: addrState,
          zip: addrZip,
          isDefault: true,
        }),
      });

      if (res.ok) {
        setIsAddingAddress(false);
        setAddrName("");
        setAddrStreet("");
        setAddrCity("");
        setAddrState("");
        setAddrZip("");
        fetchProfile();
      } else {
        alert("Failed to save address.");
      }
    } catch (e) {
      console.error("[Address Save Error]:", e);
    } finally {
      setSavingAddr(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "#64748B" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: "560px", margin: "10rem auto 6rem", padding: "2.5rem 1.5rem", textAlign: "center", backgroundColor: "#FFF", borderRadius: "24px", border: "1px solid #EFECE6", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#F1F5F9", color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto" }}>
          <User size={32} />
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: "900", margin: "0 0 0.5rem 0" }}>Collector Dashboard</h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem", marginBottom: "2rem" }}>
          Please log in or create a customer account to view your order history and saved delivery addresses.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/login" style={{ padding: "0.8rem 2rem", borderRadius: "12px", backgroundColor: "#111111", color: "#FFF", textDecoration: "none", fontWeight: 800, fontSize: "0.9rem" }}>
            Log In / Register
          </Link>
          <Link href="/shop" style={{ padding: "0.8rem 1.5rem", borderRadius: "12px", backgroundColor: "#F1F5F9", color: "#1E293B", textDecoration: "none", fontWeight: 700, fontSize: "0.9rem" }}>
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        
        {/* CUSTOMER HEADER CARD */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "2rem", border: "1px solid #EFECE6", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#111111", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "800" }}>
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: "1.65rem", fontWeight: "900", margin: 0 }}>{user.name || "Collector"}</h1>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "2px 0 0 0" }}>{user.email} • {user.phone || "No phone linked"}</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Loyalty Badge */}
            <div style={{ backgroundColor: "#FEF3C7", color: "#92400E", padding: "0.6rem 1.25rem", borderRadius: "100px", fontWeight: 800, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Award size={16} /> {user.loyaltyPoints || 0} Reward Points
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", borderRadius: "12px", border: "1px solid #CBD5E1", backgroundColor: "#FFF", color: "#475569", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>

        {/* DASHBOARD TABS */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "2px solid #E2E8F0", marginBottom: "2rem" }}>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.5rem",
              border: "none",
              borderBottom: activeTab === "orders" ? "3px solid #111111" : "3px solid transparent",
              backgroundColor: "transparent",
              color: activeTab === "orders" ? "#111111" : "#64748B",
              fontWeight: activeTab === "orders" ? 800 : 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              marginBottom: "-2px"
            }}
          >
            <Package size={18} /> Order History ({user.orders?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.5rem",
              border: "none",
              borderBottom: activeTab === "addresses" ? "3px solid #111111" : "3px solid transparent",
              backgroundColor: "transparent",
              color: activeTab === "addresses" ? "#111111" : "#64748B",
              fontWeight: activeTab === "addresses" ? 800 : 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              marginBottom: "-2px"
            }}
          >
            <MapPin size={18} /> Saved Delivery Addresses ({user.addresses?.length || 0})
          </button>
        </div>

        {/* TAB 1: ORDER HISTORY */}
        {activeTab === "orders" && (
          <div>
            {!user.orders || user.orders.length === 0 ? (
              <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "4rem 2rem", textAlign: "center", border: "1px solid #EFECE6" }}>
                <Package size={48} style={{ color: "#94A3B8", marginBottom: "1rem" }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>No orders placed yet</h3>
                <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "1.5rem" }}>When you order posters, your real-time tracking will appear here.</p>
                <Link href="/shop" style={{ padding: "0.75rem 1.75rem", borderRadius: "12px", backgroundColor: "#111111", color: "#FFF", textDecoration: "none", fontWeight: 800, fontSize: "0.85rem" }}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {user.orders.map((order: any) => (
                  <div key={order.id} style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "1.75rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9", paddingBottom: "1rem", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div>
                        <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 700 }}>ORDER #{order.orderNumber}</span>
                        <div style={{ fontSize: "0.85rem", color: "#94A3B8" }}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.3rem 0.75rem", borderRadius: "100px", backgroundColor: order.shippingStatus === "DELIVERED" ? "#ECFDF5" : "#EFF6FF", color: order.shippingStatus === "DELIVERED" ? "#047857" : "#1D4ED8" }}>
                          {order.shippingStatus.replace(/_/g, " ")}
                        </span>
                        <span style={{ fontSize: "1.1rem", fontWeight: 900 }}>₹{order.total}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {order.items?.map((item: any) => (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                          <div>
                            <strong>{item.product?.title || "Archival Poster"}</strong>
                            <div style={{ fontSize: "0.8rem", color: "#64748B" }}>Size: {item.size} • Frame: {item.frame} x{item.quantity}</div>
                          </div>
                          <strong>₹{item.price * item.quantity}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px dashed #E2E8F0", fontSize: "0.8rem", color: "#64748B" }}>
                      Shipping to: <strong>{order.shippingName}</strong>, {order.shippingStreet}, {order.shippingCity}, {order.shippingState} - {order.shippingZip}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === "addresses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>Saved Delivery Addresses</h3>
              <button
                onClick={() => setIsAddingAddress(true)}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", borderRadius: "12px", backgroundColor: "#111111", color: "#FFF", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer", border: "none" }}
              >
                <Plus size={16} /> Add New Address
              </button>
            </div>

            {/* ADD ADDRESS MODAL / FORM */}
            {isAddingAddress && (
              <form onSubmit={handleSaveAddress} style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "1.75rem", border: "2px solid #111111", marginBottom: "2rem" }}>
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 800 }}>New Shipping Address</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <input type="text" required value={addrName} onChange={(e) => setAddrName(e.target.value)} placeholder="Full Name" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1" }} />
                  <input type="text" required value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} placeholder="Street / House No." style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <input type="text" required value={addrCity} onChange={(e) => setAddrCity(e.target.value)} placeholder="City" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1" }} />
                  <input type="text" required value={addrState} onChange={(e) => setAddrState(e.target.value)} placeholder="State" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1" }} />
                  <input type="text" required value={addrZip} onChange={(e) => setAddrZip(e.target.value)} placeholder="Pincode" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1" }} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="submit" disabled={savingAddr} style={{ padding: "0.75rem 1.5rem", borderRadius: "10px", backgroundColor: "#111111", color: "#FFF", fontWeight: 800, border: "none", cursor: "pointer" }}>
                    {savingAddr ? "Saving..." : "Save Address"}
                  </button>
                  <button type="button" onClick={() => setIsAddingAddress(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "10px", backgroundColor: "#F1F5F9", color: "#475569", fontWeight: 700, border: "none", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!user.addresses || user.addresses.length === 0 ? (
              <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "3rem 2rem", textAlign: "center", border: "1px solid #EFECE6" }}>
                <MapPin size={40} style={{ color: "#94A3B8", marginBottom: "1rem" }} />
                <p style={{ color: "#64748B", fontSize: "0.9rem" }}>No saved addresses yet. Save an address for 1-click express checkout.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                {user.addresses.map((addr: any) => (
                  <div key={addr.id} style={{ backgroundColor: "#FFF", borderRadius: "18px", padding: "1.5rem", border: addr.isDefault ? "2px solid #111111" : "1px solid #EFECE6", position: "relative" }}>
                    {addr.isDefault && (
                      <span style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.65rem", fontWeight: 800, backgroundColor: "#111111", color: "#FFF", padding: "0.2rem 0.6rem", borderRadius: "100px" }}>
                        DEFAULT
                      </span>
                    )}
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 800 }}>{addr.name}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0, lineHeight: "1.5" }}>
                      {addr.street}<br />
                      {addr.city}, {addr.state} - {addr.zip}<br />
                      {addr.country}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
