"use client";

import React, { useState, useTransition } from "react";
import { X, DollarSign, CheckCircle2, Loader2, CreditCard, ShieldCheck, FileText } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { recordOrderPaymentAction } from "@/features/admin/orderEngineActions";

interface PaymentLedgerModalProps {
  isOpen: boolean;
  order: any;
  onClose: () => void;
  onSuccess: (updatedOrder: any) => void;
}

export default function PaymentLedgerModal({ isOpen, order, onClose, onSuccess }: PaymentLedgerModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [mode, setMode] = useState<"UPI" | "CASH" | "BANK_TRANSFER" | "CREDIT_CARD" | "DEBIT_CARD" | "COD">("UPI");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!isOpen || !order) return null;

  const totalPaid = (order.payments || []).reduce((acc: number, p: any) => acc + p.amount, 0);
  const remainingBalance = Math.max(0, order.total - totalPaid);

  const handleRecordPayment = () => {
    if (amount <= 0) {
      alert("Payment amount must be greater than zero.");
      return;
    }

    startTransition(async () => {
      const res = await recordOrderPaymentAction(
        order.id,
        amount,
        mode,
        transactionRef,
        paymentProofUrl,
        notes
      );

      if (res.success && res.order) {
        alert(`Recorded ₹${amount} payment successfully!`);
        onSuccess(res.order);
        setAmount(0);
        setTransactionRef("");
        setPaymentProofUrl("");
        setNotes("");
      } else {
        alert("Payment Recording Error: " + (res.error || "Unknown error"));
      }
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15,23,42,0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFF",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: "1.25rem 1.75rem", backgroundColor: "#0F172A", color: "#FFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <DollarSign size={22} style={{ color: "#10B981" }} />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 900 }}>
                Payment Ledger — Order #{order.orderNumber}
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#94A3B8" }}>
                Record UPI, Cash, Bank Transfer & Partial Advance Payments
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flexGrow: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Summary Balance Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.85rem", backgroundColor: "#F8FAFC", padding: "1rem", borderRadius: "16px", border: "1px solid #E2E8F0", textAlign: "center" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Order Total</span>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0F172A" }}>₹{order.total}</div>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Total Paid</span>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#047857" }}>₹{totalPaid}</div>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Remaining Balance</span>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: remainingBalance > 0 ? "#DC2626" : "#047857" }}>₹{remainingBalance}</div>
            </div>
          </div>

          {/* Previous Payments History List */}
          <div>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: 800, color: "#0F172A" }}>Payment Transactions History ({order.payments?.length || 0})</h4>
            {(!order.payments || order.payments.length === 0) ? (
              <div style={{ padding: "1rem", backgroundColor: "#FFFBEB", borderRadius: "10px", border: "1px border #FCD34D", fontSize: "0.8rem", color: "#92400E" }}>
                No payments recorded yet for this order.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {order.payments.map((p: any) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.85rem", backgroundColor: "#ECFDF5", borderRadius: "8px", border: "1px solid #A7F3D0", fontSize: "0.8rem" }}>
                    <div>
                      <strong>₹{p.amount}</strong> via <span style={{ fontWeight: 700 }}>{p.paymentMode}</span>
                      {p.transactionRef && <span style={{ color: "#047857" }}> (Ref: {p.transactionRef})</span>}
                    </div>
                    <span style={{ color: "#065F46", fontSize: "0.75rem" }}>
                      {new Date(p.paidAt).toLocaleDateString("en-IN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Record New Payment Form */}
          <div style={{ backgroundColor: "#F8FAFC", padding: "1.25rem", borderRadius: "16px", border: "1.5px solid #CBD5E1", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ShieldCheck size={16} style={{ color: "#10B981" }} /> Record New Payment Entry
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Payment Amount (₹) *</label>
                <input
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder={`e.g. ${remainingBalance}`}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Payment Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value as any)} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}>
                  <option value="UPI">Google Pay / PhonePe / UPI</option>
                  <option value="CASH">Cash Payment</option>
                  <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                  <option value="CREDIT_CARD">Credit / Debit Card</option>
                  <option value="COD">Cash on Delivery (COD)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Transaction Reference / UPI Ref ID</label>
              <input type="text" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} placeholder="e.g. T240720123456789" style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
            </div>

            <ImageUploader
              label="Payment Screenshot Proof (Optional Cloudinary Upload)"
              value={paymentProofUrl}
              folder="polacraft/payments"
              onChange={(newUrl) => setPaymentProofUrl(newUrl)}
            />

            <button
              type="button"
              onClick={handleRecordPayment}
              disabled={isPending || amount <= 0}
              style={{
                padding: "0.75rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#10B981",
                color: "#FFF",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: isPending || amount <= 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
              }}
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              Confirm & Record Payment Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
