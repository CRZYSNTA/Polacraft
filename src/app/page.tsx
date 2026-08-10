import { getPosters, getHeroPosters, getSiteSettings } from "@/lib/cms";
import HomeClient from "@/components/home/HomeClient";

// Enable Incremental Static Regeneration (ISR) for instant 0ms homepage delivery
export const revalidate = 60;

export default async function Home() {
  const [posters, heroPosters, siteSettings] = await Promise.all([
    getPosters(),
    getHeroPosters(),
    getSiteSettings(),
  ]);

  return <HomeClient initialPosters={posters} heroPosters={heroPosters} serverSiteSettings={siteSettings} />;
}
