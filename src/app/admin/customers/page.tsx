"use client";

import React, { useEffect, useState } from "react";
import { Users, Mail, Phone, MapPin, Award, Search, MessageSquare, ShieldCheck, Loader2 } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async (q = "") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/customers?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.customers) {
          setCustomers(data.customers);
        }
      }
    } catch (e) {
      console.error("[Fetch Admin Customers Error]:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchCustomers(value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em", margin: 0 }}>
            Customer Directory & CRM
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem", margin: "0.25rem 0 0 0" }}>
            Real-time customer profiles, WhatsApp contacts, saved addresses & loyalty accounts.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div style={{ position: "relative", minWidth: "300px" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, email, or phone..."
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              borderRadius: "12px",
              border: "1.5px solid #E2E8F0",
              fontSize: "0.9rem",
              backgroundColor: "#FFFFFF",
            }}
          />
        </div>
      </div>

      {/* METRICS CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
        <div style={{ backgroundColor: "#FFFFFF", padding: "1.5rem", borderRadius: "16px", border: "1px solid #EFECE6" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 700, textTransform: "uppercase" }}>Total Registered Customers</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#111", marginTop: "0.2rem" }}>{customers.length}</div>
        </div>
        <div style={{ backgroundColor: "#FFFFFF", padding: "1.5rem", borderRadius: "16px", border: "1px solid #EFECE6" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 700, textTransform: "uppercase" }}>Customers with Phone #</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#10B981", marginTop: "0.2rem" }}>
            {customers.filter((c) => c.phone).length}
          </div>
        </div>
        <div style={{ backgroundColor: "#FFFFFF", padding: "1.5rem", borderRadius: "16px", border: "1px solid #EFECE6" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 700, textTransform: "uppercase" }}>Saved Addresses</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#D4AF37", marginTop: "0.2rem" }}>
            {customers.filter((c) => c.defaultAddress !== "No address saved").length}
          </div>
        </div>
      </div>

      {/* CUSTOMER DIRECTORY TABLE */}
      <div style={{ backgroundColor: "#FFF", borderRadius: "16px", padding: "1.5rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}>
            <Loader2 size={32} className="animate-spin" style={{ color: "#D4AF37" }} />
          </div>
        ) : customers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#666" }}>
            No customers found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #EFECE6", color: "#64748B", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "1rem" }}>Customer</th>
                  <th style={{ padding: "1rem" }}>WhatsApp Contact</th>
                  <th style={{ padding: "1rem" }}>Default Shipping Address</th>
                  <th style={{ padding: "1rem" }}>Orders / Spend</th>
                  <th style={{ padding: "1rem" }}>Loyalty Points</th>
                  <th style={{ padding: "1rem" }}>Role / Auth</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const cleanPhone = c.phone ? c.phone.replace(/\D/g, "") : "";
                  const whatsappUrl = cleanPhone ? `https://wa.me/91${cleanPhone}` : null;

                  return (
                    <tr key={c.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      
                      {/* NAME & AVATAR & EMAIL */}
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {c.avatar ? (
                            <img src={c.avatar} alt={c.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(212,175,55,0.15)", color: "#D4AF37", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem" }}>
                              {c.name ? c.name[0].toUpperCase() : "C"}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: "800", color: "#1E293B" }}>{c.name}</div>
                            <div style={{ fontSize: "0.8rem", color: "#64748B" }}>{c.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* PHONE & WHATSAPP DIRECT CHAT */}
                      <td style={{ padding: "1rem" }}>
                        {c.phone ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontWeight: 700, color: "#0F172A" }}>{c.phone}</span>
                            {whatsappUrl && (
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  backgroundColor: "#25D366",
                                  color: "#FFF",
                                  padding: "0.2rem 0.55rem",
                                  borderRadius: "8px",
                                  fontSize: "0.75rem",
                                  fontWeight: 800,
                                  textDecoration: "none",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                }}
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare size={12} /> WhatsApp
                              </a>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: "#94A3B8", fontSize: "0.8rem", fontStyle: "italic" }}>Not provided</span>
                        )}
                      </td>

                      {/* ADDRESS */}
                      <td style={{ padding: "1rem", maxWidth: "250px" }}>
                        <span style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.4, display: "block" }}>
                          {c.defaultAddress}
                        </span>
                      </td>

                      {/* ORDERS & SPEND */}
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontWeight: "800", color: "#0F172A" }}>{c.formattedSpent}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{c.ordersCount} Orders</div>
                      </td>

                      {/* LOYALTY POINTS */}
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 800, color: "#D4AF37" }}>
                          <Award size={16} /> {c.loyaltyPoints} pts
                        </div>
                      </td>

                      {/* ROLE & AUTH */}
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "800",
                              padding: "0.2rem 0.6rem",
                              borderRadius: "6px",
                              backgroundColor: c.role === "ADMIN" ? "#ECFDF5" : "#F1F5F9",
                              color: c.role === "ADMIN" ? "#047857" : "#475569",
                              width: "fit-content",
                            }}
                          >
                            {c.role}
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "#94A3B8", textTransform: "capitalize" }}>
                            Via {c.provider}
                          </span>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
