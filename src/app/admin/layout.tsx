import React from "react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
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
  // Server-side verification of admin session
  const session = await getSession();

  // If user is accessing login page, render children directly without dashboard chrome
  // Note: Middleware already redirects authenticated ADMINs away from /admin/login to /admin
  // But layout check ensures isolated layout rendering for /admin/login
  if (!session) {
    return <>{children}</>;
  }

  // If session exists but role is not ADMIN or SUPER_ADMIN, deny access and redirect to storefront
  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    redirect("/");
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
