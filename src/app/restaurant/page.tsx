import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import RestaurantHero from "@/components/sections/RestaurantHero";
import RestaurantStory from "@/components/sections/RestaurantStory";
import RestaurantMenuTeaser from "@/components/sections/RestaurantMenuTeaser";
import RestaurantPhilosophy from "@/components/sections/RestaurantPhilosophy";
import RestaurantGallery from "@/components/sections/RestaurantGallery";
import { SectionRenderer } from "@/components/sections";
import {
  type SiteSettings,
  type SanitySeo,
  type SanityImage,
  type SanitySection,
  type MenuServiceItem,
  type GalleryImage,
  type StatItem,
} from "@/types/sanity";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";
import StructuredData from "@/components/StructuredData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RestaurantPageData {
  _id: string;
  _type: string;
  title?: string;
  seo?: SanitySeo;
  sections?: SanitySection[];
  // Legacy fields for fallback
  heroImage?: SanityImage;
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroBookCtaLabel?: string;
  heroBookCtaUrl?: string;
  heroMenuCtaLabel?: string;
  heroMenuCtaUrl?: string;
  storyImage?: SanityImage;
  storyEyebrow?: string;
  storyHeading?: string;
  storyBody?: string;
  storyStats?: StatItem[];
  menuTeaserEyebrow?: string;
  menuTeaserHeading?: string;
  menuTeaserDescription?: string;
  menuServices?: MenuServiceItem[];
  menuCtaLabel?: string;
  menuCtaUrl?: string;
  philosophyImage?: SanityImage;
  philosophyQuote?: string;
  philosophyAttribution?: string;
  galleryHeading?: string;
  galleryImages?: GalleryImage[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "restaurantPage": *[_type == "restaurantPage"][0]{
    _id,
    _type,
    title,
    seo,
    sections[]{
      ...,
      _type == "restaurantHeroSection" => { ..., heroImage{ ..., asset-> } },
      _type == "restaurantStorySection" => { ..., storyImage{ ..., asset-> } },
      _type == "restaurantMenuTeaserSection" => { ..., menuServices[]{ ..., image{ ..., asset-> } } },
      _type == "restaurantPhilosophySection" => { ..., philosophyImage{ ..., asset-> } },
      _type == "restaurantGallerySection" => { ..., galleryImages[]{ ..., asset-> } },
      ${SECTIONS_QUERY_FRAGMENT}
    },
    // Fallbacks
    heroImage{ ..., asset-> },
    heroHeading, heroHeadingItalic, heroDescription,
    heroBookCtaLabel, heroBookCtaUrl, heroMenuCtaLabel, heroMenuCtaUrl,
    storyImage{ ..., asset-> },
    storyEyebrow, storyHeading, storyBody,
    storyStats[]{ _key, value, label },
    menuTeaserEyebrow, menuTeaserHeading, menuTeaserDescription,
    menuServices[]{ _key, title, timeLabel, description, priceFrom, priceLabel, image{ ..., asset-> } },
    menuCtaLabel, menuCtaUrl,
    philosophyImage{ ..., asset-> },
    philosophyQuote, philosophyAttribution,
    galleryHeading,
    galleryImages[]{ ..., asset->, alt }
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    address, phone, email, footerDescription, socialLinks,
    restaurantHours, kitchenClosingNote, ctaBookTableUrl,
    newsletterLabel, newsletterSubtext, newsletterButtonLabel,
    breadcrumbHomeLabel
  }
}`;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { restaurantPage: RestaurantPageData | null; siteSettings: SiteSettings | null };
  const page = result?.restaurantPage;
  const siteSettings = result?.siteSettings;

  const seo = page?.seo;
  const title = seo?.metaTitle || page?.title || "Restaurant";
  const description = seo?.metaDescription || page?.heroDescription || siteSettings?.footerDescription;
  const ogImage = seo?.shareImage 
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : page?.heroImage 
      ? urlFor(page.heroImage).width(1200).height(630).url()
      : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RestaurantPage() {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as {
    restaurantPage: RestaurantPageData | null;
    siteSettings: SiteSettings | null;
  } | null;

  const page = result?.restaurantPage;
  const siteSettings = result?.siteSettings;

  const globalBookTableUrl =
    siteSettings?.ctaBookTableUrl ||
    "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";

  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: page?.title || "Restaurant Allégade 10",
    url: "https://allegade10.dk/restaurant",
    description: page?.heroDescription,
    servesCuisine: "Danish",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Allégade 10",
      addressLocality: "Frederiksberg",
      postalCode: "2000",
      addressCountry: "DK",
    },
    ...(siteSettings?.phone && { telephone: siteSettings.phone }),
    ...(siteSettings?.email && { email: siteSettings.email }),
    ...(siteSettings?.restaurantHours && {
      openingHoursSpecification: siteSettings.restaurantHours.map((h: any) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days || h.label,
        opens: h.hours?.split(" - ")?.[0]?.replace(".", ":"),
        closes: h.hours?.split(" - ")?.[1]?.replace(".", ":"),
      })),
    }),
    acceptsReservations: true,
    ...(globalBookTableUrl && { reservations: globalBookTableUrl }),
    menu: "https://allegade10.dk/menukort",
    ...(page?.heroImage?.asset && {
      image: urlFor(page.heroImage).width(1200).height(800).url(),
    }),
  };

  const hasSections = page?.sections && page.sections.length > 0;

  if (!hasSections && page) {
    return (
      <main>
        <StructuredData data={restaurantSchema} />
        <RestaurantHero
          heroImage={page.heroImage}
          heroHeading={page.heroHeading}
          heroHeadingItalic={page.heroHeadingItalic}
          heroDescription={page.heroDescription}
          heroBookCtaLabel={page.heroBookCtaLabel}
          heroBookCtaUrl={page.heroBookCtaUrl}
          heroMenuCtaLabel={page.heroMenuCtaLabel}
          heroMenuCtaUrl={page.heroMenuCtaUrl}
          breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
          globalBookTableUrl={globalBookTableUrl}
        />
        <RestaurantStory
          storyImage={page.storyImage}
          storyEyebrow={page.storyEyebrow}
          storyHeading={page.storyHeading}
          storyBody={page.storyBody}
          storyStats={page.storyStats}
        />
        <RestaurantMenuTeaser
          menuTeaserEyebrow={page.menuTeaserEyebrow}
          menuTeaserHeading={page.menuTeaserHeading}
          menuTeaserDescription={page.menuTeaserDescription}
          menuServices={page.menuServices}
          menuCtaLabel={page.menuCtaLabel}
          menuCtaUrl={page.menuCtaUrl}
        />
        <RestaurantPhilosophy
          philosophyImage={page.philosophyImage}
          philosophyQuote={page.philosophyQuote}
          philosophyAttribution={page.philosophyAttribution}
        />
        <RestaurantGallery
          galleryHeading={page.galleryHeading}
          galleryImages={page.galleryImages}
        />
        <SectionRenderer
          documentId={page._id}
          documentType={page._type}
          sections={page.sections}
        />
      </main>
    );
  }

  return (
    <main>
      <StructuredData data={restaurantSchema} />
      <SectionRenderer
        documentId={page?._id ?? "restaurantPage"}
        documentType={page?._type ?? "restaurantPage"}
        sections={page?.sections}
        globalBookTableUrl={globalBookTableUrl}
        breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
      />
    </main>
  );
}
