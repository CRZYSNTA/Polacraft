'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, trackPageView } from "../services/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      initAnalytics();
    } catch (e) {
      console.error("Analytics load error", e);
    }
  }, []);

  useEffect(() => {
    try {
      trackPageView(pathname);
    } catch (e) {
      console.error("Analytics track error", e);
    }
  }, [pathname]);

  return null;
}
