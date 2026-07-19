import { getPosterBySlug } from "../../../lib/cms";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

// Dynamic SEO metadata generator for film posters (Point 1 & 8)
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const poster = await getPosterBySlug(slug);

  if (!poster) {
    return {
      title: "Artwork Not Found | Polacraft",
      description: "The requested Malayalam film poster could not be found in our digital gallery catalog."
    };
  }

  return {
    title: poster.seoTitle,
    description: poster.seoDescription,
    keywords: [poster.film, poster.director, "Malayalam movie posters", "fine art prints", "Polacraft"],
    alternates: {
      canonical: `https://polacraft.com/product/${poster.slug}`,
    },
    openGraph: {
      title: poster.seoTitle,
      description: poster.seoDescription,
      url: `https://polacraft.com/product/${poster.slug}`,
      siteName: "Polacraft Studio",
      images: [
        {
          url: poster.galleryImages?.[0] || "",
          width: 800,
          height: 1130,
          alt: poster.title
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: poster.seoTitle,
      description: poster.seoDescription,
      images: [poster.galleryImages?.[0] || ""]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const poster = await getPosterBySlug(slug);

  if (!poster) {
    notFound();
  }

  return <ProductDetailClient poster={poster} />;
}
