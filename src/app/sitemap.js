import { getPosters } from "../lib/cms";

export default async function sitemap() {
  const baseUrl = "https://polacraft.com";

  // Static routes
  const routes = ["", "/shop", "/about", "/journal", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  // Fetch dynamic product paths
  const posters = await getPosters();
  const productRoutes = posters.map((poster) => ({
    url: `${baseUrl}/product/${poster.slug}`,
    lastModified: new Date().toISOString()
  }));

  return [...routes, ...productRoutes];
}
