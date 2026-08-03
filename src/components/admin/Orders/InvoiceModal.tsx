"use client";

import React from "react";
import { Printer, X, MessageSquare, Download, CheckCircle2, ShieldCheck, Share2 } from "lucide-react";

interface InvoiceModalProps {
  isOpen: boolean;
  order: any;
  onClose: () => void;
}

export default function InvoiceModal({ isOpen, order, onClose }: InvoiceModalProps) {
  if (!isOpen || !order) return null;

  const isQuote = order.orderType === "QUOTE";
  const invoiceObj = order.invoices?.[0];
  const invoiceNumber = invoiceObj?.invoiceNumber || (isQuote ? `QUO-${order.orderNumber}` : `INV-${order.orderNumber}`);

  const handlePrint = () => {
    window.print();
  };

  // Generate WhatsApp Message Template
  const generateWhatsAppMessage = () => {
    const text = `Hello ${order.shippingName},

Thank you for your ${isQuote ? "inquiry" : "order"} with *Polacraft Studio*! 🎨🎬

*${isQuote ? "QUOTATION" : "TAX INVOICE"} DETAILS:*
--------------------------------
📄 *${isQuote ? "Quote #" : "Invoice #"}:* ${invoiceNumber}
📦 *Order #: * ${order.orderNumber}
📅 *Date:* ${new Date(order.createdAt).toLocaleDateString("en-IN")}

*ITEMS:*
${order.items?.map((item: any) => `• ${item.title} (${item.size} • ${item.frame}) x${item.quantity} - ₹${item.price * item.quantity}`).join("\n")}

--------------------------------
💰 *Subtotal:* ₹${order.subtotal}
🚚 *Shipping:* ₹${order.shippingCost}
${order.discount > 0 ? `🏷️ *Discount:* -₹${order.discount}\n` : ""}💳 *Total Amount:* ₹${order.total}
📌 *Payment Status:* ${order.paymentStatus}

Thank you for bringing Malayalam Cinema home with Polacraft!
🌐 Website: https://polacraft.in
📞 Support: support@polacraft.com`;

    const encoded = encodeURIComponent(text);
    const cleanPhone = (order.phone || "").replace(/\D/g, "");
    const waUrl = cleanPhone.length >= 10 ? `https://wa.me/91${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div
      id="printable-invoice-modal"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15,23,42,0.8)",
        backdropFilter: "blur(6px)",
        zIndex: 1200,
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
          maxWidth: "800px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions Bar */}
        <div className="no-print" style={{ padding: "1.25rem 1.75rem", backgroundColor: "#0F172A", color: "#FFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 800 }}>
            {isQuote ? "Pro-Forma Quotation Preview" : "GST-Ready Tax Invoice Preview"}
          </div>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              onClick={generateWhatsAppMessage}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#25D366",
                color: "#FFF",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <MessageSquare size={16} /> Send via WhatsApp
            </button>

            <button
              onClick={handlePrint}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#10B981",
                color: "#FFF",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Printer size={16} /> Print / Save PDF
            </button>

            <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div
          id="printable-invoice-content"
          style={{
            padding: "2.5rem 3rem",
            overflowY: "auto",
            flexGrow: 1,
            color: "#1E1E1E",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Invoice Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", borderBottom: "2px solid #0F172A", paddingBottom: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: "900", margin: 0, letterSpacing: "-0.03em", color: "#0F172A" }}>
                POLACRAFT
              </h1>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#64748B" }}>
                Fine Art Cinema Posters & Archival Prints
                <br />
                GSTIN: 32AABCP1234F1ZP
                <br />
                Kochi, Kerala, India • support@polacraft.com
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "900", margin: 0, color: isQuote ? "#D97706" : "#10B981" }}>
                {isQuote ? "PRO-FORMA QUOTATION" : "TAX INVOICE"}
              </h2>
              <p style={{ margin: "6px 0 0 0", fontSize: "0.85rem", color: "#0F172A", fontWeight: 700 }}>
                {isQuote ? "Quote #" : "Invoice #"}: {invoiceNumber}
                <br />
                Order #: {order.orderNumber}
                <br />
                Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          {/* Billing & Shipping Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem", padding: "1.25rem", backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}>
            <div>
              <strong style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Billed & Shipped To:</strong>
              <div style={{ marginTop: "0.4rem", fontWeight: 800, fontSize: "0.95rem", color: "#0F172A" }}>{order.shippingName}</div>
              <div>{order.shippingStreet}</div>
              <div>{order.shippingCity}, {order.shippingState} - {order.shippingZip}</div>
              <div>Phone: <strong>{order.phone || "N/A"}</strong></div>
              <div>Email: {order.email}</div>
            </div>

            <div>
              <strong style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Order Metadata:</strong>
              <div style={{ marginTop: "0.4rem" }}>Source: <strong>{order.orderSource}</strong></div>
              <div>Payment Mode: <strong>{order.paymentMethod || "UPI"}</strong></div>
              <div>Payment Status: <strong>{order.paymentStatus}</strong></div>
              <div>Fulfillment Status: <strong>{order.shippingStatus}</strong></div>
            </div>
          </div>

          {/* Itemized Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", marginBottom: "2rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #0F172A", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 0", color: "#0F172A", fontWeight: 800 }}>Item Description</th>
                <th style={{ padding: "0.75rem 0", color: "#0F172A", fontWeight: 800 }}>Size & Finish</th>
                <th style={{ padding: "0.75rem 0", textAlign: "center", color: "#0F172A", fontWeight: 800 }}>Qty</th>
                <th style={{ padding: "0.75rem 0", textAlign: "right", color: "#0F172A", fontWeight: 800 }}>Rate</th>
                <th style={{ padding: "0.75rem 0", textAlign: "right", color: "#0F172A", fontWeight: 800 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: "1px solid #E2E8F0" }}>
                  <td style={{ padding: "0.85rem 0", fontWeight: 700 }}>{item.title}</td>
                  <td style={{ padding: "0.85rem 0", color: "#64748B" }}>{item.size} • {item.frame}</td>
                  <td style={{ padding: "0.85rem 0", textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ padding: "0.85rem 0", textAlign: "right" }}>₹{item.price}</td>
                  <td style={{ padding: "0.85rem 0", textAlign: "right", fontWeight: 800 }}>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Breakdown */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2.5rem" }}>
            <div style={{ width: "260px", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#10B981" }}>
                  <span>Discount:</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Shipping Charge:</span>
                <span>₹{order.shippingCost}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #0F172A", paddingTop: "0.5rem", fontWeight: 900, fontSize: "1.1rem", color: "#0F172A" }}>
                <span>Total Amount:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Sign Off & QR Footer */}
          <div style={{ textAlign: "center", paddingTop: "1.5rem", borderTop: "1px solid #E2E8F0", fontSize: "0.75rem", color: "#64748B" }}>
            Thank you for choosing Polacraft Cinema Art Prints!
            <br />
            This is a computer-generated tax invoice. Verified for authenticity.
          </div>
        </div>

        {/* Print Stylesheet */}
        <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
            html, body {
              background: #FFF !important;
              color: #000 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            body * {
              visibility: hidden !important;
            }
            #printable-invoice-modal,
            #printable-invoice-modal *,
            #printable-invoice-content,
            #printable-invoice-content * {
              visibility: visible !important;
            }
            #printable-invoice-modal {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #FFF !important;
              backdrop-filter: none !important;
              box-shadow: none !important;
              z-index: 9999999 !important;
              display: block !important;
            }
            #printable-invoice-content {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              padding: 10mm 15mm !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              background: #FFF !important;
              color: #000 !important;
            }
            .no-print {
              display: none !important;
              visibility: hidden !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
