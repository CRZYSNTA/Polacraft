import Link from "next/link";

export const metadata = {
  title: "Customer Accounts Coming Soon | Polacraft",
};

export default function CustomerProfilePage() {
  return (
    <div style={{ maxWidth: "680px", margin: "10rem auto 6rem", padding: "0 1.5rem", textAlign: "center" }}>
      <p style={{ color: "#64748B", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Polacraft
      </p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", margin: "0.5rem 0 1rem" }}>
        Customer accounts are coming soon.
      </h1>
      <p style={{ color: "#475569", lineHeight: 1.7 }}>
        We are preparing secure order tracking and saved addresses. For an existing order, please contact support with your order number.
      </p>
      <Link href="/contact" style={{ display: "inline-block", marginTop: "1.5rem", padding: "0.75rem 1.25rem", borderRadius: "10px", background: "#1E1E1E", color: "#fff", textDecoration: "none", fontWeight: 700 }}>
        Contact support
      </Link>
    </div>
  );
}
