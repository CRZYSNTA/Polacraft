import { getPosters, getHeroPosters, getSiteSettings } from "@/lib/cms";
import HomeClient from "@/components/home/HomeClient";

// Force dynamic rendering to prevent browser/CDN caching of stale homepage HTML
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [posters, heroPosters, siteSettings] = await Promise.all([
    getPosters(),
    getHeroPosters(),
    getSiteSettings(),
  ]);

  return <HomeClient initialPosters={posters} heroPosters={heroPosters} serverSiteSettings={siteSettings} />;
}
