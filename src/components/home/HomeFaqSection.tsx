'use client';

import React, { useState } from "react";
import { Package, User, Clock, Truck, ChevronDown, ChevronUp } from "lucide-react";

export default function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      icon: Package,
      q: "Is it possible to order posters in bulk for my outlet or any other setting?",
      a: "Yes! We cater to bulk orders, especially for businesses. Simply drop us a message on WhatsApp for special rates and assistance."
    },
    {
      icon: User,
      q: "how can I order my own design as a print?",
      a: "Upload your image directly on our Custom Studio (/custom) page or send us your artwork on WhatsApp for 1-click proofing and printing!"
    },
    {
      icon: Clock,
      q: "How many days taken for delivery?",
      a: "Custom prints and archival posters are printed & framed in 1–2 days and delivered in 3–5 business days across India."
    },
    {
      icon: Truck,
      q: "How can I check the status of my order?",
      a: "Sign in to your customer account dashboard or click the live tracking link sent to your SMS & WhatsApp upon shipment."
    }
  ];

  return (
    <section style={{ padding: "4rem 1rem", backgroundColor: "#FFFFFF" }}>
      <div className="container" style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        {/* SECTION TITLE WITH ACCENT */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-block", position: "relative" }}>
            <span style={{ position: "absolute", top: "5px", left: "-8px", width: "25px", height: "8px", backgroundColor: "#FACC15", opacity: 0.8, transform: "rotate(-10deg)" }} />
            <h2 style={{ fontSize: "2.25rem", fontWeight: "900", color: "#111111", margin: 0, letterSpacing: "0.02em" }}>
              FAQ?
            </h2>
          </div>
        </div>

        {/* ILLUSTRATION CARD */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
          <div style={{ width: "100%", maxWidth: "380px", height: "240px", backgroundColor: "#FAFAFA", borderRadius: "20px", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <svg width="180" height="180" viewBox="0 0 200 200" fill="none">
              {/* Question mark character illustration */}
              <circle cx="50" cy="60" r="8" stroke="#111" strokeWidth="2.5" fill="none" />
              <circle cx="80" cy="150" r="16" fill="#10B981" />
              <path d="M70 40 C70 10, 140 10, 140 50 C140 90, 95 80, 95 120" stroke="#111" strokeWidth="20" strokeLinecap="round" fill="none" />
              <circle cx="95" cy="140" r="5" fill="#111" />
              {/* Decorative shapes */}
              <rect x="140" y="70" width="20" height="12" rx="6" stroke="#10B981" strokeWidth="2.5" fill="none" transform="rotate(-25 140 70)" />
              <path d="M155 95 L165 105" stroke="#111" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* FAQ ACCORDION LIST */}
        <div style={{ borderTop: "1px solid #E5E7EB" }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const IconComp = faq.icon;
            return (
              <div key={index} style={{ borderBottom: "1px solid #E5E7EB" }}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: "100%",
                    padding: "1.25rem 0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", paddingRight: "1rem" }}>
                    <IconComp size={20} style={{ color: "#111111", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.95rem", fontWeight: "600", color: "#111111", lineHeight: "1.35" }}>
                      {faq.q}
                    </span>
                  </div>
                  {isOpen ? <ChevronUp size={18} style={{ color: "#111111", flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: "#111111", flexShrink: 0 }} />}
                </button>

                {isOpen && (
                  <div style={{ padding: "0 0.5rem 1.25rem 2.5rem", color: "#555555", fontSize: "0.9rem", lineHeight: "1.6" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
