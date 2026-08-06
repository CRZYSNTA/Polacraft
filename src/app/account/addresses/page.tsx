"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowLeft, Plus, Loader2 } from "lucide-react";

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/auth/me?t=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.user?.addresses) {
          setAddresses(data.user.addresses);
        }
      }
    } catch (e) {
      console.warn("[Addresses Fetch Error]:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/auth/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, street, city, state, zip }),
      });
      if (res.ok) {
        setIsAdding(false);
        setName(""); setStreet(""); setCity(""); setState(""); setZip("");
        fetchAddresses();
      }
    } catch (e) {
      console.error("[Save Address Error]:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", color: "#111111", paddingTop: "120px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        <Link href="/account" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#111111", textDecoration: "none", fontSize: "0.9rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#111111", margin: "0 0 0.35rem 0" }}>Saved Delivery Addresses</h1>
            <p style={{ color: "#666666", fontSize: "0.9rem", margin: 0 }}>Manage default shipping addresses for fast 1-click checkout.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            style={{ padding: "0.75rem 1.25rem", borderRadius: "100px", backgroundColor: "#111111", color: "#FFFFFF", fontWeight: 800, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Plus size={18} /> Add Address
          </button>
        </div>

        {/* ADD ADDRESS FORM MODAL */}
        {isAdding && (
          <form onSubmit={handleSaveAddress} style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "1.75rem", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", color: "#111111", fontWeight: 800, marginTop: 0 }}>Add New Shipping Address</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#FAFAFA", border: "1px solid #D1D5DB", color: "#111" }} />
              <input required value={street} onChange={(e) => setStreet(e.target.value)} placeholder="House / Street Address" style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#FAFAFA", border: "1px solid #D1D5DB", color: "#111" }} />
              <input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#FAFAFA", border: "1px solid #D1D5DB", color: "#111" }} />
              <input required value={state} onChange={(e) => setState(e.target.value)} placeholder="State" style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#FAFAFA", border: "1px solid #D1D5DB", color: "#111" }} />
              <input required value={zip} onChange={(e) => setZip(e.target.value)} placeholder="PIN / ZIP Code" style={{ padding: "0.75rem", borderRadius: "10px", backgroundColor: "#FAFAFA", border: "1px solid #D1D5DB", color: "#111" }} />
            </div>
            <button type="submit" disabled={saving} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", backgroundColor: "#10B981", color: "#FFF", fontWeight: 800, border: "none", cursor: "pointer" }}>
              {saving ? "Saving..." : "Save Address"}
            </button>
          </form>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
            <Loader2 size={32} className="animate-spin" style={{ color: "#5A31F4" }} />
          </div>
        ) : addresses.length === 0 ? (
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "4rem 2rem", textAlign: "center", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <MapPin size={48} style={{ color: "#10B981", marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.25rem", color: "#111111", fontWeight: 800, margin: "0 0 0.5rem 0" }}>No Saved Addresses</h3>
            <p style={{ color: "#666666", fontSize: "0.9rem" }}>Add a default shipping address for faster express checkout!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {addresses.map((addr) => (
              <div key={addr.id} style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "1.5rem", border: addr.isDefault ? "2px solid #111111" : "1px solid rgba(17,17,17,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontWeight: 800, color: "#111111" }}>{addr.name}</span>
                  {addr.isDefault && <span style={{ fontSize: "0.7rem", backgroundColor: "#111111", color: "#FFFFFF", padding: "0.2rem 0.5rem", borderRadius: "10px", fontWeight: 800 }}>DEFAULT</span>}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#666666", margin: "0 0 0.5rem 0", lineHeight: 1.5 }}>
                  {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
