"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, DollarSign, ShoppingBag, AlertTriangle, Sparkles, Loader2, Clock, CheckCircle2, XCircle, Ban } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch analytics:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        <Loader2 size={24} className="animate-spin" /> Calculating store metrics & financial data...
      </div>
    );
  }

  const metrics = data?.metrics || {
    ordersCreated: 0,
    ordersPendingPayment: 0,
    ordersPaid: 0,
    cancelledOrders: 0,
    expiredOrders: 0,
    revenueToday: 0,
    revenueThisMonth: 0,
    revenueCollected: 0,
    pendingPaymentValue: 0,
    averageOrderValue: 0,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-0.03em" }}>
          Store Performance & Payment Analytics
        </h1>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Real-time metrics on paid revenue collected, pending WhatsApp orders, expired unpaid orders, AOV, top posters, and stock alerts.
        </p>
      </div>

      {/* Top Metric Cards Grid (8 Cards) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
        {/* 1. Orders Created */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <ShoppingBag size={16} style={{ color: "#6366F1" }} /> Orders Created
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#1E1E1E" }}>
            {metrics.ordersCreated}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
            Total checkouts initiated
          </div>
        </div>

        {/* 2. Orders Pending Payment */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Clock size={16} style={{ color: "#2563EB" }} /> Pending Payment
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#2563EB" }}>
            {metrics.ordersPendingPayment}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
            WhatsApp pending verification
          </div>
        </div>

        {/* 3. Orders Paid */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <CheckCircle2 size={16} style={{ color: "#10B981" }} /> Orders Paid
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#10B981" }}>
            {metrics.ordersPaid}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#047857", marginTop: "2px", fontWeight: 700 }}>
            Payment verified & stock deducted
          </div>
        </div>

        {/* 4. Revenue Collected */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <DollarSign size={16} style={{ color: "#10B981" }} /> Revenue Collected
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#10B981" }}>
            ₹{metrics.revenueCollected.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
            From paid orders only
          </div>
        </div>

        {/* 5. Pending Payment Value */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Clock size={16} style={{ color: "#D97706" }} /> Pending Value
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#D97706" }}>
            ₹{metrics.pendingPaymentValue.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
            Unconfirmed orders total
          </div>
        </div>

        {/* 6. Cancelled Orders */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Ban size={16} style={{ color: "#DC2626" }} /> Cancelled Orders
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#DC2626" }}>
            {metrics.cancelledOrders}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
            Rejected or cancelled
          </div>
        </div>

        {/* 7. Expired Orders */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <XCircle size={16} style={{ color: "#94A3B8" }} /> Expired Orders
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#64748B" }}>
            {metrics.expiredOrders}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
            Unpaid after 24 hours
          </div>
        </div>

        {/* 8. Average Order Value */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <TrendingUp size={16} style={{ color: "#8B5CF6" }} /> Average Order Value
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#1E1E1E" }}>
            ₹{metrics.averageOrderValue.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#8B5CF6", marginTop: "2px", fontWeight: 700 }}>
            Paid transactions average
          </div>
        </div>
      </div>

      {/* Two Column Layout: Top Sellers & Low Stock Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        {/* Top Selling Products */}
        <div style={{ backgroundColor: "#FFF", padding: "1.75rem", borderRadius: "20px", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={18} style={{ color: "#10B981" }} /> Top Best-Selling Posters
          </h3>

          {!data?.topSellingProducts || data.topSellingProducts.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "#888" }}>No sales data recorded yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {data.topSellingProducts.map((item: any, idx: number) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem", backgroundColor: "#F9FAFB", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                  <div>
                    <strong>{item.product.title}</strong>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>{item.product.collectionName}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "#10B981" }}>₹{item.revenue}</div>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>{item.unitsSold} units sold</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div style={{ backgroundColor: "#FFF", padding: "1.75rem", borderRadius: "20px", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={18} style={{ color: "#D97706" }} /> Inventory Stock Alerts
          </h3>

          {!data?.lowStockAlerts || data.lowStockAlerts.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "#10B981", fontWeight: 700 }}>✓ All products are well stocked above alert thresholds.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {data.lowStockAlerts.map((prod: any) => (
                <div key={prod.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem", backgroundColor: prod.inventory === 0 ? "#FEF2F2" : "#FEF3C7", borderRadius: "12px", border: prod.inventory === 0 ? "1px solid #FCA5A5" : "1px solid #FDE68A", fontSize: "0.85rem" }}>
                  <div>
                    <strong>{prod.title}</strong>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>Threshold: {prod.lowStockThreshold} units</div>
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.6rem", borderRadius: "6px", backgroundColor: prod.inventory === 0 ? "#DC2626" : "#D97706", color: "#FFF" }}>
                    {prod.inventory === 0 ? "SOLD OUT" : `${prod.inventory} LEFT`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
