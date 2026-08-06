'use client';

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AppContext } from "../features/cart/AppContext";
import { Heart, ShoppingBag, Menu, X, User } from "lucide-react";

const LogoVideoReveal = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, []);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          height: "44px",
          width: "auto",
          maxHeight: "50px",
          objectFit: "contain",
          display: "block",
          borderRadius: "4px"
        }}
      >
        <source src="/assets/logo-reveal.mp4?v=v3" type="video/mp4" />
        {/* Native Fallback for unsupported browsers */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <Image
            src="/assets/polacraft-logo-mark.png"
            alt="Polacraft Logo Mark"
            width={32}
            height={32}
            style={{ objectFit: "contain", borderRadius: "5px" }}
          />
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.8rem",
              fontWeight: "900",
              letterSpacing: "-0.04em",
              display: "inline-flex",
              alignItems: "center",
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
                marginLeft: "2px",
                display: "inline-block",
              }}
            />
          </span>
        </div>
      </video>
    </div>
  );
};

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

        {/* Mobile Rotating Single Line Ticker */}
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
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
          }}
        >
          {/* LEFT SLOT: HAMBURGER MENU TOGGLE */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            {/* Mobile Menu Toggle on LEFT */}
            <button
              className="mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: "4px" }}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Navigation Links */}
            <div
              className="desktop-only"
              style={{
                display: "flex",
                gap: "1.8rem",
                alignItems: "center",
              }}
            >
              {[
                { path: "/shop", label: "Shop Art" },
                { path: "/custom", label: "Custom Print" },
                { path: "/about", label: "Our Story" },
                { path: "/journal", label: "Editorial Journal" },
                { path: "/contact", label: "Contact" },
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
          </div>

          {/* CENTER SLOT: CENTERED BRAND LOGO WITH VIDEO REVEAL SUPPORT */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Link
              href="/"
              onClick={handleLinkClick}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              {/* Logo Reveal Video (Auto-plays muted loop, falls back to brand logo if no video uploaded) */}
              <LogoVideoReveal />
            </Link>
          </div>

          {/* RIGHT SLOT: CLEAN UTILITY ACTIONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "1.2rem",
            }}
          >
            {/* Wishlist Link (Desktop Only to keep Mobile ultra-clean) */}
            <Link
              href="/account/wishlist"
              className="desktop-only"
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

            {/* Shopping Bag (Mobile & Desktop Main Icon) */}
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

            {/* Account / Sign In (Desktop Only) */}
            <div className="desktop-only">
              {session?.user ? (
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
            </div>
          </div>
        </div>
      </nav>

      {/* SLEEK MOBILE DRAWER MENU */}
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

          {/* Wishlist in Mobile Drawer */}
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

          {/* Account / Sign In in Mobile Drawer */}
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
