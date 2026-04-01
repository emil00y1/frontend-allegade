import type { Metadata } from "next";
import DualLandingPage from "@/components/DualLandingPage";
import { sanityFetch } from "@/sanity/lib/live";

const QUERY = `{
  "restaurant": *[_type == "restaurantPage"][0]{ heroImage{ ..., asset-> } },
  "hotel": *[_type == "hotelPage"][0]{ heroImage{ ..., asset-> } }
}`;

export const metadata: Metadata = {
  title: "Allégade 10",
  description: "Hotel og restaurant på Frederiksberg siden 1780",
};

export default async function IndexPage() {
  const { data } = await sanityFetch<any>({ query: QUERY });

  return (
    <main className="overflow-hidden">
      <DualLandingPage
        restaurantImage={data?.restaurant?.heroImage}
        hotelImage={data?.hotel?.heroImage}
      />
    </main>
  );
}
