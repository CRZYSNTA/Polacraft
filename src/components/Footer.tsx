import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer 
      style={{
        backgroundColor: "var(--accent-charcoal)",
        color: "#FAFAF8",
        padding: "8rem 0 4rem 0",
        position: "relative",
        overflow: "hidden",
        marginTop: "auto"
      }}
    >
      <div className="container">
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
            gap: "4rem",
            marginBottom: "6rem"
          }}
          className="footer-grid"
        >
          {/* Brand Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.5rem",
                fontWeight: "800",
                letterSpacing: "-0.04em"
              }}
            >
              POLACRAFT<span style={{ color: "#EFECE6", fontWeight: "300" }}>STUDIO</span>
            </h2>
            <p 
              style={{
                color: "rgba(250, 250, 248, 0.6)",
                maxWidth: "32ch",
                fontSize: "0.95rem",
                lineHeight: "1.6"
              }}
            >
              Malayalam Cinema. Reimagined as Wall Art. Handcrafted prints celebrating Kerala's rich film heritage.
            </p>
          </div>

          {/* Links: Gallery */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(250,250,248,0.4)" }}>
              Gallery
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.95rem" }}>
              <li>
                <Link href="/shop" className="footer-link" style={{ color: "rgba(250,250,248,0.7)" }}>
                  Shop All Posters
                </Link>
              </li>
              <li>
                <Link href="/shop" className="footer-link" style={{ color: "rgba(250,250,248,0.7)" }}>
                  Limited Editions
                </Link>
              </li>
              <li>
                <Link href="/shop" className="footer-link" style={{ color: "rgba(250,250,248,0.7)" }}>
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: About */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(250,250,248,0.4)" }}>
              Studio
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.95rem" }}>
              <li>
                <Link href="/about" className="footer-link" style={{ color: "rgba(250,250,248,0.7)" }}>
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/journal" className="footer-link" style={{ color: "rgba(250,250,248,0.7)" }}>
                  Editorial Journal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link" style={{ color: "rgba(250,250,248,0.7)" }}>
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Connect */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(250,250,248,0.4)" }}>
              Connect
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.95rem" }}>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link-social" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "rgba(250,250,248,0.7)" }}>
                  Instagram <ArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="footer-link-social" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "rgba(250,250,248,0.7)" }}>
                  Behance <ArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-link-social" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "rgba(250,250,248,0.7)" }}>
                  Pinterest <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(250,250,248,0.1)", marginBottom: "3rem" }} />

        {/* Bottom copyright */}
        <div 
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.85rem",
            color: "rgba(250, 250, 248, 0.45)"
          }}
          className="footer-bottom"
        >
          <p>© {new Date().getFullYear()} Polacraft. All rights reserved.</p>
          <div style={{ display: "flex", gap: "2.5rem" }}>
            <Link href="#privacy" className="footer-link">Privacy Policy</Link>
            <Link href="#terms" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Embedded CSS for responsive columns */}
      <style>{`
        .footer-link, .footer-link-social {
          transition: var(--transition-fast);
          text-align: left;
        }
        .footer-link:hover, .footer-link-social:hover {
          color: #FAFAF8 !important;
          transform: translateX(4px);
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 3rem !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            gap: 1.5rem !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
};
export default Footer;
