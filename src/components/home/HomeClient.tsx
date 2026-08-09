'use client';

import React, { useContext } from "react";
import { AppContext } from "@/features/cart/AppContext";
import { Product } from "@/types";

import HeroSection from "./HeroSection";
import BestSellersSection from "./BestSellersSection";
import DesignYourOwnSection from "./DesignYourOwnSection";
import WhyChooseUsSection from "./WhyChooseUsSection";
import HomeFaqSection from "./HomeFaqSection";
import PackagingSection from "./PackagingSection";
import TestimonialsSection from "./TestimonialsSection";
import NewsletterSection from "./NewsletterSection";

interface HomeClientProps {
  initialPosters: Product[];
  heroPosters?: Product[];
  serverSiteSettings?: any;
}

export default function HomeClient({ initialPosters, heroPosters, serverSiteSettings }: HomeClientProps) {
  const { addToCart, wishlist, toggleWishlist, openQuickView, siteSettings } = useContext(AppContext);

  const activeSettings = serverSiteSettings || siteSettings;
  const heroFanCards = heroPosters && heroPosters.length > 0 ? heroPosters : initialPosters.slice(0, 6);
  const bestSellers = initialPosters.slice(0, 6);

  return (
    <main style={{ backgroundColor: "#FFFFFF", color: "#111111", minHeight: "100vh", overflowX: "hidden" }}>
      {/* 1. HERO SECTION (WITH MOBILE EXCLUSIVE ORIGINKIT CIRCLE FEATURING REAL POSTERS) */}
      <HeroSection
        heroTitle={activeSettings?.heroTitle || siteSettings?.heroTitle || "Bring Cinema Home."}
        heroSubtitle={activeSettings?.heroSubtitle || siteSettings?.heroSubtitle || "Museum-Quality Malayalam Cinema Posters Crafted For Collectors."}
        heroFanCards={heroFanCards}
        allPosters={initialPosters}
        isLoading={false}
      />

      {/* 2. BEST SELLING SECTION */}
      <BestSellersSection
        bestSellers={bestSellers}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        openQuickView={openQuickView}
        addToCart={addToCart}
      />

      {/* 3. DESIGN YOUR OWN PRINTS */}
      <DesignYourOwnSection />

      {/* 4. WHY CHOOSE US */}
      <WhyChooseUsSection />

      {/* 5. HOME FAQ SECTION */}
      <HomeFaqSection />

      {/* 6. UNBOXING & PACKAGING EXPERIENCE */}
      <PackagingSection />

      {/* 7. TESTIMONIALS & PRESS REVIEWS */}
      <TestimonialsSection />

      {/* 8. NEWSLETTER & VIP CLUB */}
      <NewsletterSection />

    </main>
  );
}
