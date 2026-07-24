"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Package, ArrowLeft, Clock, CheckCircle2, Truck, ExternalLink, Loader2 } from "lucide-react";

export default function AccountOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/auth/me?t=" + Date.now(), { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.user?.orders) {
            setOrders(data.user.orders);
          }
        }
      } catch (e) {
        console.warn("[Orders Fetch Error]:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0B0C10", color: "#F3F4F6", paddingTop: "120px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        <Link href="/account" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#D4AF37", textDecoration: "none", fontSize: "0.9rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#FFFFFF", marginBottom: "0.5rem" }}>
          My Order History
        </h1>
        <p style={{ color: "#9CA3AF", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Track shipments, view items & status of your archival cinema prints.
        </p>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
            <Loader2 size={32} className="animate-spin" style={{ color: "#D4AF37" }} />
          </div>
        ) : orders.length === 0 ? (
          <div style={{ backgroundColor: "#12141A", borderRadius: "24px", padding: "4rem 2rem", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Package size={48} style={{ color: "#6B7280", marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.25rem", color: "#FFFFFF", fontWeight: 800, margin: "0 0 0.5rem 0" }}>No Orders Placed Yet</h3>
            <p style={{ color: "#9CA3AF", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Explore our handcrafted Malayalam cinema gallery and place your first order!</p>
            <Link href="/shop" style={{ padding: "0.8rem 1.5rem", borderRadius: "12px", backgroundColor: "#D4AF37", color: "#111", fontWeight: 800, textDecoration: "none", display: "inline-block" }}>
              Browse Posters
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {orders.map((order) => (
              <div key={order.id} style={{ backgroundColor: "#12141A", borderRadius: "20px", padding: "1.75rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#D4AF37", fontWeight: 800, letterSpacing: "0.1em" }}>ORDER #{order.orderNumber}</span>
                    <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "0.2rem" }}>Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}</div>
                  </div>
                  <span style={{ padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 800, backgroundColor: order.shippingStatus === "DELIVERED" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: order.shippingStatus === "DELIVERED" ? "#10B981" : "#F59E0B", border: order.shippingStatus === "DELIVERED" ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(245,158,11,0.3)" }}>
                    {order.shippingStatus.replace(/_/g, " ")}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.9rem", color: "#9CA3AF" }}>Total Amount: <strong style={{ color: "#FFF" }}>₹{order.total}</strong></span>
                  <span style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>Payment: <strong style={{ color: "#D4AF37" }}>{order.paymentStatus}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
