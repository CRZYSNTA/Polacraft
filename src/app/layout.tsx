import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../features/cart/AppContext";
import { AuthProvider } from "../features/auth/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import QuickViewModal from "../components/QuickViewModal";
import CustomCursor from "../components/CustomCursor";
import AnalyticsTracker from "../components/AnalyticsTracker";
import { OrganizationSchema, WebSiteSearchSchema } from "../components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const metadata = {
  title: "Premium Malayalam Movie Posters | Polacraft",
  description: "Discover premium Malayalam cinema posters inspired by iconic films and legendary actors. Museum-quality prints with collector rewards and free shipping.",
  metadataBase: new URL("https://polacraft-1.vercel.app"),
  openGraph: {
    title: "Premium Malayalam Movie Posters | Polacraft",
    description: "Discover premium Malayalam cinema posters inspired by iconic films and legendary actors. Museum-quality prints with collector rewards and free shipping.",
    type: "website",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative" }} suppressHydrationWarning>
        <AuthProvider>
          <AppProvider>
            {/* Dynamic Organization & SearchAction Schemas */}
            <OrganizationSchema />
            <WebSiteSearchSchema />

            {/* Analytics Script Loaders & Page trackers */}
            <AnalyticsTracker />

            {/* Global Ambient Paper grain filter */}
            <div className="paper-texture" />
            
            {/* Trailing Spring Cursor */}
            <CustomCursor />

            {/* Glass Navbar */}
            <Navbar />

            {/* Main page content wrapper */}
            <main style={{ flexGrow: 1 }} id="main-content">
              {children}
            </main>

            {/* Editorial Footer */}
            <Footer />

            {/* Checkout Bag Drawer */}
            <CartDrawer />

            {/* Catalog Quick Configuration modal */}
            <QuickViewModal />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
