'use client';

import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  avatar: string;
}

export interface SavedAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
}

export interface OrderHistoryItem {
  orderId: string;
  date: string;
  total: number;
  status: string;
  items: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  savedAddresses: SavedAddress[];
  orderHistory: OrderHistoryItem[];
  login: (email: string, password?: string) => AuthUser;
  loginWithGoogle: () => AuthUser;
  logout: () => void;
  addAddress: (newAddr: Omit<SavedAddress, "id">) => void;
  addOrderToHistory: (order: OrderHistoryItem) => void;
  mounted: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("polacraft_user");
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedAddr = localStorage.getItem("polacraft_addresses");
      if (savedAddr) setSavedAddresses(JSON.parse(savedAddr));

      const savedOrders = localStorage.getItem("polacraft_orders");
      if (savedOrders) setOrderHistory(JSON.parse(savedOrders));
    } catch (e) {
      console.error("Auth context parse failure", e);
    }
    setMounted(true);
  }, []);

  const login = (email: string, password?: string): AuthUser => {
    // Simulated authentication success
    const mockUser: AuthUser = {
      uid: "user_984532",
      name: email.split("@")[0].toUpperCase(),
      email: email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"
    };
    setUser(mockUser);
    
    const initialAddress: SavedAddress[] = [
      { id: "addr_1", name: mockUser.name, street: "42, Panampilly Nagar", city: "Kochi", zip: "682036" }
    ];
    setSavedAddresses(initialAddress);

    // Mock history
    const initialOrders: OrderHistoryItem[] = [
      { orderId: "POLA-789324", date: "June 14, 2026", total: 1999, status: "Delivered", items: "Manichitrathazhu x1 (A4, Wood Frame)" }
    ];
    setOrderHistory(initialOrders);

    if (mounted) {
      localStorage.setItem("polacraft_user", JSON.stringify(mockUser));
      localStorage.setItem("polacraft_addresses", JSON.stringify(initialAddress));
      localStorage.setItem("polacraft_orders", JSON.stringify(initialOrders));
    }
    return mockUser;
  };

  const loginWithGoogle = (): AuthUser => {
    return login("google.collector@polacraft.com", "google-token");
  };

  const logout = (): void => {
    setUser(null);
    setSavedAddresses([]);
    setOrderHistory([]);
    if (mounted) {
      localStorage.removeItem("polacraft_user");
      localStorage.removeItem("polacraft_addresses");
      localStorage.removeItem("polacraft_orders");
    }
  };

  const addAddress = (newAddr: Omit<SavedAddress, "id">): void => {
    const addrObj: SavedAddress = { id: `addr_${Date.now()}`, ...newAddr };
    setSavedAddresses((prev) => {
      const updated = [...prev, addrObj];
      if (mounted) localStorage.setItem("polacraft_addresses", JSON.stringify(updated));
      return updated;
    });
  };

  const addOrderToHistory = (order: OrderHistoryItem): void => {
    setOrderHistory((prev) => {
      const updated = [order, ...prev];
      if (mounted) localStorage.setItem("polacraft_orders", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        savedAddresses,
        orderHistory,
        login,
        loginWithGoogle,
        logout,
        addAddress,
        addOrderToHistory,
        mounted
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
