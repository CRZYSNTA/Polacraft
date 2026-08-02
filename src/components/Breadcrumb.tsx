import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ margin: "0 0 1.25rem 0" }}>
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.4rem",
          listStyle: "none",
          padding: 0,
          margin: 0,
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "#64748B",
        }}
      >
        <li style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <Link
            href="/"
            style={{
              color: "#64748B",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "color 0.15s ease",
            }}
            className="hover:text-amber-500"
          >
            <Home size={14} /> Home
          </Link>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ChevronRight size={14} style={{ color: "#CBD5E1", flexShrink: 0 }} />
              {isLast || !item.href ? (
                <span style={{ color: "#D4AF37", fontWeight: 800 }}>{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  style={{
                    color: "#64748B",
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                  className="hover:text-amber-500"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
