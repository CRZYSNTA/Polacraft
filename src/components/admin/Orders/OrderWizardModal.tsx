"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  X,
  Sparkles,
  Search,
  User,
  MapPin,
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  DollarSign,
  Tag as TagIcon,
  MessageSquare,
  FileText,
  AlertCircle,
  Truck,
  Layers,
} from "lucide-react";
import {
  createOrderOrQuoteAction,
  searchProductsForOrderAction,
  lookupCustomerByPhoneAction,
  OrderItemInput,
  CreateOrderOrQuoteInput,
} from "@/features/admin/orderEngineActions";
import { calculateOrderProfitMetrics } from "@/lib/profitEngine";

interface OrderWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderWizardModal({ isOpen, onClose, onSuccess }: OrderWizardModalProps) {
  const [activeTab, setActiveTab] = useState<"AI_PARSER" | "CUSTOMER" | "ITEMS" | "PAYMENT" | "REVIEW">("CUSTOMER");
  const [isPending, startTransition] = useTransition();

  // 1. Order Type & Source State
  const [orderType, setOrderType] = useState<"ORDER" | "QUOTE" | "DRAFT">("ORDER");
  const [orderSource, setOrderSource] = useState<"WHATSAPP" | "INSTAGRAM" | "PHONE" | "DIRECT_SALE" | "WEBSITE">("WHATSAPP");

  // 2. Customer & Address State
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [customerInfoBadge, setCustomerInfoBadge] = useState<string | null>(null);

  // 3. Product Search & Selected Items State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [selectedItems, setSelectedItems] = useState<OrderItemInput[]>([]);

  // 4. Custom Item Creation State
  const [customTitle, setCustomTitle] = useState("");
  const [customPrice, setCustomPrice] = useState<number>(300);
  const [customQty, setCustomQty] = useState<number>(1);
  const [customSize, setCustomSize] = useState<string>("A4");
  const [customFrame, setCustomFrame] = useState<string>("UNFRAMED");

  // 5. Shipping & Discount & Payment State
  const [shippingCost, setShippingCost] = useState<number>(60);
  const [shippingType, setShippingType] = useState<string>("Standard");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"FIXED" | "PERCENTAGE">("FIXED");
  const [amountPaidNow, setAmountPaidNow] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<"UPI" | "CASH" | "BANK_TRANSFER" | "CREDIT_CARD" | "DEBIT_CARD" | "COD">("UPI");
  const [transactionRef, setTransactionRef] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // 6. AI WhatsApp Parser Input State
  const [rawChatText, setRawChatText] = useState("");
  const [isParsingChat, setIsParsingChat] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleProductSearch("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Phone Lookup Trigger
  const handlePhoneLookup = async (inputPhone: string) => {
    setPhone(inputPhone);
    const clean = inputPhone.replace(/\D/g, "");
    if (clean.length >= 10) {
      setIsSearchingCustomer(true);
      const res = await lookupCustomerByPhoneAction(clean);
      setIsSearchingCustomer(false);

      if (res.success && res.customer) {
        setCustomerName(res.customer.name || "");
        setEmail(res.customer.email || `${clean}@polacraft-customer.in`);
        setStreet(res.customer.street || "");
        setCity(res.customer.city || "");
        setState(res.customer.state || "");
        setZip(res.customer.zip || "");
        setCustomerInfoBadge(`Found existing customer (${res.customer.totalOrders} previous orders, LTV: ₹${res.customer.lifetimeValue})`);
      } else {
        setCustomerInfoBadge(null);
        if (!email) setEmail(`${clean}@polacraft-customer.in`);
      }
    }
  };

  // Product Search Trigger
  const handleProductSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearchingProducts(true);
    const res = await searchProductsForOrderAction(query);
    setIsSearchingProducts(false);
    if (res.success) {
      setSearchResults(res.products || []);
    }
  };

