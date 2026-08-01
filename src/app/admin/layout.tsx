import React from "react";
import { getAdminSession } from "@/lib/auth/guards";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export const metadata = {
  title: "Polacraft Admin Console",
  description: "Secure Administrator Dashboard for Polacraft",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Unified Admin Session check (Auth.js Google OAuth + Legacy Session)
  const session = await getAdminSession();

  // If no admin session active, render standalone page (e.g. /admin/login page component)
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      {/* Shared Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area with Topbar */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar Navigation */}
        <Topbar
          user={{
            email: session.email,
            name: session.name,
            role: session.role,
          }}
        />

        {/* Dynamic Admin View */}
        <main style={{ flexGrow: 1, padding: "2.5rem 3rem", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
