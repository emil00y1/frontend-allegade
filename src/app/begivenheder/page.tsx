import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import { SectionRenderer } from "@/components/sections";
import { buttonVariants } from "@/lib/button-variants";
import { type SanityImage, type SanitySlug } from "@/types/sanity";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventsPageData {
  _id: string;
  _type: string;
  heroEyebrow?: string;
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  upcomingHeading?: string;
  emptyStateHeading?: string;
  emptyStateText?: string;
  freeLabel?: string;
  archiveEyebrow?: string;
  archiveHeading?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections?: any[];
}

interface Event {
  _id: string;
  title: string;
  slug: SanitySlug;
  startDate: string;
  endDate?: string;
  price?: number;
  priceDescription?: string;
  category?: string;
  excerpt?: string;
  image?: SanityImage;
  venue?: { name?: string };
}

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "eventsPage": *[_type == "eventsPage"][0]{
    _id,
    _type,
    heroEyebrow, heroHeading, heroHeadingItalic, heroDescription, heroCtaLabel,
    upcomingHeading, emptyStateHeading, emptyStateText,
    freeLabel, archiveEyebrow, archiveHeading,
    ${SECTIONS_QUERY_FRAGMENT}
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BegivenhedPage() {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as {
    eventsPage: EventsPageData | null;
    events: Event[];
    siteSettings: { breadcrumbHomeLabel?: string } | null;
  } | null;
  const page = result?.eventsPage;
  const events = result?.events ?? [];
  const breadcrumbHomeLabel = result?.siteSettings?.breadcrumbHomeLabel;

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.startDate) >= now);
  const pastEvents = events.filter((e) => new Date(e.startDate) < now).reverse();

  const featuredEvent = upcomingEvents[0];
  const featuredImageUrl = featuredEvent?.image?.asset
    ? urlFor(featuredEvent.image).width(1200).height(1600).auto("format").url()
    : null;

  return (
    <main>
      {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
      <section className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white">
        {/* Left: content */}
        <div className="flex flex-col justify-center px-10 lg:px-16 py-20">
          <Breadcrumb current="Begivenheder" homeLabel={breadcrumbHomeLabel} />

          <div className="mb-8">
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
              <span className="font-newsreader font-extralight text-dark-stone block">
                {page?.heroHeading ?? "Begivenheder"}
              </span>
              <span className="font-cormorant font-light italic text-brand block">
                {page?.heroHeadingItalic ?? "på Allégade 10"}
              </span>
            </h1>
          </div>

          <p className="text-warm-brown font-light leading-7 text-base max-w-md mb-10">
            {page?.heroDescription ??
              "Fra intime middage til festlige aftener — oplev Allégade\u00a010\u2019s unikke begivenheder i historiske omgivelser på Frederiksberg."}
          </p>

          <a
            href="#begivenheder"
            className={buttonVariants({ variant: "primary" })}
          >
            {page?.heroCtaLabel ?? "Se alle begivenheder"}
          </a>
        </div>

        {/* Right: featured image */}
        <div className="relative hidden lg:block overflow-hidden bg-warm-gray min-h-[calc(100vh-80px)]">
          {featuredImageUrl ? (
            <Image
              src={featuredImageUrl}
              alt={featuredEvent?.title ?? "Begivenhed på Allégade 10"}
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-warm-gray" />
          )}
        </div>
      </section>

      {/* ── Section 2: Upcoming events ───────────────────────────────────── */}
      <section id="begivenheder" className="bg-warm-gray py-14 md:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-10 lg:px-16">
          <SectionHeading
            eyebrow={`${upcomingEvents.length} ${upcomingEvents.length === 1 ? "kommende begivenhed" : "kommende begivenheder"}`}
            heading={page?.upcomingHeading ?? "Hvad sker der næste gang"}
            className="mb-16"
          />

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => {
                const imageUrl = event.image?.asset
                  ? urlFor(event.image).width(800).height(600).auto("format").url()
                  : null;
                return (
                  <Link
                    key={event._id}
                    href={`/events/${event.slug.current}`}
                    className="group flex flex-col bg-warm-white"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={event.image?.alt || event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-warm-gray" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-3 p-6 flex-1">
                      {event.category && (
                        <span className="text-brand text-[10px] tracking-[1.5px] uppercase font-light">
                          {event.category}
                        </span>
                      )}
                      <h3 className="font-newsreader font-extralight text-xl text-dark-stone leading-snug group-hover:text-brand transition-colors duration-200">
                        {event.title}
                      </h3>
                      {event.excerpt && (
                        <p className="text-warm-brown text-sm font-light leading-6 line-clamp-2">
                          {event.excerpt}
                        </p>
                      )}

                      <div className="border-t border-border-warm/30 mt-auto pt-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5 text-brand shrink-0" strokeWidth={1.5} />
                          <span className="text-warm-brown text-xs font-light">
                            {formatDate(event.startDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-brand shrink-0" strokeWidth={1.5} />
                          <span className="text-warm-brown text-xs font-light">
                            {formatTime(event.startDate)}
                          </span>
                        </div>
                        {event.price != null && (
                          <p className="text-dark-stone text-sm font-light mt-1">
                            {event.price === 0 ? (page?.freeLabel ?? "Gratis") : `${event.price} kr.`}
                            {event.priceDescription && (
                              <span className="text-warm-brown/70 text-xs ml-1">
                                — {event.priceDescription}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="border border-border-warm/20 py-20 text-center">
              <p className="font-newsreader font-extralight text-2xl text-dark-stone mb-3">
                {page?.emptyStateHeading ?? "Ingen kommende begivenheder"}
              </p>
              <p className="text-warm-brown text-sm font-light">
                {page?.emptyStateText ?? "Følg med her — nye events annonceres løbende."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 3: Past events ───────────────────────────────────────── */}
      {pastEvents.length > 0 && (
        <section className="bg-warm-white py-14 md:py-24 lg:py-32">
          <div className="max-w-6xl mx-auto px-10 lg:px-16">
            <div className="mb-16">
              <p className="text-[10px] tracking-[2px] uppercase text-warm-brown/50 mb-4">
                {page?.archiveEyebrow ?? "Arkiv"}
              </p>
              <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] text-dark-stone/60 leading-tight">
                {page?.archiveHeading ?? "Tidligere begivenheder"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {pastEvents.map((event) => {
                const imageUrl = event.image?.asset
                  ? urlFor(event.image).width(600).height(400).auto("format").url()
                  : null;
                return (
                  <Link
                    key={event._id}
                    href={`/events/${event.slug.current}`}
                    className="group flex flex-col opacity-60 hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden bg-warm-gray grayscale group-hover:grayscale-0 transition-all duration-500">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={event.image?.alt || event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-warm-gray" />
                      )}
                    </div>
                    <div className="pt-4 flex flex-col gap-1.5">
                      {event.category && (
                        <span className="text-warm-brown/60 text-[10px] tracking-[1px] uppercase font-light">
                          {event.category}
                        </span>
                      )}
                      <h3 className="font-newsreader font-extralight text-base text-dark-stone leading-snug">
                        {event.title}
                      </h3>
                      <span className="text-warm-brown/60 text-xs font-light">
                        {formatDate(event.startDate)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <SectionRenderer
        documentId={page?._id ?? "eventsPage"}
        documentType={page?._type ?? "eventsPage"}
        sections={page?.sections}
      />
    </main>
  );
}