  // Add Catalog Product to Item List
  const handleAddCatalogItem = (product: any) => {
    const existingIndex = selectedItems.findIndex((i) => i.productId === product.id && i.size === "A4" && i.frame === "UNFRAMED");
    if (existingIndex > -1) {
      const updated = [...selectedItems];
      updated[existingIndex].quantity += 1;
      setSelectedItems(updated);
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          productId: product.id,
          isCustomItem: false,
          title: product.title,
          description: product.film ? `${product.film} (${product.year})` : undefined,
          size: "A4",
          frame: "UNFRAMED",
          sku: product.slug,
          productSlug: product.slug,
          thumbnailUrl: product.images?.[0]?.url || undefined,
          originalPrice: product.price,
          unitPrice: product.price,
          discount: 0,
          quantity: 1,
        },
      ]);
    }
  };

  // Add Custom Item
  const handleAddCustomItem = () => {
    if (!customTitle.trim()) return;
    setSelectedItems((prev) => [
      ...prev,
      {
        isCustomItem: true,
        title: customTitle.trim(),
        description: "Custom Non-Catalog Art Print",
        size: customSize,
        frame: customFrame,
        originalPrice: customPrice,
        unitPrice: customPrice,
        discount: 0,
        quantity: customQty,
      },
    ]);
    setCustomTitle("");
    setCustomPrice(300);
    setCustomQty(1);
  };

  // Item Updates
  const updateItem = (index: number, field: string, value: any) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Calculate Totals & Profit Metrics
  const subtotal = selectedItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const actualDiscount = discountType === "PERCENTAGE" ? (subtotal * discountAmount) / 100 : discountAmount;
  const grandTotal = Math.max(0, subtotal + shippingCost - actualDiscount);

  const profitMetrics = calculateOrderProfitMetrics(
    selectedItems,
    shippingCost,
    shippingType,
    actualDiscount
  );

  // AI Chat Parsing Action
  const handleParseWhatsAppChat = async () => {
    if (!rawChatText.trim()) return;
    setIsParsingChat(true);
    try {
      const res = await fetch("/api/admin/ai/parse-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawChatText }),
      });
      if (res.ok) {
        const { parsed } = await res.json();
        if (parsed) {
          if (parsed.customerName) setCustomerName(parsed.customerName);
          if (parsed.phone) handlePhoneLookup(parsed.phone);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.street) setStreet(parsed.street);
          if (parsed.city) setCity(parsed.city);
          if (parsed.state) setState(parsed.state);
          if (parsed.zip) setZip(parsed.zip);
          if (parsed.customNotes) setNotes(parsed.customNotes);

          // Add extracted items
          if (Array.isArray(parsed.items) && parsed.items.length > 0) {
            for (const item of parsed.items) {
              const pRes = await searchProductsForOrderAction(item.productTitleQuery);
              if (pRes.success && pRes.products?.length) {
                const match = pRes.products[0];
                setSelectedItems((prev) => [
                  ...prev,
                  {
                    productId: match.id,
                    isCustomItem: false,
                    title: match.title,
                    description: match.film,
                    size: item.size || "A4",
                    frame: item.frame || "UNFRAMED",
                    sku: match.slug,
                    productSlug: match.slug,
                    thumbnailUrl: match.images?.[0]?.url,
                    originalPrice: match.price,
                    unitPrice: match.price,
                    discount: 0,
                    quantity: item.quantity || 1,
                  },
                ]);
              } else {
                // Add as custom item if not in DB
                setSelectedItems((prev) => [
                  ...prev,
                  {
                    isCustomItem: true,
                    title: item.productTitleQuery,
                    description: "Extracted from WhatsApp Chat",
                    size: item.size || "A4",
                    frame: item.frame || "UNFRAMED",
                    originalPrice: 350,
                    unitPrice: 350,
                    discount: 0,
                    quantity: item.quantity || 1,
                  },
                ]);
              }
            }
          }
          setActiveTab("ITEMS");
        }
      }
    } catch (e: any) {
      alert("Parsing Error: " + e.message);
    } finally {
      setIsParsingChat(false);
    }
  };

  // Submit Order / Quote
  const handleSubmit = () => {
    if (!customerName || !phone) {
      alert("Customer Name and Phone Number are required.");
      setActiveTab("CUSTOMER");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Please add at least one product item.");
      setActiveTab("ITEMS");
      return;
    }

    startTransition(async () => {
      const payload: CreateOrderOrQuoteInput = {
        orderType,
        orderSource,
        customerName,
        phone,
        email: email || `${phone.replace(/\D/g, "")}@polacraft-customer.in`,
        shippingStreet: street || "N/A Address",
        shippingCity: city || "Kochi",
        shippingState: state || "Kerala",
        shippingZip: zip || "682001",
        shippingCountry: "India",
        items: selectedItems,
        shippingCost,
        shippingType,
        discountAmount: actualDiscount,
        discountType,
        paymentMethod: paymentMode,
        paymentMode,
        amountPaidNow,
        transactionRef,
        notes,
        tags: tags as any,
      };

      const res = await createOrderOrQuoteAction(payload);
      if (res.success && res.order) {
        alert(`${orderType === "QUOTE" ? "Quotation" : "Order"} #${res.order.orderNumber} created successfully!`);
        onSuccess();
        onClose();
      } else {
        alert("Creation Failed: " + (res.error || "Unknown error"));
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
          maxWidth: "1020px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: "1.25rem 1.75rem", backgroundColor: "#0F172A", color: "#FFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ backgroundColor: "#10B981", padding: "0.5rem", borderRadius: "12px", color: "#FFF", display: "flex" }}>
              <Plus size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900" }}>
                Create New {orderType === "QUOTE" ? "Quotation (PRO-FORMA)" : orderType === "DRAFT" ? "Draft Order" : "Manual Order"}
              </h2>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#94A3B8" }}>
                WhatsApp, Instagram & Off-Website Sales Ingestion Engine
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as any)}
              style={{ padding: "0.45rem 0.85rem", borderRadius: "10px", backgroundColor: "#1E293B", color: "#FFF", border: "1px solid #334155", fontSize: "0.85rem", fontWeight: 700 }}
            >
              <option value="ORDER">OFFICIAL ORDER</option>
              <option value="QUOTE">QUOTATION (QUOTE)</option>
              <option value="DRAFT">SAVED DRAFT</option>
            </select>

            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Wizard Step Navigation Bar */}
        <div style={{ display: "flex", backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "0 1.5rem" }}>
          {[
            { id: "AI_PARSER", label: "✨ AI WA Parser", icon: Sparkles },
            { id: "CUSTOMER", label: "1. Customer & Address", icon: User },
            { id: "ITEMS", label: `2. Items (${selectedItems.length})`, icon: ShoppingBag },
            { id: "PAYMENT", label: "3. Shipping & Payment", icon: DollarSign },
            { id: "REVIEW", label: `4. Review & Submit (₹${grandTotal})`, icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: "0.9rem 1.25rem",
                  border: "none",
                  backgroundColor: "transparent",
                  borderBottom: isActive ? "3px solid #10B981" : "3px solid transparent",
                  color: isActive ? "#0F172A" : "#64748B",
                  fontWeight: isActive ? 800 : 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Icon size={16} style={{ color: isActive ? "#10B981" : "#94A3B8" }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flexGrow: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* TAB: AI PARSER */}
          {activeTab === "AI_PARSER" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", padding: "1rem", borderRadius: "12px", fontSize: "0.85rem", color: "#065F46" }}>
                <strong>AI WhatsApp Chat Parser:</strong> Paste raw customer WhatsApp text below. Gemini AI automatically extracts customer phone, name, address, and poster titles with sizes.
              </div>

              <textarea
                rows={7}
                value={rawChatText}
                onChange={(e) => setRawChatText(e.target.value)}
                placeholder={`Example WhatsApp Message:
"Hi, I need two A4 Lucifer posters and one A3 Premam poster.
Deliver to: Gowtham, MG Road, Kochi 682001. Phone: 9895012345"`}
                style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "0.9rem", fontFamily: "sans-serif" }}
              />

              <button
                type="button"
                onClick={handleParseWhatsAppChat}
                disabled={isParsingChat || !rawChatText.trim()}
                style={{
                  padding: "0.85rem",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#10B981",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: isParsingChat ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {isParsingChat ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                Parse & Auto-Fill Order Wizard
              </button>
            </div>
          )}

          {/* TAB: CUSTOMER */}
          {activeTab === "CUSTOMER" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Order Source *</label>
                  <select value={orderSource} onChange={(e) => setOrderSource(e.target.value as any)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}>
                    <option value="WHATSAPP">WhatsApp Order</option>
                    <option value="INSTAGRAM">Instagram DM Order</option>
                    <option value="PHONE">Phone Call Order</option>
                    <option value="DIRECT_SALE">Direct In-Person Sale</option>
                    <option value="WEBSITE">Manual Website Entry</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Phone Number (Triggers Auto-Lookup) *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => handlePhoneLookup(e.target.value)}
                    placeholder="e.g. 9895012345"
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                  />
                  {customerInfoBadge && (
                    <div style={{ fontSize: "0.75rem", color: "#047857", fontWeight: 700, marginTop: "4px" }}>
                      ✓ {customerInfoBadge}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Customer Full Name *</label>
                  <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Gowtham Das" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }} />
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@example.com" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }} />
                </div>
              </div>

              <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "1rem" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <MapPin size={16} /> Shipping Destination Address
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "1rem" }}>
                  <input type="text" placeholder="Street Address / House / Landmark" value={street} onChange={(e) => setStreet(e.target.value)} style={{ padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
                  <input type="text" placeholder="City (e.g. Kochi)" value={city} onChange={(e) => setCity(e.target.value)} style={{ padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
                  <input type="text" placeholder="State (e.g. Kerala)" value={state} onChange={(e) => setState(e.target.value)} style={{ padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
                  <input type="text" placeholder="Pincode (e.g. 682001)" value={zip} onChange={(e) => setZip(e.target.value)} style={{ padding: "0.75rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("ITEMS")}
                  style={{ padding: "0.75rem 1.5rem", borderRadius: "10px", backgroundColor: "#0F172A", color: "#FFF", fontWeight: 800, border: "none", cursor: "pointer" }}
                >
                  Next: Add Products →
                </button>
              </div>
            </div>
          )}

          {/* TAB: ITEMS */}
          {activeTab === "ITEMS" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Product Live Search Bar */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Search Polacraft Catalog (Title, Movie, Actor, Collection, SKU)</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    placeholder="Search e.g. Lucifer, Mohanlal, Deavasuram..."
                    style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.9rem" }}
                  />
                  <Search size={18} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                </div>

                {/* Live Search Quick Results grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.6rem", marginTop: "0.75rem", maxHeight: "150px", overflowY: "auto" }}>
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleAddCatalogItem(prod)}
                      style={{
                        padding: "0.6rem",
                        backgroundColor: "#F8FAFC",
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      <div style={{ fontWeight: 700, flexGrow: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {prod.title}
                      </div>
                      <div style={{ color: "#10B981", fontWeight: 800 }}>₹{prod.price}</div>
                      <Plus size={14} style={{ color: "#0F172A" }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Custom Non-Catalog Item Section */}
              <div style={{ backgroundColor: "#FFFBEB", border: "1px dashed #FCD34D", padding: "1rem", borderRadius: "12px" }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: 800, color: "#92400E" }}>
                  + Add Custom / Non-Catalog Item
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "0.5rem", alignItems: "center" }}>
                  <input type="text" placeholder="Item Title (e.g. Custom Wood Frame)" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "0.85rem" }} />
                  <input type="number" placeholder="Price" value={customPrice} onChange={(e) => setCustomPrice(Number(e.target.value))} style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "0.85rem" }} />
                  <select value={customSize} onChange={(e) => setCustomSize(e.target.value)} style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "0.85rem" }}>
                    <option value="A5">A5</option>
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                    <option value="A2">A2</option>
                    <option value="CANVAS">Canvas</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                  <input type="number" placeholder="Qty" value={customQty} onChange={(e) => setCustomQty(Number(e.target.value))} style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "0.85rem" }} />
                  <button type="button" onClick={handleAddCustomItem} style={{ padding: "0.5rem 1rem", backgroundColor: "#D97706", color: "#FFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.8rem" }}>
                    Add Custom
                  </button>
                </div>
              </div>

              {/* Selected Order Items List */}
              <div>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: 800, color: "#0F172A" }}>Selected Items ({selectedItems.length})</h4>
                {selectedItems.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", backgroundColor: "#F8FAFC", borderRadius: "12px", color: "#94A3B8", fontSize: "0.85rem" }}>
                    No items added yet. Search catalog above or add a custom item.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {selectedItems.map((item, idx) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: "0.5rem", alignItems: "center", padding: "0.75rem", backgroundColor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}>
                        <div>
                          <strong>{item.title}</strong>
                          {item.description && <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{item.description}</div>}
                        </div>
                        <div>
                          <select value={item.size} onChange={(e) => updateItem(idx, "size", e.target.value)} style={{ padding: "0.35rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.8rem" }}>
                            <option value="A5">A5 (14.8 x 21cm)</option>
                            <option value="A4">A4 (21 x 29.7cm)</option>
                            <option value="A3">A3 (29.7 x 42cm)</option>
                            <option value="A2">A2 (42 x 59.4cm)</option>
                            <option value="CANVAS">Canvas</option>
                          </select>
                        </div>
                        <div>
                          <select value={item.frame} onChange={(e) => updateItem(idx, "frame", e.target.value)} style={{ padding: "0.35rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.8rem" }}>
                            <option value="UNFRAMED">Unframed</option>
                            <option value="BLACK_FRAME">Black Frame</option>
                            <option value="WOOD_FRAME">Teak Frame</option>
                          </select>
                        </div>
                        <div>
                          <input type="number" value={item.unitPrice} onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))} style={{ width: "80px", padding: "0.35rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.8rem" }} />
                        </div>
                        <div>
                          <input type="number" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))} style={{ width: "60px", padding: "0.35rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.8rem" }} />
                        </div>
                        <button type="button" onClick={() => removeItem(idx)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Profit & Expense Calculation Card */}
              {selectedItems.length > 0 && (
                <div style={{ padding: "1rem 1.25rem", borderRadius: "14px", backgroundColor: profitMetrics.netProfit >= 0 ? "#F0FDF4" : "#FEF2F2", border: `1.5px solid ${profitMetrics.netProfit >= 0 ? "#BBF7D0" : "#FCA5A5"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: profitMetrics.netProfit >= 0 ? "#166534" : "#991B1B" }}>
                      📊 Estimated Expense & Profit Analysis
                    </div>
                    <div style={{ fontSize: "0.82rem", marginTop: "2px", color: "#334155" }}>
                      Total Expense: <strong>₹{profitMetrics.totalExpense}</strong> (Paper/Ink: ₹{profitMetrics.printingCost} + Frame: ₹{profitMetrics.frameCost} + Courier: ₹{profitMetrics.shippingExpense})
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 900, color: profitMetrics.netProfit >= 0 ? "#15803D" : "#DC2626" }}>
                      {profitMetrics.netProfit >= 0 ? "+" : ""}₹{profitMetrics.netProfit} Net Profit
                    </div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: profitMetrics.profitMargin >= 40 ? "#166534" : profitMetrics.profitMargin >= 20 ? "#D97706" : "#DC2626" }}>
                      Profit Margin: {profitMetrics.profitMargin}%
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "1rem" }}>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0F172A" }}>
                  Items Subtotal: ₹{subtotal}
                </div>
                <button type="button" onClick={() => setActiveTab("PAYMENT")} style={{ padding: "0.75rem 1.5rem", borderRadius: "10px", backgroundColor: "#0F172A", color: "#FFF", fontWeight: 800, border: "none", cursor: "pointer" }}>
                  Next: Shipping & Payment →
                </button>
              </div>
            </div>
          )}

          {/* TAB: PAYMENT & SHIPPING */}
          {activeTab === "PAYMENT" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                {/* Left: Shipping & Discount */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#F8FAFC", padding: "1.25rem", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
                  <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Truck size={16} /> Shipping Options & Charges
                  </h4>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Shipping Method</label>
                      <select value={shippingType} onChange={(e) => setShippingType(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}>
                        <option value="Standard">Standard Courier (₹60)</option>
                        <option value="Express">Express Air (₹120)</option>
                        <option value="Pickup">Store Pickup (Free)</option>
                        <option value="Custom">Custom Shipping</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Shipping Fee (₹)</label>
                      <input type="number" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "0.85rem" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Order-Level Discount</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.25rem" }}>
                      <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)} style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}>
                        <option value="FIXED">Fixed Amount (₹)</option>
                        <option value="PERCENTAGE">Percentage (%)</option>
                      </select>
                      <input type="number" value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} placeholder="Discount value" style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
                    </div>
                  </div>
                </div>

                {/* Right: Payment Ledger Entry */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#ECFDF5", padding: "1.25rem", borderRadius: "16px", border: "1px solid #A7F3D0" }}>
                  <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "#065F46", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <DollarSign size={16} /> Initial Payment Recording
                  </h4>

                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#047857" }}>Payment Mode</label>
                    <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as any)} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #A7F3D0", fontSize: "0.85rem" }}>
                      <option value="UPI">Google Pay / PhonePe / UPI</option>
                      <option value="CASH">Cash Payment</option>
                      <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                      <option value="CREDIT_CARD">Credit / Debit Card</option>
                      <option value="COD">Cash on Delivery (COD)</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#047857" }}>Amount Paid Now (₹)</label>
                      <input type="number" value={amountPaidNow} onChange={(e) => setAmountPaidNow(Number(e.target.value))} placeholder="₹ 0.00" style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #A7F3D0", fontSize: "0.85rem" }} />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#047857" }}>Transaction Ref / UPI Txn ID</label>
                      <input type="text" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} placeholder="T2407..." style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #A7F3D0", fontSize: "0.85rem" }} />
                    </div>
                  </div>

                  <div style={{ fontSize: "0.75rem", color: "#065F46", fontWeight: 700, backgroundColor: "#FFF", padding: "0.5rem", borderRadius: "6px" }}>
                    Grand Total: ₹{grandTotal} • Remaining Balance: ₹{Math.max(0, grandTotal - amountPaidNow)}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Internal Order & CRM Notes</label>
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Customer requested delayed delivery to Monday..." style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" onClick={() => setActiveTab("REVIEW")} style={{ padding: "0.75rem 1.5rem", borderRadius: "10px", backgroundColor: "#10B981", color: "#FFF", fontWeight: 800, border: "none", cursor: "pointer" }}>
                  Review & Finalize Order →
                </button>
              </div>
            </div>
          )}

          {/* TAB: REVIEW */}
          {activeTab === "REVIEW" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ backgroundColor: "#F8FAFC", padding: "1.25rem", borderRadius: "16px", border: "1px solid #E2E8F0", fontSize: "0.85rem" }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 900, color: "#0F172A" }}>
                  {orderType === "QUOTE" ? "Quotation Summary" : "Official Order Manifest"} ({orderSource})
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <strong>Customer:</strong> {customerName} ({phone})
                    <br />
                    <strong>Email:</strong> {email}
                    <br />
                    <strong>Address:</strong> {street}, {city}, {state} - {zip}
                  </div>
                  <div>
                    <strong>Type:</strong> {orderType}
                    <br />
                    <strong>Payment Mode:</strong> {paymentMode} (Paid ₹{amountPaidNow} of ₹{grandTotal})
                    <br />
                    <strong>Stock Reservation:</strong> {amountPaidNow >= grandTotal ? "Immediate Inventory Reserve" : "Pending Payment Approval"}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: 800 }}>Items ({selectedItems.length})</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {selectedItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0.85rem", backgroundColor: "#FFF", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "0.85rem" }}>
                      <span><strong>{item.title}</strong> ({item.size} • {item.frame}) x {item.quantity}</span>
                      <strong>₹{item.unitPrice * item.quantity}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #0F172A", paddingTop: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Payable:</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "#0F172A" }}>₹{grandTotal}</div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  style={{
                    padding: "0.85rem 2rem",
                    borderRadius: "12px",
                    backgroundColor: "#10B981",
                    color: "#FFF",
                    fontWeight: "900",
                    fontSize: "1rem",
                    border: "none",
                    cursor: isPending ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {isPending ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {orderType === "QUOTE" ? "Issue Quotation" : "Create Official Order"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
