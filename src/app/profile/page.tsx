"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/features/cart/AppContext";
import { User, Package, Heart, MapPin, Truck, ExternalLink, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CustomerProfilePage() {
  const { wishlist } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ORDERS" | "ADDRESSES" | "WISHLIST">("ORDERS");

  useEffect(() => {
    async function fetchCustomerOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error("Failed to fetch customer orders:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomerOrders();
  }, []);

  return (
    <div style={{ maxWidth: "1000px", margin: "2.5rem auto", padding: "0 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "2rem" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#1E1E1E", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800 }}>
          P
        </div>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "900", margin: 0, letterSpacing: "-0.03em" }}>
            Customer Account & Dashboard
          </h1>
          <p style={{ margin: "4px 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>
            Track order status, manage delivery addresses, and view saved wishlist posters.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid #E2E8F0", marginBottom: "2rem" }}>
        <button
          onClick={() => setActiveTab("ORDERS")}
          style={{
            padding: "0.75rem 1.25rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "ORDERS" ? "2px solid #1E1E1E" : "none",
            fontWeight: activeTab === "ORDERS" ? 800 : 500,
            color: activeTab === "ORDERS" ? "#1E1E1E" : "#64748B",
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Package size={18} /> Order History ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("ADDRESSES")}
          style={{
            padding: "0.75rem 1.25rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "ADDRESSES" ? "2px solid #1E1E1E" : "none",
            fontWeight: activeTab === "ADDRESSES" ? 800 : 500,
            color: activeTab === "ADDRESSES" ? "#1E1E1E" : "#64748B",
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <MapPin size={18} /> Saved Addresses
        </button>

        <button
          onClick={() => setActiveTab("WISHLIST")}
          style={{
            padding: "0.75rem 1.25rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "WISHLIST" ? "2px solid #1E1E1E" : "none",
            fontWeight: activeTab === "WISHLIST" ? 800 : 500,
            color: activeTab === "WISHLIST" ? "#1E1E1E" : "#64748B",
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Heart size={18} /> Wishlist ({wishlist.length})
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === "ORDERS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <Loader2 size={24} className="animate-spin" /> Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#888", backgroundColor: "#FFF", borderRadius: "16px", border: "1px solid #EFECE6" }}>
              <ShoppingBag size={40} style={{ opacity: 0.3, marginBottom: "1rem" }} />
              <p style={{ margin: 0, fontWeight: 700 }}>No orders placed yet</p>
              <Link href="/shop" style={{ display: "inline-block", marginTop: "1rem", padding: "0.6rem 1.25rem", borderRadius: "10px", backgroundColor: "#10B981", color: "#FFF", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
                Explore Art Posters
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "1.5rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid #F1F5F9", marginBottom: "1rem" }}>
                  <div>
                    <strong style={{ fontSize: "1rem", color: "#0F172A" }}>Order #{order.orderNumber}</strong>
                    <span style={{ fontSize: "0.8rem", color: "#64748B", display: "block" }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.75rem", borderRadius: "20px", backgroundColor: order.shippingStatus === "DELIVERED" ? "#ECFDF5" : "#FEF3C7", color: order.shippingStatus === "DELIVERED" ? "#047857" : "#B45309" }}>
                    {order.shippingStatus}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span>• <strong>{item.product?.title || "Art Poster"}</strong> ({item.size}, {item.frame}) x{item.quantity}</span>
                      <strong>₹{item.price * item.quantity}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid #F1F5F9", fontSize: "0.85rem" }}>
                  <span style={{ color: "#64748B" }}>Tracking #: <strong>{order.trackingNumber || "Assigned upon dispatch"}</strong></span>
                  <strong style={{ fontSize: "1rem", color: "#0F172A" }}>Total: ₹{order.total}</strong>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Addresses */}
      {activeTab === "ADDRESSES" && (
        <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "2rem", border: "1px solid #EFECE6" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 800 }}>Default Shipping Address</h3>
          <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.6 }}>
            Rahul Menon
            <br />
            Flat 4B, Lotus Apartments, MG Road
            <br />
            Kochi, Kerala - 682001
            <br />
            India
          </p>
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === "WISHLIST" && (
        <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "2rem", border: "1px solid #EFECE6", textAlign: "center" }}>
          <Heart size={40} style={{ opacity: 0.3, marginBottom: "1rem" }} />
          <p style={{ margin: 0, fontWeight: 700 }}>Your Wishlist ({wishlist.length} items)</p>
          <p style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "4px" }}>Items you save while browsing will appear here.</p>
        </div>
      )}
    </div>
  );
}
