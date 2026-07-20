import React from "react";
import { Users, Mail, Shield } from "lucide-react";

export default function AdminCustomersPage() {
  const customers = [
    { id: "1", name: "Arjun Menon", email: "arjun@example.com", orders: 4, spent: "₹7,996", role: "CUSTOMER" },
    { id: "2", name: "Polacraft Admin", email: "admin@polacraft.in", orders: 0, spent: "₹0", role: "ADMIN" },
    { id: "3", name: "Meera Nair", email: "meera@example.com", orders: 2, spent: "₹2,998", role: "CUSTOMER" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>Customer Directory</h1>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>Manage user profiles, customer activity, and authorization roles.</p>
      </div>

      <div style={{ backgroundColor: "#FFF", borderRadius: "16px", padding: "1.5rem", border: "1px solid #EFECE6" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #EFECE6", color: "#666" }}>
              <th style={{ padding: "1rem" }}>Customer</th>
              <th style={{ padding: "1rem" }}>Email</th>
              <th style={{ padding: "1rem" }}>Role</th>
              <th style={{ padding: "1rem" }}>Orders</th>
              <th style={{ padding: "1rem" }}>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "1rem", fontWeight: "700" }}>{c.name}</td>
                <td style={{ padding: "1rem", color: "#555" }}>{c.email}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: "800",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "6px",
                    backgroundColor: c.role === "ADMIN" ? "#ECFDF5" : "#F3F4F6",
                    color: c.role === "ADMIN" ? "#047857" : "#4B5563"
                  }}>
                    {c.role}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>{c.orders}</td>
                <td style={{ padding: "1rem", fontWeight: "700" }}>{c.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
