"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  updateOrderStatusAction,
  verifyAndApprovePaymentAction,
  rejectPaymentAction,
} from "@/features/admin/businessActions";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  ShoppingBag,
  Search,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  FileText,
  Loader2,
  X,
  ExternalLink,
  MapPin,
  CreditCard,
  History,
  MessageSquare,
  ShieldCheck,
  Ban,
  AlertOctagon,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  // Selected order for Detail & Timeline modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Selected order for Printable Invoice modal
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);

  // Payment Verification State
  const [upiTxnId, setUpiTxnId] = useState("");
  const [paymentProofImg, setPaymentProofImg] = useState("");
  const [verifyComment, setVerifyComment] = useState("");

  // General Status Update inputs
  const [newStatus, setNewStatus] = useState("CONFIRMED");
  const [newTracking, setNewTracking] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.shippingStatus);
    setNewTracking(order.trackingNumber || "");
    setUpiTxnId(order.upiTransactionId || order.paymentReference || "");
    setPaymentProofImg(order.paymentProofImage || "");
    setVerifyComment("");
  };

  // Action: Verify Payment & Deduct Inventory (Atomic Transaction)
  const handleVerifyAndMarkPaid = () => {
    if (!selectedOrder) return;

    startTransition(async () => {
      const res = await verifyAndApprovePaymentAction(
        selectedOrder.id,
        upiTxnId,
        paymentProofImg,
        verifyComment || "UPI payment verified via screenshot. Order marked PAID & stock deducted."
      );

      if (res.success && res.order) {
        setSelectedOrder(res.order);
        setOrders((prev) => prev.map((o) => (o.id === res.order.id ? res.order : o)));
        alert("Payment verified! Inventory deducted and order marked as PAID.");
      } else {
        alert("Verification Error: " + res.error);
      }
    });
  };

  // Action: Reject Payment
  const handleRejectPayment = () => {
    if (!selectedOrder) return;
    if (!confirm("Are you sure you want to reject this payment and cancel the order?")) return;

    startTransition(async () => {
      const res = await rejectPaymentAction(
        selectedOrder.id,
        verifyComment || "Payment screenshot rejected by admin."
      );

      if (res.success && res.order) {
        setSelectedOrder(res.order);
        setOrders((prev) => prev.map((o) => (o.id === res.order.id ? res.order : o)));
        alert("Payment rejected and order cancelled.");
      } else {
        alert("Error rejecting payment: " + res.error);
      }
    });
  };

  // Action: General Status Update
  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    startTransition(async () => {
      const res = await updateOrderStatusAction(
        selectedOrder.id,
        newStatus as any,
        newTracking,
        selectedOrder.paymentStatus,
        verifyComment,
        upiTxnId
      );

      if (res.success && res.order) {
        setSelectedOrder(res.order);
        setOrders((prev) => prev.map((o) => (o.id === res.order.id ? res.order : o)));
        alert("Order status updated successfully!");
      } else {
        alert("Error updating order: " + res.error);
      }
    });
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleOpenWhatsAppChat = (phone?: string, orderNumber?: string) => {
    if (!phone) {
      alert("No customer phone number provided for this order.");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = encodeURIComponent(`Hi! Following up regarding your Polacraft Order #${orderNumber}.`);
    window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.phone && o.phone.includes(searchQuery));

    const matchesStatus = statusFilter === "ALL" || o.shippingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-0.03em" }}>
            Orders & Manual Payment Verification
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Verify WhatsApp UPI payments, approve transactions, deduct inventory atomically, and generate GST invoices.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["ALL", "WHATSAPP_PENDING", "CONFIRMED", "PAID", "PACKED", "SHIPPED", "DELIVERED", "EXPIRED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: "20px",
                border: "1px solid #E5E7EB",
                fontSize: "0.8rem",
                fontWeight: 700,
                backgroundColor: statusFilter === st ? "#1E1E1E" : "#FFF",
                color: statusFilter === st ? "#FFF" : "#4B5563",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#FFF",
            border: "1px solid #E5E7EB",
            borderRadius: "30px",
            padding: "0.45rem 1rem",
            width: "300px",
          }}
        >
          <Search size={16} style={{ color: "#9CA3AF" }} />
          <input
            type="text"
            placeholder="Filter order # or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: "none", outline: "none", fontSize: "0.85rem", width: "100%" }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: "#FFF", borderRadius: "16px", padding: "1.5rem", border: "1px solid #EFECE6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Loader2 size={24} className="animate-spin" /> Loading customer orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
            <ShoppingBag size={40} style={{ marginBottom: "1rem", opacity: 0.5 }} />
            <p>No customer orders match your search criteria.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #EFECE6", color: "#666", fontWeight: "700" }}>
                <th style={{ padding: "1rem" }}>Order Ref</th>
                <th style={{ padding: "1rem" }}>Customer & Phone</th>
                <th style={{ padding: "1rem" }}>Purchased Items</th>
                <th style={{ padding: "1rem" }}>Total</th>
                <th style={{ padding: "1rem" }}>Fulfillment</th>
                <th style={{ padding: "1rem" }}>Payment Status</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isWhatsapp = order.shippingStatus === "WHATSAPP_PENDING";
                const isDelivered = order.shippingStatus === "DELIVERED";
                const isPaid = order.paymentStatus === "VERIFIED" || order.shippingStatus === "PAID";
                const isExpired = order.shippingStatus === "EXPIRED";

                return (
                  <tr key={order.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "1rem", fontWeight: "800" }}>
                      #{order.orderNumber}
                      <div style={{ fontSize: "0.75rem", color: "#888", fontWeight: "400" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <strong style={{ display: "block" }}>{order.shippingName}</strong>
                      <span style={{ fontSize: "0.75rem", color: "#666" }}>{order.phone || order.email}</span>
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontSize: "0.85rem", color: "#333" }}>
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} style={{ fontSize: "0.8rem" }}>
                            • <strong>{item.product?.title || "Poster"}</strong> ({item.size}, {item.frame}) x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td style={{ padding: "1rem", fontWeight: "800" }}>
                      ₹{order.total}
                      {order.discount > 0 && (
                        <div style={{ fontSize: "0.7rem", color: "#10B981", fontWeight: 700 }}>
                          Disc: -₹{order.discount}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "800",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "8px",
                          backgroundColor: isExpired ? "#FEE2E2" : isWhatsapp ? "#DBEAFE" : isPaid || isDelivered ? "#ECFDF5" : "#FEF3C7",
                          color: isExpired ? "#DC2626" : isWhatsapp ? "#2563EB" : isPaid || isDelivered ? "#047857" : "#B45309",
                        }}
                      >
                        {order.shippingStatus}
                      </span>
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "800",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "6px",
                          backgroundColor: isPaid ? "#ECFDF5" : "#FFFBEB",
                          color: isPaid ? "#047857" : "#D97706",
                          border: isPaid ? "1px solid #A7F3D0" : "1px solid #FDE68A",
                        }}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.4rem" }}>
                        <button
                          onClick={() => handleOpenWhatsAppChat(order.phone, order.orderNumber)}
                          style={{
                            border: "none",
                            background: "#25D366",
                            color: "#FFF",
                            borderRadius: "8px",
                            padding: "0.4rem 0.6rem",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          title="Open WhatsApp conversation"
                        >
                          <MessageSquare size={14} /> Chat
                        </button>
                        <button
                          onClick={() => handleOpenDetail(order)}
                          style={{
                            border: "1px solid #E5E7EB",
                            background: "#FFF",
                            borderRadius: "8px",
                            padding: "0.4rem 0.6rem",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Truck size={14} /> Manage
                        </button>
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          style={{
                            border: "1px solid #10B981",
                            background: "#ECFDF5",
                            color: "#047857",
                            borderRadius: "8px",
                            padding: "0.4rem 0.6rem",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Printer size={14} /> Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ORDER TIMELINE & PAYMENT VERIFICATION MODAL */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              backgroundColor: "#FFF",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "850px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #EFECE6" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "800" }}>
                  Order #{selectedOrder.orderNumber} Management
                </h2>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
              {/* Left Column: Order Manifest & Payment Verification Panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* 1. Payment Verification Card */}
                <div style={{ backgroundColor: "#F8FAFC", borderRadius: "16px", padding: "1.25rem", border: "1.5px solid #CBD5E1" }}>
                  <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", fontWeight: 800, color: "#1E293B", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ShieldCheck size={20} style={{ color: "#10B981" }} /> Manual Payment Verification (UPI)
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", alignItems: "center" }}>
                      <span style={{ color: "#64748B" }}>Payment Status:</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "6px", backgroundColor: selectedOrder.paymentStatus === "VERIFIED" ? "#ECFDF5" : "#FFFBEB", color: selectedOrder.paymentStatus === "VERIFIED" ? "#047857" : "#B45309", border: "1px solid #CBD5E1" }}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>UPI Transaction Ref ID</label>
                      <input type="text" placeholder="e.g. T240720123456789" value={upiTxnId} onChange={(e) => setUpiTxnId(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
                    </div>

                    <ImageUploader
                      label="Payment Screenshot Proof (Cloudinary Upload)"
                      value={paymentProofImg}
                      folder="polacraft/payments"
                      onChange={(newUrl) => setPaymentProofImg(newUrl)}
                    />

                    {selectedOrder.inventoryDeductedAt && (
                      <div style={{ fontSize: "0.75rem", color: "#047857", fontWeight: 700, backgroundColor: "#ECFDF5", padding: "0.4rem 0.6rem", borderRadius: "6px" }}>
                        ✓ Inventory deducted at {new Date(selectedOrder.inventoryDeductedAt).toLocaleTimeString("en-IN")}
                      </div>
                    )}

                    {/* Verification Buttons */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={handleVerifyAndMarkPaid}
                        disabled={isPending || selectedOrder.paymentStatus === "VERIFIED"}
                        style={{
                          padding: "0.75rem",
                          borderRadius: "10px",
                          border: "none",
                          backgroundColor: selectedOrder.paymentStatus === "VERIFIED" ? "#94A3B8" : "#10B981",
                          color: "#FFF",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          cursor: selectedOrder.paymentStatus === "VERIFIED" ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                        }}
                      >
                        {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        {selectedOrder.paymentStatus === "VERIFIED" ? "Payment Verified" : "Verify & Mark Paid"}
                      </button>

                      <button
                        type="button"
                        onClick={handleRejectPayment}
                        disabled={isPending}
                        style={{
                          padding: "0.75rem",
                          borderRadius: "10px",
                          border: "1px solid #FCA5A5",
                          backgroundColor: "#FEF2F2",
                          color: "#DC2626",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <Ban size={16} /> Reject Payment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Destination & Contact */}
                <div>
                  <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <MapPin size={18} /> Shipping Destination
                  </h4>
                  <div style={{ backgroundColor: "#F9FAFB", padding: "1rem", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                    <strong>{selectedOrder.shippingName}</strong>
                    <br />
                    {selectedOrder.shippingStreet}
                    <br />
                    {selectedOrder.shippingCity}, {selectedOrder.shippingState} - {selectedOrder.shippingZip}
                    <br />
                    Phone: <strong>{selectedOrder.phone || "N/A"}</strong>
                    <br />
                    <span style={{ color: "#666" }}>Email: {selectedOrder.email}</span>

                    <div style={{ marginTop: "0.75rem" }}>
                      <button
                        onClick={() => handleOpenWhatsAppChat(selectedOrder.phone, selectedOrder.orderNumber)}
                        style={{
                          border: "none",
                          backgroundColor: "#25D366",
                          color: "#FFF",
                          padding: "0.45rem 0.85rem",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <MessageSquare size={14} /> Open WhatsApp Chat
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items Manifest */}
                <div>
                  <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ShoppingBag size={18} /> Itemized Manifest
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", backgroundColor: "#F9FAFB", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                        <div>
                          <strong>{item.product?.title || "Poster Print"}</strong>
                          <div style={{ fontSize: "0.75rem", color: "#666" }}>
                            Size: {item.size} • Frame: {item.frame}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", fontWeight: 700 }}>
                          ₹{item.price} x {item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Status Transition Form & Audit Log */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* General Status Update Form */}
                <form onSubmit={handleUpdateStatus} style={{ backgroundColor: "#F9FAFB", padding: "1.25rem", borderRadius: "16px", border: "1px solid #E5E7EB", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Truck size={18} /> Update Fulfillment Pipeline
                  </h4>

                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Fulfillment Status</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                      <option value="WHATSAPP_PENDING">WHATSAPP PENDING (Unpaid)</option>
                      <option value="CONFIRMED">CONFIRMED (Stock Approved)</option>
                      <option value="PAID">PAID (Triggers Inventory Reduction)</option>
                      <option value="PACKED">PACKED (Ready for dispatch)</option>
                      <option value="SHIPPED">SHIPPED (In transit)</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="EXPIRED">EXPIRED (Unpaid 24h)</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Courier Tracking #</label>
                    <input type="text" placeholder="e.g. AWB7893241" value={newTracking} onChange={(e) => setNewTracking(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }} />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>Status Log Comment</label>
                    <input type="text" placeholder="Package dispatched via BlueDart Express." value={verifyComment} onChange={(e) => setVerifyComment(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }} />
                  </div>

                  <button type="submit" disabled={isPending} style={{ padding: "0.75rem", borderRadius: "10px", border: "none", backgroundColor: "#1E1E1E", color: "#FFF", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : "Update Fulfillment Status"}
                  </button>
                </form>

                {/* Audit Log Timeline */}
                <div>
                  <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <History size={18} /> Complete Order Audit Log
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {selectedOrder.statusHistory?.map((log: any, idx: number) => (
                      <div key={idx} style={{ padding: "0.65rem 0.85rem", backgroundColor: "#FFF", borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: "0.8rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                          <span style={{ color: log.status === "PAID" ? "#047857" : "#1E293B" }}>{log.status}</span>
                          <span style={{ color: "#888", fontSize: "0.75rem" }}>
                            {new Date(log.createdAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                          </span>
                        </div>
                        {log.comment && <div style={{ color: "#475569", marginTop: "4px" }}>{log.comment}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE MODAL & STYLES */}
      {invoiceOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setInvoiceOrder(null)}
        >
          <div
            id="printable-invoice"
            style={{
              backgroundColor: "#FFF",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "750px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "3rem",
              color: "#1E1E1E",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Invoice Top Actions */}
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid #E5E7EB" }}>
              <span style={{ fontSize: "0.85rem", color: "#666" }}>Tax Invoice Preview</span>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={handlePrintInvoice} style={{ padding: "0.6rem 1.25rem", borderRadius: "10px", border: "none", backgroundColor: "#10B981", color: "#FFF", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Printer size={16} /> Print / Save PDF
                </button>
                <button onClick={() => setInvoiceOrder(null)} style={{ padding: "0.6rem 1rem", borderRadius: "10px", border: "1px solid #E5E7EB", background: "#FFF", cursor: "pointer" }}>
                  Close
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
              <div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: "900", margin: 0, letterSpacing: "-0.03em" }}>
                  POLACRAFT
                </h1>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#666" }}>
                  Fine Art Cinema Posters & Prints
                  <br />
                  GSTIN: 32AABCP1234F1ZP
                  <br />
                  support@polacraft.in
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "800", margin: 0, color: "#10B981" }}>TAX INVOICE</h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#333" }}>
                  Invoice #: <strong>INV-{invoiceOrder.orderNumber}</strong>
                  <br />
                  Date: {new Date(invoiceOrder.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>

            {/* Address Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem", padding: "1.25rem", backgroundColor: "#F9FAFB", borderRadius: "12px", fontSize: "0.85rem" }}>
              <div>
                <strong style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase" }}>Billed & Shipped To:</strong>
                <div style={{ marginTop: "0.4rem", fontWeight: 700 }}>{invoiceOrder.shippingName}</div>
                <div>{invoiceOrder.shippingStreet}</div>
                <div>{invoiceOrder.shippingCity}, {invoiceOrder.shippingState} - {invoiceOrder.shippingZip}</div>
                <div>Phone: {invoiceOrder.phone || "N/A"}</div>
                <div>Email: {invoiceOrder.email}</div>
              </div>

              <div>
                <strong style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase" }}>Payment Details:</strong>
                <div style={{ marginTop: "0.4rem" }}>Method: <strong>{invoiceOrder.paymentMethod || "WhatsApp UPI"}</strong></div>
                <div>UPI Ref #: <strong>{invoiceOrder.upiTransactionId || invoiceOrder.paymentReference || "N/A"}</strong></div>
                <div>Payment Status: <strong>{invoiceOrder.paymentStatus}</strong></div>
                <div>Fulfillment: <strong>{invoiceOrder.shippingStatus}</strong></div>
              </div>
            </div>

            {/* Invoice Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", marginBottom: "2rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #1E1E1E", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 0" }}>Item Description</th>
                  <th style={{ padding: "0.75rem 0" }}>Size & Frame</th>
                  <th style={{ padding: "0.75rem 0", textAlign: "center" }}>Qty</th>
                  <th style={{ padding: "0.75rem 0", textAlign: "right" }}>Rate</th>
                  <th style={{ padding: "0.75rem 0", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceOrder.items?.map((item: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #E5E7EB" }}>
                    <td style={{ padding: "0.85rem 0", fontWeight: 700 }}>{item.product?.title || "Poster Print"}</td>
                    <td style={{ padding: "0.85rem 0", color: "#666" }}>{item.size} • {item.frame}</td>
                    <td style={{ padding: "0.85rem 0", textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ padding: "0.85rem 0", textAlign: "right" }}>₹{item.price}</td>
                    <td style={{ padding: "0.85rem 0", textAlign: "right", fontWeight: 700 }}>₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "3rem" }}>
              <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal:</span>
                  <span>₹{invoiceOrder.subtotal}</span>
                </div>
                {invoiceOrder.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#10B981" }}>
                    <span>Discount:</span>
                    <span>-₹{invoiceOrder.discount}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Shipping Fee:</span>
                  <span>₹{invoiceOrder.shippingCost}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #1E1E1E", paddingBottom: "0.5rem", fontWeight: 800, fontSize: "1rem" }}>
                  <span>Total Amount:</span>
                  <span>₹{invoiceOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Sign Off */}
            <div style={{ textAlign: "center", paddingTop: "2rem", borderTop: "1px solid #E5E7EB", fontSize: "0.8rem", color: "#888" }}>
              Thank you for choosing Polacraft Art Prints!
              <br />
              This is a computer-generated tax invoice.
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
