import { draftMode } from "next/headers";
import type { Metadata } from "next";
import type { TypedObject } from "sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import HotelHero from "@/components/sections/HotelHero";
import HotelFacilities from "@/components/sections/HotelFacilities";
import HotelRoomShowcase from "@/components/sections/HotelRoomShowcase";
import HotelPracticalInfo from "@/components/sections/HotelPracticalInfo";
import HotelNeighborhood from "@/components/sections/HotelNeighborhood";
import HotelRestaurantTeaser from "@/components/sections/HotelRestaurantTeaser";
import { SectionRenderer } from "@/components/sections";
import { type SiteSettings, type SanitySeo, type SanityImage, type SanitySection, type StatItem } from "@/types/sanity";
import { type HotelRoom } from "@/components/RoomCarousel";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";
import StructuredData from "@/components/StructuredData";

interface HotelPageData {
  _id: string;
  _type: string;
  title?: string;
  seo?: SanitySeo;
  sections?: SanitySection[];
  heroImage?: SanityImage;
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroStats?: StatItem[];
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaUrl?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaUrl?: string;
  heroFloatingStarText?: string;
  heroFloatingSubtext?: string;
  bookingCtaLabel?: string;
  bookingCtaUrl?: string;
  facilitiesHeading?: string;
  facilitiesHeadingItalic?: string;
  facilitiesDescription?: string;
  facilities?: Array<{ _key: string; icon?: SanityImage; title?: string; description?: string }>;
  roomShowcaseHeading?: string;
  practicalInfoHeading?: string;
  practicalInfoHeadingItalic?: string;
  faqItems?: Array<{ _key: string; question?: string; answer?: TypedObject[] | string }>;
  neighborhoodHeading?: string;
  neighborhoodHeadingItalic?: string;
  neighborhoodAddress?: string;
  neighborhoodCity?: string;
  neighborhoodMapUrl?: string;
  neighborhoodItems?: Array<{ _key: string; title?: string; walkTime?: string; description?: string }>;
  mapEyebrow?: string;
  directionsLabel?: string;
  restaurantEyebrow?: string;
  restaurantHeading?: string;
  restaurantHeadingItalic?: string;
  restaurantDescription?: string;
  restaurantCtaLabel?: string;
  restaurantCtaUrl?: string;
  restaurantImage?: SanityImage;
}

// ─── Query ────────────────────────────────────────────────────────────────────

