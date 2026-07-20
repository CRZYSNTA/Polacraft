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
  title: "Polacraft | Malayalam Cinema. Reimagined as Wall Art.",
  description: "Polacraft transforms iconic Malayalam film milestones, dialogues, and characters into premium archival wall posters.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Polacraft | Malayalam Cinema. Reimagined as Wall Art.",
    description: "Premium handcrafted archival prints for movie lovers and interior design curations.",
    type: "website",
  }
};

export default function RootLayout({ children }) {
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
