import { getPosters } from "@/lib/cms";
import HomeClient from "@/components/home/HomeClient";

// Revalidate homepage every 10 seconds for instant database updates & zero client-side lag
export const revalidate = 10;

export default async function Home() {
  const posters = await getPosters();
  return <HomeClient initialPosters={posters} />;
}
