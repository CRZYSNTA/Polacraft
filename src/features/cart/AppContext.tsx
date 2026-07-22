'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sizes, frames } from "../../lib/cms/products";
import { Product } from "../../types";
import { StorePromotionSettings, DEFAULT_STORE_SETTINGS } from "@/services/promotionEngine";

export interface CartItem {
  cartId: string;
  posterId: string;
  title: string;
  slug: string;
  film: string;
  price: number;
  bgColor: string;
  textColor: string;
  size: string;
  frame: string;
  quantity: number;
}

export interface AppContextType {
  cart: CartItem[];
  addToCart: (poster: Product, sizeId?: string, frameId?: string, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQty: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (posterId: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  openQuickView: (poster: Product) => void;
  closeQuickView: () => void;
  recentlyViewed: Product[];
  addRecentlyViewed: (poster: Product) => void;
  cartSubtotal: number;
  cartItemCount: number;
  mounted: boolean;
  siteSettings: StorePromotionSettings;
  selectedRewards: string[];
  setSelectedRewards: (rewards: string[]) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Shopping Cart & Wishlist States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);
  const [siteSettings, setSiteSettings] = useState<StorePromotionSettings>(DEFAULT_STORE_SETTINGS);
  const [selectedRewards, setSelectedRewards] = useState<string[]>(["1xA3"]);

  // Fetch live site settings from API
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSiteSettings({
            shippingFee: Number(data.settings.shippingFee ?? DEFAULT_STORE_SETTINGS.shippingFee),
            freeShippingThreshold: Number(data.settings.freeShippingThreshold ?? DEFAULT_STORE_SETTINGS.freeShippingThreshold),
            collectorRewardThreshold: Number(data.settings.collectorRewardThreshold ?? DEFAULT_STORE_SETTINGS.collectorRewardThreshold),
            premiumRewardThreshold: Number(data.settings.premiumRewardThreshold ?? DEFAULT_STORE_SETTINGS.premiumRewardThreshold),
            loyaltyPointsRatio: Number(data.settings.loyaltyPointsRatio ?? DEFAULT_STORE_SETTINGS.loyaltyPointsRatio),
            heroTitle: data.settings.heroTitle || DEFAULT_STORE_SETTINGS.heroTitle,
            heroSubtitle: data.settings.heroSubtitle || DEFAULT_STORE_SETTINGS.heroSubtitle,
            rewardsEnabled: data.settings.rewardsEnabled !== undefined ? Boolean(data.settings.rewardsEnabled) : true,
            limitedEditionsEnabled: data.settings.limitedEditionsEnabled !== undefined ? Boolean(data.settings.limitedEditionsEnabled) : true
          });
        }
      })
      .catch((e) => console.log("Using default site settings fallback", e));
  }, []);

  // Load from localStorage only on client-side mount (hydration safe)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("polacraft_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWish = localStorage.getItem("polacraft_wishlist");
      if (savedWish) setWishlist(JSON.parse(savedWish));
      
      const savedRecent = localStorage.getItem("polacraft_recently");
      if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));

      const savedRew = localStorage.getItem("polacraft_rewards");
      if (savedRew) setSelectedRewards(JSON.parse(savedRew));
    } catch (e) {
      console.error("Failed to parse storage", e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("polacraft_cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("polacraft_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("polacraft_rewards", JSON.stringify(selectedRewards));
    }
  }, [selectedRewards, mounted]);

  // Cart operations
  const addToCart = (poster: Product, sizeId: string = "A4", frameId: string = "unframed", quantity: number = 1) => {
    const sizeObj = sizes.find((s) => s.id === sizeId);
    const frameObj = frames.find((f) => f.id === frameId);
    if (!sizeObj || !frameObj) return;

    const itemPrice = poster.price + sizeObj.priceModifier + frameObj.priceModifier;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.posterId === poster.id && item.size === sizeId && item.frame === frameId
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            cartId: `${poster.id}-${sizeId}-${frameId}-${Date.now()}`,
            posterId: poster.id,
            title: poster.title,
            slug: poster.slug,
            film: poster.film,
            price: itemPrice,
            bgColor: poster.palette.bg,
            textColor: poster.palette.text,
            size: sizeId,
            frame: frameId,
            quantity: quantity
          }
        ];
      }
    });
    setCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const updateCartQty = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (posterId: string) => {
    setWishlist((prevWish) => {
      if (prevWish.includes(posterId)) {
        return prevWish.filter((id) => id !== posterId);
      } else {
        return [...prevWish, posterId];
      }
    });
  };

  const addRecentlyViewed = (poster: Product) => {
    if (!poster) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== poster.id);
      const updated = [poster, ...filtered].slice(0, 4);
      if (mounted) {
        localStorage.setItem("polacraft_recently", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const openQuickView = (poster: Product) => {
    setQuickViewProduct(poster);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        wishlist,
        toggleWishlist,
        cartOpen,
        setCartOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        recentlyViewed,
        addRecentlyViewed,
        cartSubtotal,
        cartItemCount,
        mounted,
        siteSettings,
        selectedRewards,
        setSelectedRewards
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

export const useCart = useApp;