const HOTEL_PAGE_QUERY = `{
  "page": *[_type == "hotelPage"][0]{
    _id,
    _type,
    title,
    seo,
    sections[]{
      ...,
      _type == "hotelHeroSection" => { ..., heroImage{ ..., asset-> } },
      _type == "hotelFacilitiesSection" => { ..., facilities[]{ ..., icon{ ..., asset-> } } },
      _type == "hotelRestaurantTeaserSection" => { ..., restaurantImage{ ..., asset-> } },
      ${SECTIONS_QUERY_FRAGMENT}
    },
    // Fallbacks
    heroImage{ ..., asset-> },
    heroHeading, heroHeadingItalic, heroDescription,
    heroStats[]{ _key, label, value },
    heroPrimaryCtaLabel, heroPrimaryCtaUrl, heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    heroFloatingStarText, heroFloatingSubtext,
    bookingCtaLabel, bookingCtaUrl,
    facilitiesHeading, facilitiesHeadingItalic, facilitiesDescription,
    facilities[]{ _key, icon{ ..., asset-> }, title, description },
    roomShowcaseHeading,
    practicalInfoHeading, practicalInfoHeadingItalic,
    faqItems[]{ _key, question, answer },
    neighborhoodHeading, neighborhoodHeadingItalic,
    neighborhoodAddress, neighborhoodCity, neighborhoodMapUrl,
    neighborhoodItems[]{ _key, title, walkTime, description },
    mapEyebrow, directionsLabel,
    restaurantEyebrow, restaurantHeading, restaurantHeadingItalic, restaurantDescription,
    restaurantCtaLabel, restaurantCtaUrl, restaurantImage{ ..., asset-> }
  },
  "rooms": *[_type == "hotelRoom"] | order(order asc, title asc){
    _id, title, slug, roomType, pricePerNight, priceLabel, description, note, features, ctaLabel, ctaUrl,
    image{ ..., asset-> }, gallery[]{ ..., asset-> }
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    address, phone, email, footerDescription, socialLinks,
    restaurantHours, kitchenClosingNote,
    newsletterLabel, newsletterSubtext, newsletterButtonLabel,
    breadcrumbHomeLabel, ctaBookStayUrl
  }
}`;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: HOTEL_PAGE_QUERY });
  const result = data as { page: HotelPageData | null; siteSettings: SiteSettings | null };
  const page = result?.page;
  const siteSettings = result?.siteSettings;

  const seo = page?.seo;
  const title = seo?.metaTitle || page?.title || "Hotel";
  const description = seo?.metaDescription || page?.heroDescription || siteSettings?.footerDescription;
  const ogImage = seo?.shareImage 
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : page?.heroImage 
      ? urlFor(page.heroImage).width(1200).height(630).url()
      : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: { title, description, images: ogImage ? [{ url: ogImage }] : [] },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HotelPage() {
  const { data } = await sanityFetch({ query: HOTEL_PAGE_QUERY });
  const result = data as { page: HotelPageData | null; siteSettings: SiteSettings | null; rooms: HotelRoom[] } | null;
  const page = result?.page;
  const siteSettings = result?.siteSettings;
  const rooms = result?.rooms ?? [];

  const globalBookTableUrl = siteSettings?.ctaBookTableUrl || "https://allegade10.suitcasebooking.com/da";

  const faqItems = (page?.faqItems || (page?.sections?.find((s: any) => s._type === "hotelPracticalInfoSection") as any)?.faqItems) as Array<{ question?: string; answer?: string }> | undefined;

  const structuredData: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Hotel",
      name: page?.title || "Hotel Allégade 10",
      url: "https://allegade10.dk/hotel",
      description: page?.heroDescription,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Allégade 10",
        addressLocality: "Frederiksberg",
        postalCode: "2000",
        addressCountry: "DK",
      },
      ...(siteSettings?.phone && { telephone: siteSettings.phone }),
      ...(siteSettings?.email && { email: siteSettings.email }),
      ...((siteSettings as any)?.ctaBookStayUrl && {
        reservations: (siteSettings as any).ctaBookStayUrl,
      }),
      ...(rooms.length > 0 && {
        containsPlace: rooms.map((room: any) => ({
          "@type": "HotelRoom",
          name: room.title,
          ...(room.description && { description: room.description }),
          ...(room.slug?.current && {
            url: `https://allegade10.dk/hotel/vaerelser/${room.slug.current}`,
          }),
          ...(room.image?.asset && {
            image: urlFor(room.image).width(1200).height(800).url(),
          }),
          ...(room.pricePerNight && {
            offers: {
              "@type": "Offer",
              price: room.pricePerNight,
              priceCurrency: "DKK",
              availability: "https://schema.org/InStock",
            },
          }),
        })),
      }),
    },
  ];

  if (faqItems?.length) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item: any) => {
        const answerText = Array.isArray(item.answer)
          ? (item.answer as TypedObject[])
              .flatMap((block: any) => block.children?.map((span: any) => span.text) ?? [])
              .join(" ")
          : (item.answer as string | undefined) ?? "";
        return {
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: answerText },
        };
      }),
    });
  }

  const hasSections = page?.sections && page.sections.length > 0;

  if (!hasSections && page) {
    return (
      <main>
        <StructuredData data={structuredData} />
        <HotelHero
          heroImage={page.heroImage}
          heroHeading={page.heroHeading}
          heroHeadingItalic={page.heroHeadingItalic}
          heroDescription={page.heroDescription}
          heroStats={page.heroStats}
          heroPrimaryCtaLabel={page.heroPrimaryCtaLabel}
          heroPrimaryCtaUrl={page.heroPrimaryCtaUrl}
          heroSecondaryCtaLabel={page.heroSecondaryCtaLabel}
          heroSecondaryCtaUrl={page.heroSecondaryCtaUrl}
          heroFloatingStarText={page.heroFloatingStarText}
          heroFloatingSubtext={page.heroFloatingSubtext}
          bookingCtaUrl={page.bookingCtaUrl}
          breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
        />
        <HotelFacilities
          facilitiesHeading={page.facilitiesHeading}
          facilitiesHeadingItalic={page.facilitiesHeadingItalic}
          facilitiesDescription={page.facilitiesDescription}
          facilities={page.facilities}
        />
        <HotelRoomShowcase
          roomShowcaseHeading={page.roomShowcaseHeading}
          rooms={rooms}
          bookingCtaUrl={page.bookingCtaUrl}
        />
        <HotelPracticalInfo
          practicalInfoHeading={page.practicalInfoHeading}
          practicalInfoHeadingItalic={page.practicalInfoHeadingItalic}
          faqItems={page.faqItems}
        />
        <HotelNeighborhood
          neighborhoodHeading={page.neighborhoodHeading}
          neighborhoodHeadingItalic={page.neighborhoodHeadingItalic}
          neighborhoodAddress={page.neighborhoodAddress}
          neighborhoodCity={page.neighborhoodCity}
          neighborhoodMapUrl={page.neighborhoodMapUrl}
          neighborhoodItems={page.neighborhoodItems}
          mapEyebrow={page.mapEyebrow}
          directionsLabel={page.directionsLabel}
        />
        <HotelRestaurantTeaser
          restaurantEyebrow={page.restaurantEyebrow}
          restaurantHeading={page.restaurantHeading}
          restaurantHeadingItalic={page.restaurantHeadingItalic}
          restaurantDescription={page.restaurantDescription}
          restaurantCtaLabel={page.restaurantCtaLabel}
          restaurantCtaUrl={page.restaurantCtaUrl}
          restaurantImage={page.restaurantImage}
        />
      </main>
    );
  }

  return (
    <main>
      <StructuredData data={structuredData} />
      <SectionRenderer
        documentId={page?._id ?? "hotelPage"}
        documentType={page?._type ?? "hotelPage"}
        sections={page?.sections}
        rooms={rooms}
        globalBookTableUrl={globalBookTableUrl}
        breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
      />
    </main>
  );
}
