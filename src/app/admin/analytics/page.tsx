"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, DollarSign, ShoppingBag, Loader2, Download, Package, ShieldCheck, Truck, Sparkles, PieChart, FileText, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

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
        <Loader2 size={24} className="animate-spin" /> Calculating real-time financial ERP & profit metrics...
      </div>
    );
  }

  const metrics = data?.metrics || {
    revenueToday: 0,
    netProfitToday: 0,
    revenueThisMonth: 0,
    netProfitThisMonth: 0,
    revenueCollected: 0,
    totalNetProfit: 0,
    totalOperatingExpenses: 0,
    actualBusinessNetProfit: 0,
    overallProfitMargin: 0,
    inventoryValuationTotal: 0,
    averageOrderValue: 0,
    totalRewardCost: 0,
    ordersPaid: 0,
  };

  const topProfitableProducts = data?.topProfitableProducts || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "1250px", margin: "0 auto", padding: "1.5rem" }}>
      {/* Header & Report Export Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#0F172A", margin: 0, letterSpacing: "-0.03em" }}>
            Polacraft Business Intelligence & Financial ERP
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
            Real-time executive financial dashboard: Order Gross Profits, Operating Expenses, Net Cash Flow, and Unit Economics.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.65rem" }}>
          <a
            href="/api/admin/reports/export?type=PL"
            download
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "10px",
              backgroundColor: "#0F172A",
              color: "#FFF",
              fontWeight: 800,
              fontSize: "0.8rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Download size={14} /> P&L Statement (CSV)
          </a>
          <a
            href="/api/admin/reports/export?type=GST"
            download
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "10px",
              backgroundColor: "#10B981",
              color: "#FFF",
              fontWeight: 800,
              fontSize: "0.8rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <FileText size={14} /> GST Tax Report
          </a>
          <Link
            href="/admin/expenses"
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              backgroundColor: "#FFF",
              color: "#0F172A",
              fontWeight: 800,
              fontSize: "0.8rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <DollarSign size={14} style={{ color: "#EF4444" }} /> Expense Manager →
          </Link>
        </div>
      </div>

      {/* Row 1: Executive KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
        {/* 1. Today's Revenue & Net Profit */}
        <div style={{ backgroundColor: "#F0FDF4", padding: "1.25rem", borderRadius: "18px", border: "1.5px solid #BBF7D0" }}>
          <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Today's Net Profit
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#15803D", marginTop: "2px" }}>
            +₹{metrics.netProfitToday.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#166534", marginTop: "4px" }}>
            Revenue Today: <strong>₹{metrics.revenueToday.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* 2. Monthly Revenue & Net Profit */}
        <div style={{ backgroundColor: "#EFF6FF", padding: "1.25rem", borderRadius: "18px", border: "1.5px solid #BFDBFE" }}>
          <div style={{ fontSize: "0.75rem", color: "#1E40AF", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            This Month's Net Profit
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#1D4ED8", marginTop: "2px" }}>
            +₹{metrics.netProfitThisMonth.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#1E40AF", marginTop: "4px" }}>
            Revenue MTD: <strong>₹{metrics.revenueThisMonth.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* 3. Actual Business Net Profit */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid #CBD5E1", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Actual Business Net Profit
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: metrics.actualBusinessNetProfit >= 0 ? "#0F172A" : "#DC2626", marginTop: "2px" }}>
            ₹{metrics.actualBusinessNetProfit.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#EF4444", marginTop: "4px" }}>
            Logged Operating Expenses: <strong>-₹{metrics.totalOperatingExpenses.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* 4. Overall Profit Margin % */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid #CBD5E1", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Overall Profit Margin %
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: metrics.overallProfitMargin >= 40 ? "#15803D" : "#D97706", marginTop: "2px" }}>
            {metrics.overallProfitMargin}%
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "4px" }}>
            Gross Revenue: <strong>₹{metrics.revenueCollected.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* 5. Inventory Valuation */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid #CBD5E1", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Physical Inventory Capital Value
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#7C3AED", marginTop: "2px" }}>
            ₹{metrics.inventoryValuationTotal.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "4px" }}>
            Capital tied up in physical poster stock
          </div>
        </div>
      </div>

      {/* Product Profitability & Unit Economics Matrix Table */}
      <div style={{ backgroundColor: "#FFF", borderRadius: "20px", padding: "1.5rem", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 900, color: "#0F172A", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <TrendingUp size={20} style={{ color: "#10B981" }} /> Top Profitable Posters & Unit Economics Matrix
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.78rem", color: "#64748B" }}>
              Displays exact revenue, production cost, net profit, and profit margin % per poster title.
            </p>
          </div>
          <a
            href="/api/admin/reports/export?type=SALES"
            download
            style={{ fontSize: "0.75rem", fontWeight: 800, color: "#2563EB", textDecoration: "none" }}
          >
            Export All Sales Data (CSV) →
          </a>
        </div>

        {topProfitableProducts.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94A3B8", fontSize: "0.85rem" }}>
            No sales data recorded yet.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #E2E8F0", color: "#64748B", fontWeight: 800 }}>
                <th style={{ padding: "0.85rem" }}>Poster Title</th>
                <th style={{ padding: "0.85rem", textAlign: "center" }}>Units Sold</th>
                <th style={{ padding: "0.85rem", textAlign: "right" }}>Gross Revenue</th>
                <th style={{ padding: "0.85rem", textAlign: "right" }}>Production Cost</th>
                <th style={{ padding: "0.85rem", textAlign: "right" }}>Net Profit</th>
                <th style={{ padding: "0.85rem", textAlign: "right" }}>Profit Margin %</th>
              </tr>
            </thead>
            <tbody>
              {topProfitableProducts.map((item: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "0.85rem", fontWeight: 800, color: "#0F172A" }}>
                    {item.product?.title || "Poster Print"}
                    <div style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 400 }}>{item.product?.collectionName}</div>
                  </td>
                  <td style={{ padding: "0.85rem", textAlign: "center", fontWeight: 800 }}>
                    {item.unitsSold} units
                  </td>
                  <td style={{ padding: "0.85rem", textAlign: "right", fontWeight: 700 }}>
                    ₹{item.revenue.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "0.85rem", textAlign: "right", color: "#EF4444" }}>
                    -₹{Math.round(item.cost).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "0.85rem", textAlign: "right", fontWeight: 900, color: item.profit >= 0 ? "#15803D" : "#DC2626" }}>
                    {item.profit >= 0 ? "+" : ""}₹{Math.round(item.profit).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "0.85rem", textAlign: "right", fontWeight: 800 }}>
                    <span style={{ padding: "0.2rem 0.5rem", borderRadius: "6px", backgroundColor: item.margin >= 40 ? "#ECFDF5" : item.margin >= 20 ? "#FFFBEB" : "#FEF2F2", color: item.margin >= 40 ? "#166534" : item.margin >= 20 ? "#D97706" : "#DC2626" }}>
                      {item.margin}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
