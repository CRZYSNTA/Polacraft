"use client";

import React, { useTransition } from "react";
import { logoutAdminAction } from "@/features/admin/actions";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutButtonProps {
  variant?: "icon" | "full" | "subtle";
  className?: string;
}

export default function LogoutButton({ variant = "full", className }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdminAction();
    });
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        title="Sign Out"
        style={{
          background: "none",
          border: "none",
          cursor: isPending ? "not-allowed" : "pointer",
          color: "rgba(250, 250, 248, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          borderRadius: "8px",
          transition: "all 0.2s ease",
        }}
        className={className}
      >
        {isPending ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.6rem 1rem",
        borderRadius: "10px",
        fontSize: "0.85rem",
        fontWeight: 600,
        backgroundColor: "rgba(239, 68, 68, 0.12)",
        color: "#EF4444",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        cursor: isPending ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        width: "100%",
        justifyContent: "center",
      }}
      className={className}
    >
      {isPending ? (
        <>
          <Loader2 size={16} className="animate-spin" /> Logging out...
        </>
      ) : (
        <>
          <LogOut size={16} /> Logout
        </>
      )}
    </button>
  );
}
