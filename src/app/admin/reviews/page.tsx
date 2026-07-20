import React from "react";
import { Star, CheckCircle } from "lucide-react";

export default function AdminReviewsPage() {
  const reviews = [
    { id: "1", user: "Arjun M.", product: "Manichitrathazhu", rating: 5, comment: "Archival paper quality is stunning! The colors are vibrant.", verified: true },
    { id: "2", user: "Meera R.", product: "Thoovanathumbikal", rating: 5, comment: "Minimal aesthetic perfectly suits my living room workspace.", verified: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>Product Reviews</h1>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>Moderate customer feedback, review approvals, and verified buyer badges.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ backgroundColor: "#FFF", borderRadius: "16px", padding: "1.5rem", border: "1px solid #EFECE6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <strong style={{ fontSize: "1rem" }}>{r.user} on {r.product}</strong>
              <div style={{ color: "#F59E0B", display: "flex", gap: "2px" }}>
                {[...Array(r.rating)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" />)}
              </div>
            </div>
            <p style={{ color: "#444", fontSize: "0.9rem", margin: "0.5rem 0" }}>"{r.comment}"</p>
            {r.verified && (
              <span style={{ fontSize: "0.75rem", color: "#059669", display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle size={12} /> Verified Purchase
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
