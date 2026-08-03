"use client";

import React, { useState, useEffect, useTransition } from "react";
import { DollarSign, Plus, Trash2, Tag, Calendar, FileText, Loader2, Image as ImageIcon, ExternalLink, ShieldCheck, Filter } from "lucide-react";
import { getOperatingExpensesAction, createOperatingExpenseAction, deleteOperatingExpenseAction } from "@/features/admin/expenseActions";
import ImageUploader from "@/components/admin/ImageUploader";

export default function OperatingExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<any>("SUPPLIES");
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [receiptImage, setReceiptImage] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [isPending, startTransition] = useTransition();

  const loadExpenses = async () => {
    setLoading(true);
    const res = await getOperatingExpensesAction();
    if (res.success && res.expenses) {
      setExpenses(res.expenses);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || Number(amount) <= 0) {
      alert("Title and a valid Amount are required.");
      return;
    }

    startTransition(async () => {
      const res = await createOperatingExpenseAction({
        title,
        category,
        amount: Number(amount),
        description,
        receiptImage,
        date,
      });

      if (res.success) {
        setIsModalOpen(false);
        setTitle("");
        setAmount("");
        setDescription("");
        setReceiptImage("");
        loadExpenses();
      } else {
        alert("Failed to log expense: " + res.error);
      }
    });
  };

  const handleDelete = (id: string, expTitle: string) => {
    if (!confirm(`Delete expense "${expTitle}"?`)) return;
    startTransition(async () => {
      const res = await deleteOperatingExpenseAction(id);
      if (res.success) {
        loadExpenses();
      } else {
        alert("Delete failed: " + res.error);
      }
    });
  };

  const filteredExpenses = activeCategory === "ALL"
    ? expenses
    : expenses.filter((e) => e.category === activeCategory);

  const totalExpenseAmount = filteredExpenses.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0F172A", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <DollarSign size={28} style={{ color: "#EF4444" }} /> Operating Expense Manager
          </h1>
          <p style={{ margin: "4px 0 0 0", color: "#64748B", fontSize: "0.85rem" }}>
            Track printer ink, packaging supplies, marketing ads, equipment & fixed business overheads.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "0.75rem 1.25rem",
            borderRadius: "12px",
            backgroundColor: "#EF4444",
            color: "#FFF",
            fontWeight: 800,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.85rem",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
          }}
        >
          <Plus size={18} /> Log Operating Expense
        </button>
      </div>

      {/* Expense Summary KPI Banner */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ backgroundColor: "#FEF2F2", padding: "1.25rem", borderRadius: "16px", border: "1.5px solid #FCA5A5" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#991B1B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Total Logged Expenses ({activeCategory})
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#DC2626", marginTop: "4px" }}>
            ₹{totalExpenseAmount.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#B91C1C", marginTop: "4px" }}>
            Deducted automatically from Gross Sales for Net Business Profit.
          </div>
        </div>

        {/* Category Quick Filters */}
        <div style={{ backgroundColor: "#FFF", padding: "1.25rem", borderRadius: "16px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
            Expense Categories Filter
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["ALL", "SUPPLIES", "MARKETING", "EQUIPMENT", "SOFTWARE", "SHIPPING", "OTHER"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "0.45rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  border: activeCategory === cat ? "none" : "1px solid #CBD5E1",
                  backgroundColor: activeCategory === cat ? "#0F172A" : "#F8FAFC",
                  color: activeCategory === cat ? "#FFF" : "#475569",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div style={{ backgroundColor: "#FFF", borderRadius: "16px", padding: "1.5rem", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Loader2 size={24} className="animate-spin" /> Loading expense records...
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
            <Tag size={40} style={{ marginBottom: "0.75rem", opacity: 0.5 }} />
            <p>No operational expenses logged for category "{activeCategory}".</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #E2E8F0", color: "#64748B", fontWeight: 800 }}>
                <th style={{ padding: "0.85rem" }}>Expense Title</th>
                <th style={{ padding: "0.85rem" }}>Category</th>
                <th style={{ padding: "0.85rem" }}>Date</th>
                <th style={{ padding: "0.85rem" }}>Receipt / Proof</th>
                <th style={{ padding: "0.85rem", textAlign: "right" }}>Amount (₹)</th>
                <th style={{ padding: "0.85rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "0.85rem", fontWeight: 700, color: "#0F172A" }}>
                    {exp.title}
                    {exp.description && <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 400 }}>{exp.description}</div>}
                  </td>
                  <td style={{ padding: "0.85rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "0.2rem 0.5rem", borderRadius: "6px", backgroundColor: "#FEF2F2", color: "#DC2626", border: "1px solid #FCA5A5" }}>
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem", color: "#475569" }}>
                    {new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "0.85rem" }}>
                    {exp.receiptImage ? (
                      <a href={exp.receiptImage} target="_blank" rel="noreferrer" style={{ fontSize: "0.75rem", color: "#2563EB", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <ImageIcon size={14} /> View Receipt <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>No receipt</span>
                    )}
                  </td>
                  <td style={{ padding: "0.85rem", textAlign: "right", fontWeight: 900, color: "#DC2626" }}>
                    -₹{exp.amount.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "0.85rem", textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(exp.id, exp.title)}
                      disabled={isPending}
                      style={{ border: "1px solid #FCA5A5", backgroundColor: "#FFF", color: "#DC2626", padding: "0.35rem 0.6rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD EXPENSE MODAL */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15,23,42,0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FFF",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "550px",
              padding: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", fontWeight: 900, color: "#0F172A", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <DollarSign size={22} style={{ color: "#EF4444" }} /> Log Operational Expense
            </h2>

            <form onSubmit={handleAddExpense} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Expense Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Printer Ink Cartridge / Instagram Ads" style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Category *</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value as any)} style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}>
                    <option value="SUPPLIES">Printing Supplies & Paper</option>
                    <option value="MARKETING">Marketing & Meta Ads</option>
                    <option value="EQUIPMENT">Equipment & Hardware</option>
                    <option value="SOFTWARE">Software & Subscriptions</option>
                    <option value="SHIPPING">Courier Tubes & Packaging</option>
                    <option value="OTHER">Other Operational Expense</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Amount (₹) *</label>
                  <input type="number" required value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="650" style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Expense Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Description / Vendor Note</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Bought 2x Epson Ink Bottles from Amazon..." style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Receipt Screenshot (Cloudinary)</label>
                <ImageUploader
                  value={receiptImage}
                  onChange={(url) => setReceiptImage(url)}
                  label="Upload Receipt Proof Image"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "0.65rem 1.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", backgroundColor: "#FFF", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isPending} style={{ padding: "0.65rem 1.25rem", borderRadius: "8px", border: "none", backgroundColor: "#EF4444", color: "#FFF", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save Expense Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
