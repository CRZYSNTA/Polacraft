'use client';

import React, { useState } from "react";
import { Mail, MapPin, Phone, HelpCircle, Plus, Minus } from "lucide-react";

export default function ContactPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "What paper specs do you use for posters?",
      a: "Every print is pressed on 250 GSM heavy-weight, museum-quality cotton archival paper. The paper is acid-free and resists yellowing or fading for over 80 years when kept behind standard glass."
    },
    {
      q: "How are the oak frames made?",
      a: "Our frames are handcrafted by local wood craftsmen from solid oak and pinewood. They have a depth of 22mm, border widths of 14-16mm, and are fitted with high-transparency plexiglass sheets to shield the artwork."
    },
    {
      q: "How long does shipping take within India?",
      a: "Orders are printed and packaged within 24-48 hours. Shipping takes 3-5 business days depending on your location. You will receive a tracking link via email as soon as the print ships."
    },
    {
      q: "What if my art print arrives damaged?",
      a: "We offer a 100% damage-free transit guarantee. If your shipping tube is bent or the frame glass is cracked upon arrival, email us a photo within 48 hours and we will ship a replacement immediately."
    }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! Polacraft Studio will get back to you within 24 hours.");
    e.target.reset();
  };

  return (
    <div style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      <div className="container">
        
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "6rem" }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", fontWeight: "600" }}>
            Get in Touch
          </span>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: "800", letterSpacing: "-0.04em", marginTop: "1rem", lineHeight: "1.1" }}>
            Contact the Studio.
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "55ch", margin: "1.5rem auto 0 auto", lineHeight: "1.7" }}>
            Have questions about frames, custom requests, or shipping? Drop us a line.
          </p>
        </div>

        {/* SPLIT LAYOUT */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "5rem",
            alignItems: "start",
            marginBottom: "8rem"
          }}
          className="contact-split"
        >
          {/* LEFT: FORM */}
          <form 
            onSubmit={handleFormSubmit}
            className="glass-card"
            style={{
              padding: "3.5rem 3rem",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}
          >
            <h2 style={{ fontSize: "1.85rem", fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              Send a Message
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>Your Name</label>
              <input 
                type="text" 
                required 
                placeholder="Anoop Menon" 
                style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="anoop@gmail.com" 
                style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>Subject</label>
              <input 
                type="text" 
                required 
                placeholder="Custom A2 print query" 
                style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)" }}>Message Details</label>
              <textarea 
                required 
                rows={5}
                placeholder="Write your query here..." 
                style={{ padding: "0.8rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "12px", fontSize: "0.9rem", resize: "none", fontFamily: "inherit" }}
              />
            </div>

            <button type="submit" className="btn-magnetic btn-primary" style={{ padding: "1rem", fontSize: "0.95rem", borderRadius: "15px", marginTop: "0.5rem" }}>
              Submit Query
            </button>
          </form>

          {/* RIGHT: CONTACT STATS & STUDIO ADDRESS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Studio Locations</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                Our creative workspace is located in Panampilly Nagar, Kochi, where we design poster concepts and test print details.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", fontSize: "0.95rem" }}>
                  <MapPin size={18} style={{ marginTop: "4px", color: "var(--text-muted)" }} />
                  <div>
                    <strong>Polacraft Studio</strong><br />
                    2nd Floor, Panampilly Nagar Avenue<br />
                    Kochi, Kerala - 682036
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.95rem" }}>
                  <Phone size={18} style={{ color: "var(--text-muted)" }} />
                  <span>+91 98456 78910</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.95rem" }}>
                  <Mail size={18} style={{ color: "var(--text-muted)" }} />
                  <span>studio@polacraft.com</span>
                </div>
              </div>
            </div>

            {/* QUICK FAQS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "2.5rem" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <HelpCircle size={20} /> Studio FAQ
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div 
                      key={idx}
                      style={{
                        borderBottom: "1px solid rgba(17,17,17,0.05)",
                        paddingBottom: "1rem"
                      }}
                    >
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.95rem",
                          textAlign: "left",
                          color: "var(--text-dark)"
                        }}
                      >
                        {faq.q}
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                      
                      {isOpen && (
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem", lineHeight: "1.6" }}>
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .contact-split {
            grid-template-columns: 1fr !important;
            gap: 4rem !important;
          }
        }
      `}</style>
    </div>
  );
}
