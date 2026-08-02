import { getPosters, getStoreCollections } from "@/lib/cms";
import ShopClient from "./ShopClient";
import { Suspense } from "react";

// Revalidate shop page every 10 seconds for instant database updates & zero client-side lag
export const revalidate = 10;

export default async function Shop() {
  const initialPosters = await getPosters();
  const initialCollections = await getStoreCollections();

  return (
    <Suspense
      fallback={
        <div style={{ paddingTop: "200px", paddingBottom: "100px", textAlign: "center" }}>
          <h3>Loading Art Exhibition...</h3>
        </div>
      }
    >
      <ShopClient initialPosters={initialPosters} initialCollections={initialCollections} />
    </Suspense>
  );
}
