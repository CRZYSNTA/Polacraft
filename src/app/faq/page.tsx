"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, HelpCircle, ShieldCheck, Truck, Package, RefreshCw, MessageSquare } from "lucide-react";

export default function WebsiteFaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openFaqIndex, setOpenFaqIndex] = useState<string | null>("0-0");

  const faqCategories = [
    {
      category: "Ordering & Payment",
      icon: Package,
      faqs: [
        {
          q: "How do I place an order on POLACRAFT?",
          a: "Browse our curated cinema collections or custom studio, select your desired poster size (A5, A4, A3) and frame style (Unframed, Matte Black, Studio White, Teak Wood), then tap 'Add to Bag' or 'Order via WhatsApp'."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major Indian Debit & Credit Cards, Net Banking, UPI (Google Pay, PhonePe, Paytm, BHIM), Razorpay secure checkout, and Cash on Delivery (COD)."
        },
        {
          q: "Can I order directly via WhatsApp?",
          a: "Yes! Every poster page and custom print studio includes an instant 'Order via WhatsApp' button for 1-click checkout and design assistance."
        }
      ]
    },
    {
      category: "Paper, Inks & Framing",
      icon: ShieldCheck,
      faqs: [
        {
          q: "What paper quality do you use?",
          a: "We print exclusively on museum-grade 250 GSM 100% Cotton Archival Fine Art Paper with an ultra-matte Giclée finish that eliminates glare and preserves vibrant cinema colors."
        },
        {
          q: "Are the poster inks fade-resistant?",
          a: "Yes! We use 12-color archival pigment inks guaranteed to remain color-fast and fade-resistant for over 100 years under indoor gallery lighting."
        },
        {
          q: "What frame options are available?",
          a: "We offer three handcrafted gallery frames: Sleek Matte Black, Minimal Studio White, and Teak Solid Wood, fitted with shatterproof acrylic glass and pre-installed wall mounting hardware."
        }
      ]
    },
    {
      category: "Custom Prints & Split Posters",
      icon: HelpCircle,
      faqs: [
        {
          q: "Can I print my own custom image or movie artwork?",
          a: "Absolutely! Visit our Custom Studio (/custom) page to upload your personal photos, artwork, or cinema posters for single or multi-panel split printing."
        },
        {
          q: "What image resolution is recommended for custom printing?",
          a: "We recommend uploading images with at least 2000×3000 pixels (300 DPI) in PNG, JPG, or WEBP formats. Our design team reviews every custom upload before printing."
        },
        {
          q: "What are Split Posters (3-Panel & 2x2 Grid)?",
          a: "Split Posters divide your artwork across 3 vertical panels or a 2x2 grid array (4 panels) for a dramatic gallery-style focal wall display."
        }
      ]
    },
    {
      category: "Shipping & Packaging",
      icon: Truck,
      faqs: [
        {
          q: "How long does shipping take across India?",
          a: "Orders are printed and hand-framed within 1–2 business days. Delivery across India takes 3–5 business days with real-time SMS and WhatsApp tracking updates."
        },
        {
          q: "How are unframed posters packaged?",
          a: "Unframed posters are encased in protective glassine paper and shipped in ultra-sturdy 3.5mm thick eco-tubes to prevent creases or transit damage."
        },
        {
          q: "Is shipping free?",
          a: "We offer FREE Express Shipping on all orders above ₹800! Standard shipping for orders below ₹800 is a flat rate of ₹60."
        }
      ]
    },
    {
      category: "Returns & Replacements",
      icon: RefreshCw,
      faqs: [
        {
          q: "What is your return & replacement policy?",
          a: "If your order arrives damaged or with any defect during transit, send us a photo within 7 days of delivery via WhatsApp (+91 94966 82919) or email, and we will send a 100% Free Replacement immediately!"
        },
        {
          q: "Can I cancel or modify my order after placing it?",
          a: "Yes, order modifications or cancellations are accepted within 12 hours of placing your order before custom printing begins."
        }
      ]
    }
  ];

  // Filter FAQs by active category and search query
  const filteredCategories = faqCategories.map((cat) => {
    if (activeCategory !== "All" && cat.category !== activeCategory) {
      return { ...cat, faqs: [] };
    }
    const matchingFaqs = cat.faqs.filter(
      (f) =>
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, faqs: matchingFaqs };
  }).filter((cat) => cat.faqs.length > 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", color: "#111111", paddingTop: "120px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* BACK LINK */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#111111", textDecoration: "none", fontSize: "0.9rem", fontWeight: 700, marginBottom: "2rem" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* PAGE HEADER */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666", fontWeight: "700" }}>
            Help & Knowledge Base
          </span>
          <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: "900", color: "#111111", margin: "0.4rem 0 0.75rem 0", letterSpacing: "-0.02em" }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: "#666666", fontSize: "1.05rem", maxWidth: "56ch", margin: "0 auto" }}>
            Everything you need to know about our fine art paper prints, custom split studio, framing options, and nationwide delivery.
          </p>

          {/* SEARCH INPUT */}
          <div style={{ position: "relative", maxWidth: "540px", margin: "2rem auto 0 auto" }}>
            <Search size={20} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any question (e.g. shipping, paper quality, frames)..."
              style={{
                width: "100%",
                padding: "1rem 1.25rem 1rem 3.2rem",
                borderRadius: "100px",
                border: "1.5px solid rgba(17,17,17,0.12)",
                backgroundColor: "#FFFFFF",
                fontSize: "0.98rem",
                outline: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
              }}
            />
          </div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "3.5rem" }}>
          {["All", "Ordering & Payment", "Paper, Inks & Framing", "Custom Prints & Split Posters", "Shipping & Packaging", "Returns & Replacements"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.65rem 1.2rem",
                borderRadius: "100px",
                border: "none",
                backgroundColor: activeCategory === cat ? "#111111" : "#FFFFFF",
                color: activeCategory === cat ? "#FFFFFF" : "#555555",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: activeCategory === cat ? "#111111" : "rgba(17,17,17,0.08)"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ ACCORDION LIST */}
        {filteredCategories.length === 0 ? (
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "4rem 2rem", textAlign: "center", border: "1px solid rgba(17,17,17,0.08)" }}>
            <HelpCircle size={48} style={{ color: "#9CA3AF", marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.25rem", color: "#111111", fontWeight: 800, margin: "0 0 0.5rem 0" }}>No Matching Questions Found</h3>
            <p style={{ color: "#666666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Have a custom question? Chat with our master printers on WhatsApp!</p>
            <a
              href="https://wa.me/919496682919"
              target="_blank"
              rel="noreferrer"
              style={{ padding: "0.8rem 1.5rem", borderRadius: "100px", backgroundColor: "#25D366", color: "#FFFFFF", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <MessageSquare size={18} /> Ask on WhatsApp
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {filteredCategories.map((group, groupIdx) => {
              const IconComp = group.icon;
              return (
                <div key={groupIdx}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "#EFECE6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconComp size={20} style={{ color: "#111111" }} />
                    </div>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#111111", margin: 0 }}>
                      {group.category}
                    </h2>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    {group.faqs.map((faq, faqIdx) => {
                      const faqKey = `${groupIdx}-${faqIdx}`;
                      const isOpen = openFaqIndex === faqKey;
                      return (
                        <div
                          key={faqIdx}
                          style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "18px",
                            border: "1px solid rgba(17,17,17,0.08)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                            overflow: "hidden",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? null : faqKey)}
                            style={{
                              width: "100%",
                              padding: "1.35rem 1.6rem",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: "transparent",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left"
                            }}
                          >
                            <span style={{ fontSize: "1.05rem", fontWeight: "800", color: "#111111", paddingRight: "1rem" }}>
                              {faq.q}
                            </span>
                            <span style={{ fontSize: "1.35rem", fontWeight: "700", color: "#111111", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease", flexShrink: 0 }}>
                              +
                            </span>
                          </button>

                          {isOpen && (
                            <div style={{ padding: "0 1.6rem 1.4rem 1.6rem", color: "#555555", fontSize: "0.95rem", lineHeight: "1.65", borderTop: "1px solid #F3F4F6" }}>
                              <p style={{ margin: "0.75rem 0 0 0" }}>{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BOTTOM WHATSAPP SUPPORT CTA */}
        <div style={{ marginTop: "5rem", backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "3rem 2rem", textAlign: "center", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#111111", margin: "0 0 0.5rem 0" }}>Still Have Questions?</h3>
          <p style={{ color: "#666666", fontSize: "0.95rem", maxWidth: "48ch", margin: "0 auto 1.75rem auto" }}>
            Our cinema design team is active daily on WhatsApp to assist with custom print sizing, high-resolution file checks, and framing advice!
          </p>
          <a
            href="https://wa.me/919496682919"
            target="_blank"
            rel="noreferrer"
            style={{ padding: "0.9rem 2rem", borderRadius: "100px", backgroundColor: "#25D366", color: "#FFFFFF", fontWeight: "800", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.6rem", boxShadow: "0 10px 25px rgba(37,211,102,0.2)" }}
          >
            <MessageSquare size={20} /> Chat Live on WhatsApp (+91 94966 82919)
          </a>
        </div>

      </div>
    </div>
  );
}
