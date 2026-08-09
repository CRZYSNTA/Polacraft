'use client';

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppContext } from "../features/cart/AppContext";
import { Heart, ShoppingBag, Menu, X, User } from "lucide-react";

const LogoBrand = () => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
      <Image
        src="/assets/polacraft-logo-mark.png"
        alt="Polacraft Logo Mark"
        width={30}
        height={30}
        style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "4px" }}
      />
      <span
        style={{
          fontFamily: "var(--font-movault), 'Movault', var(--font-bebas-neue), 'Bebas Neue', sans-serif",
          fontSize: "1.65rem",
          fontWeight: "900",
          letterSpacing: "0.03em",
          display: "inline-flex",
          alignItems: "center",
          lineHeight: 1,
        }}
      >
        <span style={{ color: "#111111" }}>POLA</span>
        <span style={{ color: "#666666", fontWeight: "300" }}>CRAFT</span>
        <span
          style={{
            width: "5px",
            height: "5px",
            backgroundColor: "#D4AF37",
            borderRadius: "50%",
            marginLeft: "3px",
            display: "inline-block",
          }}
        />
      </span>
    </div>
  );
};

export const Navbar = () => {
  const context = useContext(AppContext);
  const cartItemCount = context?.cartItemCount || 0;
  const wishlist = context?.wishlist || [];
  const setCartOpen = context?.setCartOpen || (() => {});
  const siteSettings = context?.siteSettings;

  const { data: session } = useSession();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  const freeShip = siteSettings?.freeShippingThreshold || 499;
  const rewardThresh = siteSettings?.collectorRewardThreshold || 899;

  const tickerMessages = [
    `COMPLIMENTARY SHIPPING ON ORDERS ₹${freeShip}+`,
    `FREE COLLECTOR GIFT ON ORDERS ₹${rewardThresh}+`,
    `MUSEUM-QUALITY 300 GSM COTTON PRINTS`,
    `HANDCRAFTED ARCHIVAL MALAYALAM CINEMA ART`,
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [tickerMessages.length]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Hide Storefront Navbar on Admin routes (/admin/*)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
        backgroundColor: "#FAFAF8",
        boxShadow: isScrolled ? "0 10px 30px rgba(0,0,0,0.06)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      {/* 1. TOP ANNOUNCEMENT TICKER RIBBON */}
      <div
        style={{
          backgroundColor: "#111111",
          color: "#FAFAFA",
          fontSize: "0.76rem",
          fontWeight: "700",
          letterSpacing: "0.03em",
          height: "34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 1rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Desktop Row */}
        <div
          className="desktop-only"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: "700",
          }}
        >
          <span style={{ color: "#FAFAFA" }}>Complimentary Shipping on ₹{freeShip}+</span>
          <span style={{ opacity: 0.3, color: "#FFFFFF" }}>•</span>
          <span style={{ color: "#FAFAFA" }}>Free Collector Gift on ₹{rewardThresh}+</span>
          <span style={{ opacity: 0.3, color: "#FFFFFF" }}>•</span>
          <span style={{ color: "#D4AF37" }}>Museum-Quality Archival Cotton Prints</span>
        </div>

        {/* Mobile Ticker */}
        <div
          className="mobile-only"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#D4AF37",
            fontWeight: "800",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "opacity 0.4s ease",
          }}
        >
          {tickerMessages[tickerIndex]}
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <nav
        style={{
          height: isScrolled ? "62px" : "70px",
          display: "flex",
          alignItems: "center",
          padding: "0 1.25rem",
          borderBottom: "1px solid rgba(17, 17, 17, 0.08)",
          backgroundColor: isScrolled ? "rgba(250, 250, 248, 0.98)" : "#FAFAF8",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transition: "height 0.3s ease, background-color 0.3s ease",
          position: "relative",
          zIndex: 9999
        }}
      >
        {/* DESKTOP NAVBAR ROW */}
        <div
          className="container desktop-only"
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            gap: "2.5rem"
          }}
        >
          {/* LEFT: BRAND LOGO */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link
              href="/"
              onClick={handleLinkClick}
              style={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                cursor: "pointer"
              }}
            >
              <LogoBrand />
            </Link>
          </div>

          {/* CENTER: DESKTOP NAVIGATION LINKS */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2.2rem" }}>
            {[
              { path: "/shop", label: "Shop Art" },
              { path: "/custom", label: "Custom Print" },
              { path: "/track", label: "Track Order" },
              { path: "/about", label: "Our Story" },
              { path: "/journal", label: "Editorial Journal" },
              { path: "/contact", label: "Contact" },
            ].map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={handleLinkClick}
                  style={{
                    fontWeight: isActive ? "800" : "600",
                    color: isActive ? "#111111" : "#555555",
                    fontSize: "0.88rem",
                    textDecoration: "none",
                    borderBottom: isActive ? "2px solid #D4AF37" : "2px solid transparent",
                    paddingBottom: "4px",
                    transition: "color 0.2s ease",
                    cursor: "pointer",
                    pointerEvents: "auto"
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: DESKTOP UTILITY ACTIONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "1.2rem",
            }}
          >
            {/* Wishlist Link */}
            <Link
              href="/account/wishlist"
              onClick={handleLinkClick}
              style={{ cursor: "pointer", color: "#111111", padding: "4px", position: "relative" }}
              aria-label="View Wishlist"
            >
              <Heart size={20} fill={wishlist.length > 0 ? "#111111" : "none"} />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-4px",
                    backgroundColor: "#D4AF37",
                    color: "#111111",
                    fontSize: "0.6rem",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "900",
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account / Sign In */}
            {session?.user ? (
              <Link
                href="/account"
                onClick={handleLinkClick}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", textDecoration: "none" }}
                aria-label="User Account"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={24}
                    height={24}
                    unoptimized={session.user.image.startsWith("http")}
                    style={{ borderRadius: "50%", border: "1.5px solid #D4AF37", objectFit: "cover" }}
                  />
                ) : (
                  <User size={20} style={{ color: "#111111" }} />
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={handleLinkClick}
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "800",
                  color: "#111111",
                  border: "1px solid #111111",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "100px",
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  transition: "all 0.2s ease"
                }}
              >
                Sign In
              </Link>
            )}

            {/* Shopping Bag */}
            <button
              onClick={() => setCartOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: "4px", position: "relative" }}
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag size={21} />
              {cartItemCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-4px",
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                    fontSize: "0.6rem",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "900",
                  }}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAVBAR ROW */}
        <div
          className="container mobile-only"
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center"
          }}
        >
          {/* LEFT: HAMBURGER TOGGLE */}
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: "4px" }}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* CENTER: LOGO */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              href="/"
              onClick={handleLinkClick}
              style={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <LogoBrand />
            </Link>
          </div>

          {/* RIGHT: SHOPPING BAG */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setCartOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: "4px", position: "relative" }}
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag size={21} />
              {cartItemCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-4px",
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                    fontSize: "0.6rem",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "900",
                  }}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* SLEEK MOBILE DRAWER MENU (Z-INDEX 10000) */}
      {isMobileMenuOpen && (
        <>
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 99998,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              backgroundColor: "#FAFAF8",
              borderBottom: "1px solid rgba(17, 17, 17, 0.1)",
              padding: "1.75rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              zIndex: 99999,
              boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
            }}
          >
            {[
              { path: "/shop", label: "Shop All Posters" },
              { path: "/custom", label: "Upload Custom Print" },
              { path: "/track", label: "Track Package & Order" },
              { path: "/about", label: "Our Craftsmanship" },
              { path: "/journal", label: "Editorial Journal" },
              { path: "/contact", label: "Contact Studio" },
            ].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={handleLinkClick}
                style={{
                  textAlign: "left",
                  fontSize: "1.15rem",
                  fontWeight: pathname === item.path ? "800" : "500",
                  color: pathname === item.path ? "#111111" : "#555555",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}

            <div style={{ height: "1px", backgroundColor: "rgba(17,17,17,0.1)", margin: "0.5rem 0" }} />

            <Link
              href="/account/wishlist"
              onClick={handleLinkClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "1.1rem",
                fontWeight: "700",
                color: "#111111",
                textDecoration: "none",
              }}
            >
              <Heart size={18} fill={wishlist.length > 0 ? "#111111" : "none"} />
              My Wishlist ({wishlist.length})
            </Link>

            <Link
              href={session?.user ? "/account" : "/login"}
              onClick={handleLinkClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "1.1rem",
                fontWeight: "700",
                color: "#111111",
                textDecoration: "none",
              }}
            >
              <User size={18} />
              {session?.user ? `Account (${session.user.name || "Collector"})` : "Sign In / Register"}
            </Link>
          </div>
        </>
      )}

      {/* CSS Media Queries */}
      <style>{`
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
