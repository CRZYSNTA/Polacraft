export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/checkout/"]
    },
    sitemap: "https://polacraft.com/sitemap.xml"
  };
}
