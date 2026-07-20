import React from "react";

export type SchemaType =
  | "Organization"
  | "WebSite"
  | "BreadcrumbList"
  | "Product"
  | "CollectionPage"
  | "ItemList";

interface JsonLdProps {
  type: SchemaType;
  data: Record<string, any>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ type, data }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// ==========================================
// PRESET SCHEMA GENERATORS
// ==========================================

export const OrganizationSchema = () => (
  <JsonLd
    type="Organization"
    data={{
      name: "Polacraft Studio",
      url: "http://localhost:3000",
      logo: "http://localhost:3000/assets/logo.png",
      sameAs: [
        "https://instagram.com/polacraft",
        "https://pinterest.com/polacraft",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-98456-78910",
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: ["English", "Malayalam"],
      },
    }}
  />
);

export const WebSiteSearchSchema = () => (
  <JsonLd
    type="WebSite"
    data={{
      name: "Polacraft Fine Art Posters",
      url: "http://localhost:3000",
      potentialAction: {
        "@type": "SearchAction",
        target: "http://localhost:3000/shop?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    }}
  />
);

export const BreadcrumbSchema = ({ items }: { items: { name: string; url: string }[] }) => (
  <JsonLd
    type="BreadcrumbList"
    data={{
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }}
  />
);

export default JsonLd;
