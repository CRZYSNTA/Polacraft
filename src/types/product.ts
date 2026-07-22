export interface Product {
  id: string;
  slug: string;
  title: string;
  film: string;
  year: number;
  director: string;
  cast: string[];
  collection: string;
  genre: string;
  price: number;
  inventory: number;
  lowStockThreshold: number;
  isPreorder: boolean;
  isSoldOut: boolean;
  limitedEditionCount?: number;
  palette: {
    primary: string;
    accent: string;
    bg: string;
    text: string;
  };
  gsm: number;
  finish: string;
  paperType: string;
  heroImage?: string;
  galleryImages: string[];
  wallMockups: string[];
  seoTitle: string;
  seoDescription: string;
  tagline: string;
  story: string;
  designNotes: string;
  availableSizes: string[];
  frameOptions: string[];
}
