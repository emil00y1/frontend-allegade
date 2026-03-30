import dynamic from "next/dynamic";
import { urlFor } from "@/sanity/lib/image";
const VenueCarousel = dynamic(() => import("@/components/VenueCarousel"));

interface SelskaberVenuesProps {
  venueEyebrow?: string;
  venueHeading?: string;
  venueCtaLabel?: string;
  venues?: any[];
}

export default function SelskaberVenues({
  venueEyebrow,
  venueHeading,
  venueCtaLabel,
  venues,
}: SelskaberVenuesProps) {
  const list = venues || [];
  if (list.length === 0 && !venueHeading) return null;

  return (
    <VenueCarousel
      venues={list.map((v: any) => ({
        _key: v._key,
        name: v.name,
        capacity: v.capacity,
        imageUrl: v.image?.asset
          ? urlFor(v.image).width(800).height(534).auto("format").url()
          : null,
      }))}
      eyebrow={venueEyebrow}
      heading={venueHeading ?? "Vores Selskabslokaler"}
      ctaLabel={venueCtaLabel ?? "Forespørg om lokalet"}
    />
  );
}
