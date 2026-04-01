import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import EventsHero from "@/components/sections/EventsHero";
import EventsList from "@/components/sections/EventsList";
import EventsArchive from "@/components/sections/EventsArchive";
import { SectionRenderer } from "@/components/sections";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "page": *[_type == "eventsPage"][0]{
    _id,
    _type,
    title,
    seo,
    sections[]{
      ...,
      ${SECTIONS_QUERY_FRAGMENT}
    },
    // Fallbacks
    heroEyebrow, heroHeading, heroHeadingItalic, heroDescription, heroCtaLabel,
    upcomingHeading, emptyStateHeading, emptyStateText,
    freeLabel, archiveEyebrow, archiveHeading
  },
  "events": *[_type == "event" && defined(slug.current)] | order(startDate asc){
    _id, title, slug, startDate, endDate, price, priceDescription, category, excerpt,
    image{ ..., asset-> },
    "venue": venue->{ name }
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    breadcrumbHomeLabel
  }
}`;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: any; siteSettings: any };
  const page = result?.page;
  const siteSettings = result?.siteSettings;

  const seo = page?.seo;
  const title = seo?.metaTitle || page?.title || "Begivenheder";
  const description = seo?.metaDescription || page?.heroDescription || "Oplev begivenheder på Allégade 10";
  const ogImage = seo?.shareImage ? urlFor(seo.shareImage).width(1200).height(630).url() : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: { title, description, images: ogImage ? [{ url: ogImage }] : [] },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BegivenhedPage() {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: any; events: any[]; siteSettings: any } | null;
  const page = result?.page;
  const events = result?.events ?? [];
  const breadcrumbHomeLabel = result?.siteSettings?.breadcrumbHomeLabel;

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.startDate) >= now);
  const pastEvents = events.filter((e) => new Date(e.startDate) < now).reverse();
  const featuredEvent = upcomingEvents[0];

  const hasSections = page?.sections && page.sections.length > 0;

  if (!hasSections && page) {
    return (
      <main>
        <EventsHero
          heroHeading={page.heroHeading}
          heroHeadingItalic={page.heroHeadingItalic}
          heroDescription={page.heroDescription}
          heroCtaLabel={page.heroCtaLabel}
          featuredEvent={featuredEvent}
          breadcrumbHomeLabel={breadcrumbHomeLabel}
        />
        <EventsList
          upcomingHeading={page.upcomingHeading}
          emptyStateHeading={page.emptyStateHeading}
          emptyStateText={page.emptyStateText}
          freeLabel={page.freeLabel}
          upcomingEvents={upcomingEvents}
        />
        <EventsArchive
          archiveEyebrow={page.archiveEyebrow}
          archiveHeading={page.archiveHeading}
          pastEvents={pastEvents}
        />
      </main>
    );
  }

  return (
    <main>
      <SectionRenderer
        documentId={page?._id ?? "eventsPage"}
        documentType={page?._type ?? "eventsPage"}
        sections={page?.sections}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        featuredEvent={featuredEvent}
        breadcrumbHomeLabel={breadcrumbHomeLabel}
      />
    </main>
  );
}
