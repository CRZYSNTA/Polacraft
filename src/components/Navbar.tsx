'use client';

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppContext } from "../features/cart/AppContext";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";

export const Navbar = () => {
  const { cartItemCount, wishlist, setCartOpen } = useContext(AppContext);
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className="glass-nav"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: isScrolled ? "70px" : "90px",
        display: "flex",
        alignItems: "center",
        zIndex: 1000,
        transition: "var(--transition-smooth)",
        backgroundColor: isScrolled ? "var(--glass-bg)" : "transparent",
        borderBottom: isScrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none"
      }}
    >
      <div 
        className="container"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {/* LOGO */}
        <Link 
          href="/"
          onClick={handleLinkClick}
          className="clickable"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            fontWeight: "800",
            letterSpacing: "-0.04em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem"
          }}
        >
          <span style={{ color: "var(--text-dark)" }}>POLA</span>
          <span style={{ color: "var(--text-muted)", fontWeight: "300" }}>CRAFT</span>
          <span style={{ 
            width: "6px", 
            height: "6px", 
            backgroundColor: "var(--text-dark)", 
            borderRadius: "50%", 
            marginLeft: "2px",
            display: "inline-block"
          }} />
        </Link>

        {/* NAVIGATION LINKS - DESKTOP */}
        <div 
          style={{
            display: "flex",
            gap: "2.5rem",
            alignItems: "center"
          }}
          className="desktop-only"
        >
          {[
            { path: "/shop", label: "Shop" },
            { path: "/custom", label: "Custom Print" },
            { path: "/about", label: "About" },
            { path: "/journal", label: "Journal" },
            { path: "/contact", label: "Contact" },
            { path: "/profile", label: "Account" }
          ].map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="underline-hover"
                style={{
                  fontWeight: isActive ? "600" : "400",
                  color: isActive ? "var(--text-dark)" : "var(--text-muted)",
                  transition: "var(--transition-fast)",
                  cursor: "pointer"
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* UTILITY ACTIONS */}
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem"
          }}
        >
          {/* Wishlist Icon link to Shop */}
          <Link 
            href="/shop" 
            style={{ cursor: "pointer", color: "var(--text-dark)", padding: "4px", position: "relative" }}
            aria-label="View Wishlist"
          >
            <Heart size={18} fill={wishlist.length > 0 ? "var(--text-dark)" : "none"} />
            {wishlist.length > 0 && (
              <span 
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  backgroundColor: "var(--text-dark)",
                  color: "#FFFFFF",
                  fontSize: "0.6rem",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold"
                }}
              >
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Bag */}
          <button 
            onClick={() => setCartOpen(true)}
            style={{ cursor: "pointer", color: "var(--text-dark)", padding: "4px", position: "relative" }}
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag size={18} />
            {cartItemCount > 0 && (
              <span 
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  backgroundColor: "var(--accent-charcoal)",
                  color: "#FFFFFF",
                  fontSize: "0.6rem",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold"
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ cursor: "pointer", color: "var(--text-dark)", padding: "4px" }}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            backgroundColor: "#FAFAF8",
            borderBottom: "1px solid var(--border-color)",
            padding: "2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            zIndex: 999,
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
          }}
        >
          {[
            { path: "/shop", label: "Shop Posters" },
            { path: "/custom", label: "Upload Custom Design" },
            { path: "/about", label: "Our Story" },
            { path: "/journal", label: "Editorial Journal" },
            { path: "/contact", label: "Contact Studio" },
            { path: "/profile", label: "Collector Account" }
          ].map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={handleLinkClick}
              style={{
                textAlign: "left",
                fontSize: "1.25rem",
                fontWeight: pathname === item.path ? "600" : "400",
                color: pathname === item.path ? "var(--text-dark)" : "var(--text-muted)"
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Embedded CSS for media queries to keep things standalone and fast */}
      <style>{`
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </nav>
  );
};
export default Navbar;
