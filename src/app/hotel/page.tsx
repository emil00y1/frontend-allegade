import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import dynamic from "next/dynamic";
import { HotelFaqAccordion } from "@/components/HotelFaqAccordion";
import { type HotelRoom } from "@/components/RoomCarousel";
import { type SiteSettings } from "@/types/sanity";

const RoomCarousel = dynamic(() => import("@/components/RoomCarousel"));
const HotelMap = dynamic(() => import("@/components/HotelMap"));
import { createDataAttribute } from "next-sanity";
import Breadcrumb from "@/components/Breadcrumb";
import { SectionRenderer } from "@/components/sections";
import { buttonVariants } from "@/lib/button-variants";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroStat {
  _key: string;
  label?: string;
  value?: string;
}

interface Facility {
  _key: string;
  icon?: { asset?: { _ref: string } };
  title?: string;
  description?: string;
}

interface FaqItem {
  _key: string;
  question?: string;
  answer?: string;
}

interface NeighborhoodItem {
  _key: string;
  title?: string;
  walkTime?: string;
  description?: string;
}

interface HotelPageDocument {
  _id: string;
  _type: string;
  // Hero
  heroImage?: { asset?: { _ref: string } };
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroStats?: HeroStat[];
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaUrl?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaUrl?: string;
  heroFloatingStarText?: string;
  heroFloatingSubtext?: string;
  // Booking
  bookingCtaLabel?: string;
  bookingCtaUrl?: string;
  // Facilities
  facilitiesHeading?: string;
  facilitiesHeadingItalic?: string;
  facilitiesDescription?: string;
  facilities?: Facility[];
  // Room Showcase
  roomShowcaseHeading?: string;
  // Practical Info
  practicalInfoHeading?: string;
  practicalInfoHeadingItalic?: string;
  faqItems?: FaqItem[];
  // Neighborhood
  neighborhoodHeading?: string;
  neighborhoodHeadingItalic?: string;
  neighborhoodAddress?: string;
  neighborhoodCity?: string;
  neighborhoodMapUrl?: string;
  neighborhoodItems?: NeighborhoodItem[];
  mapEyebrow?: string;
  directionsLabel?: string;
  // Restaurant
  restaurantEyebrow?: string;
  restaurantHeading?: string;
  restaurantHeadingItalic?: string;
  restaurantDescription?: string;
  restaurantCtaLabel?: string;
  restaurantCtaUrl?: string;
  restaurantImage?: { asset?: { _ref: string } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections?: any[];
}

interface QueryResult {
  page: HotelPageDocument | null;
  siteSettings: SiteSettings | null;
  rooms: HotelRoom[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const HOTEL_PAGE_QUERY = `{
  "page": *[_type == "hotelPage"][0]{
    _id,
    _type,
    heroImage{ ..., asset-> },
    heroHeading,
    heroHeadingItalic,
    heroDescription,
    heroStats[]{ _key, label, value },
    heroPrimaryCtaLabel,
    heroPrimaryCtaUrl,
    heroSecondaryCtaLabel,
    heroSecondaryCtaUrl,
    heroFloatingStarText,
    heroFloatingSubtext,
    bookingCtaLabel,
    bookingCtaUrl,
    facilitiesHeading,
    facilitiesHeadingItalic,
    facilitiesDescription,
    facilities[]{ _key, icon{ ..., asset-> }, title, description },
    roomShowcaseHeading,
    practicalInfoHeading,
    practicalInfoHeadingItalic,
    faqItems[]{ _key, question, answer },
    neighborhoodHeading,
    neighborhoodHeadingItalic,
    neighborhoodAddress,
    neighborhoodCity,
    neighborhoodMapUrl,
    neighborhoodItems[]{ _key, title, walkTime, description },
    mapEyebrow,
    directionsLabel,
    restaurantEyebrow,
    restaurantHeading,
    restaurantHeadingItalic,
    restaurantDescription,
    restaurantCtaLabel,
    restaurantCtaUrl,
    restaurantImage{ ..., asset-> },
    ${SECTIONS_QUERY_FRAGMENT}
  },
  "rooms": *[_type == "hotelRoom"] | order(order asc, title asc){
    _id,
    title,
    roomType,
    pricePerNight,
    priceLabel,
    description,
    note,
    features,
    ctaLabel,
    ctaUrl,
    image{ ..., asset-> },
    gallery[]{ ..., asset-> }
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    address, phone, email, footerDescription, socialLinks,
    restaurantHours, kitchenHours,
    newsletterLabel, newsletterSubtext, newsletterButtonLabel,
    breadcrumbHomeLabel
  }
}`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HotelPage() {
  const { data } = await sanityFetch({ query: HOTEL_PAGE_QUERY });
  const isDraftMode = (await draftMode()).isEnabled;
  const result = data as QueryResult | null;
  const page = result?.page;
  const siteSettings = result?.siteSettings;
  const rooms = result?.rooms ?? [];

  const heroImageUrl = page?.heroImage
    ? urlFor(page.heroImage).width(1400).height(1800).auto("format").url()
    : null;

  const primaryCtaUrl =
    page?.heroPrimaryCtaUrl ??
    page?.bookingCtaUrl ??
    "https://allegade10.suitcasebooking.com/da";
  const primaryCtaLabel = page?.heroPrimaryCtaLabel ?? "Book ophold";
  const secondaryCtaUrl = page?.heroSecondaryCtaUrl ?? "#vaerelser";
  const secondaryCtaLabel = page?.heroSecondaryCtaLabel ?? "Se værelser";

  return (
    <main>
      {/* ── Section 1: Hero (Split Asymmetric) ─────────────────────────── */}
      <section className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white">
        {/* Left: Content */}
        <div className="flex flex-col justify-center px-10 lg:px-16 py-20">
          <Breadcrumb
            current="Hotel"
            homeLabel={siteSettings?.breadcrumbHomeLabel}
          />

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
              <span className="font-newsreader font-extralight text-dark-stone block">
                {page?.heroHeading ?? "Overnat i hjertet af"}
              </span>
              <span className="font-cormorant font-light italic text-brand block">
                {page?.heroHeadingItalic ?? "Frederiksberg"}
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-warm-brown font-light leading-7 text-base max-w-md mb-10">
            {page?.heroDescription ??
              "Oplev atmosfæren i en af Københavns ældste bygninger. Vores hotel kombinerer 1780'ernes historiske charme med moderne komfort."}
          </p>

          {/* Stats grid */}
          {page?.heroStats && page.heroStats.length > 0 && (
            <div className="border-t border-b border-border-warm/30 py-6 mb-10 grid grid-cols-2 sm:grid-cols-3 gap-y-6">
              {page.heroStats.map((stat: HeroStat) => (
                <div key={stat._key} className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-[1px] uppercase text-warm-brown/60">
                    {stat.label}
                  </span>
                  <span className="font-newsreader font-extralight text-xl text-dark-stone">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={primaryCtaUrl}
              target={primaryCtaUrl?.startsWith("http") ? "_blank" : undefined}
              rel={
                primaryCtaUrl?.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className={buttonVariants({ variant: "primary" })}
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaUrl}
              className={buttonVariants({ variant: "secondary" })}
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative hidden lg:block min-h-[calc(100vh-80px)] overflow-hidden">
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={page?.heroHeading ?? "Hotel"}
              fill
              sizes="50vw"
              className="object-cover object-center"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-warm-gray" />
          )}
          {/* Top gradient for header legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Floating card */}
          {(page?.heroFloatingStarText || page?.heroFloatingSubtext) && (
            <div className="absolute bottom-12 left-12 bg-warm-white px-8 py-6 shadow-2xl">
              {page.heroFloatingStarText && (
                <p className="font-cormorant font-light italic text-brand text-2xl leading-none mb-2">
                  {page.heroFloatingStarText}
                </p>
              )}
              {page.heroFloatingSubtext && (
                <p className="text-[10px] tracking-[1px] uppercase text-warm-brown">
                  {page.heroFloatingSubtext}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Section 3: Facilities ───────────────────────────────────────── */}
      {page?.facilities && page.facilities.length > 0 && (
        <section className="bg-warm-white px-10 lg:px-16 py-14 md:py-24 lg:py-32">
          <div className="max-w-6xl mx-auto">
            {/* Heading row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-20">
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-none">
                <span className="font-newsreader font-extralight text-dark-stone">
                  {page.facilitiesHeading ?? "Faciliteter "}
                </span>
                <span className="font-cormorant font-light italic text-brand-mid">
                  {page.facilitiesHeadingItalic ?? "& Bekvemmeligheder"}
                </span>
              </h2>
              {page.facilitiesDescription && (
                <p className="text-warm-brown text-base leading-6 max-w-sm font-light">
                  {page.facilitiesDescription}
                </p>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-16">
              {page.facilities.map((f: Facility) => {
                const iconUrl = f.icon?.asset
                  ? urlFor(f.icon).width(56).height(56).url()
                  : null;
                return (
                  <div key={f._key} className="flex flex-col gap-0">
                    {iconUrl ? (
                      <div className="w-7 h-7 mb-[28px] relative shrink-0">
                        <Image
                          src={iconUrl}
                          alt={f.title ?? ""}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 mb-[28px] bg-border-warm/40 rounded-sm" />
                    )}
                    <h3 className="text-[12px] tracking-[1.2px] uppercase font-bold text-dark-stone mb-2">
                      {f.title}
                    </h3>
                    {f.description && (
                      <p className="text-warm-brown text-sm leading-[1.625] font-light">
                        {f.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 4: Room Carousel ────────────────────────────────────── */}
      <RoomCarousel
        rooms={rooms}
        bookingCtaUrl={page?.bookingCtaUrl}
        sectionHeading={page?.roomShowcaseHeading}
      />

      {/* ── Section 5: Practical Info (FAQ) ────────────────────────────── */}
      {page?.faqItems && page.faqItems.length > 0 && (
        <section className="bg-warm-white px-10 lg:px-16 py-14 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] text-center mb-16 leading-none">
              <span className="font-newsreader font-extralight text-dark-stone">
                {page.practicalInfoHeading ?? "Godt at "}{" "}
              </span>
              <span className="font-cormorant font-light italic text-dark-stone">
                {page.practicalInfoHeadingItalic ?? "Vide"}
              </span>
            </h2>
            <HotelFaqAccordion items={page.faqItems} />
          </div>
        </section>
      )}

      {/* ── Section 6: Location ──────────────────────────────────────────── */}
      <section className="bg-warm-gray grid lg:grid-cols-2">
        {/* Left: Full-bleed map */}
        <HotelMap
          src={
            page?.neighborhoodMapUrl ??
            "https://www.openstreetmap.org/export/embed.html?bbox=12.5229%2C55.6710%2C12.5429%2C55.6810&layer=mapnik&marker=55.67597%2C12.53295"
          }
        />

        {/* Right: Location info */}
        <div className="flex flex-col justify-center px-12 lg:px-24 py-24">
          {/* Eyebrow */}
          <p className="text-[10px] tracking-[2px] uppercase text-warm-brown mb-8">
            {page?.mapEyebrow ?? "Beliggenhed"}
          </p>

          {/* Address as headline */}
          <div className="mb-2">
            <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] text-dark-stone leading-none">
              {page?.neighborhoodAddress ?? "Allégade 10"}
            </h2>
            <p className="font-cormorant font-light italic text-brand text-xl mt-2">
              {page?.neighborhoodCity ?? "2000 Frederiksberg"}
            </p>
          </div>

          <div className="w-10 h-px bg-border-warm/40 my-8" />

          {/* Neighborhood items (if populated in CMS) */}
          {page?.neighborhoodItems && page.neighborhoodItems.length > 0 && (
            <>
              {(page.neighborhoodHeading || page.neighborhoodHeadingItalic) && (
                <p className="text-[10px] tracking-[1.5px] uppercase text-warm-brown/70 mb-6">
                  {page.neighborhoodHeading} {page.neighborhoodHeadingItalic}
                </p>
              )}
              <ul className="flex flex-col gap-8 mb-10">
                {page.neighborhoodItems.map((item: NeighborhoodItem) => (
                  <li key={item._key} className="flex gap-6 items-start">
                    <div className="mt-0.5 shrink-0 text-warm-brown/50">
                      <svg
                        width="14"
                        height="18"
                        viewBox="0 0 16 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 0C3.589 0 0 3.589 0 8c0 5.25 8 12 8 12S16 13.25 16 8c0-4.411-3.589-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center gap-4">
                        <h3 className="text-[11px] tracking-[1.2px] uppercase font-bold text-dark-stone shrink-0">
                          {item.title}
                        </h3>
                        <div className="flex-1 h-px bg-border-warm/30" />
                        {item.walkTime && (
                          <span className="font-cormorant font-light italic text-sm text-dark-stone shrink-0">
                            {item.walkTime}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-warm-brown text-sm leading-5 font-light">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Directions CTA */}
          <a
            href="https://maps.google.com/?q=Allégade+10,+2000+Frederiksberg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-[11px] tracking-[1.5px] uppercase text-dark-stone border-b border-dark-stone/30 pb-0.5 w-fit hover:border-dark-stone transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-brand"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
                fill="currentColor"
              />
            </svg>
            {page?.directionsLabel ?? "Få vejledning"}
          </a>
        </div>
      </section>

      {/* ── Section 7: Restaurant Cross-Sell ────────────────────────────── */}
      {(page?.restaurantHeading || page?.restaurantImage) && (
        <section className="bg-warm-white border-t border-b border-border-warm/20 px-10 lg:px-16 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="bg-warm-gray p-8">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                {/* Image */}
                {page.restaurantImage?.asset && (
                  <div
                    className="relative shrink-0 w-full md:w-72 aspect-[3/2] md:aspect-square overflow-hidden"
                    {...(isDraftMode && page._id
                      ? {
                          "data-sanity": createDataAttribute({
                            id: page._id,
                            type: "hotelPage",
                            path: "restaurantImage",
                          }).toString(),
                        }
                      : {})}
                  >
                    <Image
                      src={urlFor(page.restaurantImage)
                        .width(600)
                        .height(600)
                        .auto("format")
                        .url()}
                      alt="Restaurant"
                      fill
                      sizes="(max-width: 768px) 100vw, 18rem"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Text */}
                <div className="flex flex-col gap-6">
                  {/* Eyebrow */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-brand" />
                    <span className="text-[10px] tracking-[1px] uppercase font-bold text-brand">
                      {page.restaurantEyebrow ?? "Gastronomi"}
                    </span>
                  </div>

                  <h2 className="text-[clamp(1.5rem,2.5vw,1.875rem)] leading-tight">
                    <span className="font-newsreader font-extralight text-dark-stone">
                      {page.restaurantHeading ??
                        "Din overnatning er tæt på Frederiksbergs "}{" "}
                    </span>
                    <span className="font-cormorant font-light italic text-dark-stone">
                      {page.restaurantHeadingItalic ?? "ældste restaurant"}
                    </span>
                  </h2>

                  {page.restaurantDescription && (
                    <p className="text-warm-brown text-base leading-6 font-light max-w-xl">
                      {page.restaurantDescription}
                    </p>
                  )}

                  <Link
                    href={page.restaurantCtaUrl ?? "/"}
                    className="self-start border-b border-brand pb-1 text-[11px] tracking-[1.1px] uppercase font-bold text-brand hover:opacity-70 transition-opacity"
                  >
                    {page.restaurantCtaLabel ?? "Udforsk Restauranten"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <SectionRenderer
        documentId={page?._id ?? "hotelPage"}
        documentType={page?._type ?? "hotelPage"}
        sections={page?.sections}
      />
    </main>
  );
}
