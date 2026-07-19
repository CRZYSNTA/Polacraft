// POLACRAFT ANALYTICS DISPATCHER CORE (Point 6)

import { OrderItem } from "../types";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

export const initAnalytics = (): void => {
  if (typeof window === "undefined") return;

  // 1. Google Analytics 4 stub
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', 'G-GA4POLACRAFT');

  // 2. Microsoft Clarity stub
  (function(c: any, l: Document, a: string, r: string, i: string, t?: any, y?: any){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "clarityid123");

  (function(f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)})(window, document, 'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', '1234567890123');

  console.log("▲ Polacraft Analytics initialized: [GA4, Clarity, Meta Pixel]");
};

export const trackPageView = (url: string): void => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag('event', 'page_view', { page_path: url });
  if (window.fbq) window.fbq('track', 'PageView');
  console.log(`▲ Analytics Pageview: ${url}`);
};

export const trackCartEvent = (action: "add" | "remove", item: any): void => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag('event', action === "add" ? "add_to_cart" : "remove_from_cart", {
    currency: "INR",
    value: item.price,
    items: [{
      item_id: item.posterId || item.id,
      item_name: item.title,
      price: item.price,
      quantity: item.quantity || 1
    }]
  });
  if (window.fbq) window.fbq('track', action === "add" ? 'AddToCart' : 'RemoveFromCart');
  console.log(`▲ Analytics Cart Event: [${action}] ${item.title}`);
};

export interface PurchaseData {
  orderId: string;
  totalAmount: number;
  items: any[];
}

export const trackPurchase = (orderData: PurchaseData): void => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag('event', 'purchase', {
    transaction_id: orderData.orderId,
    value: orderData.totalAmount,
    currency: "INR",
    items: orderData.items.map((item) => ({
      item_id: item.cartId || item.id,
      item_name: item.title,
      price: item.price,
      quantity: item.quantity
    }))
  });
  if (window.fbq) window.fbq('track', 'Purchase', { value: orderData.totalAmount, currency: 'INR' });
  console.log(`▲ Analytics Purchase: [Transaction ID] ${orderData.orderId}`);
};
