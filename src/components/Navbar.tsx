'use client';

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AppContext } from "../features/cart/AppContext";
import { Search, Heart, ShoppingBag, Menu, X, User, LogOut, Sparkles } from "lucide-react";

export const Navbar = () => {
  const { cartItemCount, wishlist, setCartOpen, siteSettings } = useContext(AppContext);
  const { data: session } = useSession();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  const freeShip = siteSettings?.freeShippingThreshold || 499;
  const rewardThresh = siteSettings?.collectorRewardThreshold || 899;
  const premiumThresh = siteSettings?.premiumRewardThreshold || 1499;

  const tickerMessages = [
    `🚚 FREE Shipping on Orders ₹${freeShip}+`,
    `🎁 Free Collector Poster Gift on ₹${rewardThresh}+`,
    `🏆 Unlock Premium Status on ₹${premiumThresh}+`,
    `✨ Museum-Quality Archival Cotton Prints`,
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

  // Auto rotate announcement ticker on mobile every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [tickerMessages.length]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Hide Storefront Navbar completely on Admin Portal routes (/admin/*)
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
        zIndex: 1000,
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
        {/* Desktop Multi-perk Row */}
        <div
          className="desktop-only"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <span>🚚 <strong>FREE Shipping</strong> on ₹{freeShip}+</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>🎁 <strong>Free Collector Gift</strong> on ₹{rewardThresh}+</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>🏆 <strong>Premium Status</strong> on ₹{premiumThresh}+</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ color: "#F59E0B" }}>Handcrafted Malayalam Cinema Art</span>
        </div>

        {/* Mobile Rotating Single Line Ticker */}
        <div
          className="mobile-only"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F59E0B",
            fontWeight: "800",
            transition: "opacity 0.4s ease",
          }}
        >
          {tickerMessages[tickerIndex]}
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <nav
        style={{
          height: isScrolled ? "64px" : "74px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          borderBottom: "1px solid rgba(17, 17, 17, 0.08)",
          backgroundColor: isScrolled ? "rgba(250, 250, 248, 0.95)" : "#FAFAF8",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transition: "height 0.3s ease, background-color 0.3s ease",
        }}
      >
        <div
          className="container"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* LOGO */}
          <Link
            href="/"
            onClick={handleLinkClick}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.8rem",
              fontWeight: "900",
              letterSpacing: "-0.04em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
              textDecoration: "none",
            }}
          >
            <span style={{ color: "#111111" }}>POLA</span>
            <span style={{ color: "#666666", fontWeight: "300" }}>CRAFT</span>
            <span
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#D4AF37",
                borderRadius: "50%",
                marginLeft: "2px",
                display: "inline-block",
              }}
            />
          </Link>

          {/* DESKTOP NAVIGATION LINKS */}
          <div
            style={{
              display: "flex",
              gap: "2.2rem",
              alignItems: "center",
            }}
            className="desktop-only"
          >
            {[
              { path: "/shop", label: "Shop Art" },
              { path: "/custom", label: "Custom Print" },
              { path: "/about", label: "Our Story" },
              { path: "/journal", label: "Editorial Journal" },
              { path: "/contact", label: "Contact Studio" },
            ].map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  style={{
                    fontWeight: isActive ? "800" : "600",
                    color: isActive ? "#111111" : "#555555",
                    fontSize: "0.88rem",
                    textDecoration: "none",
                    borderBottom: isActive ? "2px solid #D4AF37" : "2px solid transparent",
                    paddingBottom: "4px",
                    transition: "color 0.2s ease",
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
              gap: "1.2rem",
            }}
          >
            {/* Wishlist Link */}
            <Link
              href="/account/wishlist"
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

            {/* Cart Bag */}
            <button
              onClick={() => setCartOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: "4px", position: "relative" }}
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag size={20} />
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

            {/* Account Link */}
            {session?.user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link
                  href="/account"
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
              </div>
            ) : (
              <Link
                href="/login"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "800",
                  color: "#111111",
                  border: "1px solid #111111",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "100px",
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: "4px" }}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
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
            zIndex: 999,
            boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
          }}
        >
          {[
            { path: "/shop", label: "Shop All Posters" },
            { path: "/custom", label: "Upload Custom Print" },
            { path: "/about", label: "Our Craftsmanship" },
            { path: "/journal", label: "Editorial Journal" },
            { path: "/contact", label: "Contact Studio" },
            { path: "/account", label: "Collector Account" },
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
        </div>
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
