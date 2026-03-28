import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import dynamic from "next/dynamic";
import { type Occasion } from "@/components/SelskaberOccasionTabs";
import Breadcrumb from "@/components/Breadcrumb";
import { SectionRenderer } from "@/components/sections";
import { buttonVariants } from "@/lib/button-variants";
import { type SanityImage, type SiteSettings } from "@/types/sanity";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";

const SelskaberOccasionTabs = dynamic(() => import("@/components/SelskaberOccasionTabs"));
const SelskaberInquiryForm = dynamic(() => import("@/components/SelskaberInquiryForm"));
const VenueCarousel = dynamic(() => import("@/components/VenueCarousel"));

// ─── Types ────────────────────────────────────────────────────────────────────

interface Venue {
  _key: string;
  name?: string;
  capacity?: string;
  image?: SanityImage;
}

interface SelskaberPageData {
  _id: string;
  _type: string;
  breadcrumbLabel?: string;
  heroImage?: SanityImage;
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  heroMenuCtaLabel?: string;
  heroMenuCtaUrl?: string;
  occasions?: Occasion[];
  venueEyebrow?: string;
  venueHeading?: string;
  venueCtaLabel?: string;
  venues?: Venue[];
  menuEyebrow?: string;
  menuHeading?: string;
  menuDescription?: string;
  menuPdfUrl?: string;
  menuPdfFallbackLabel?: string;
  menuCardFallbackLabel?: string;
  ctaBannerImage?: SanityImage;
  ctaBannerHeading?: string;
  ctaBannerButtonLabel?: string;
  formHeading?: string;
  formDescription?: string;
  formPhone?: string;
  formEmail?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections?: any[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "selskaberPage": *[_type == "selskaberPage"][0]{
    _id,
    _type,
    breadcrumbLabel,
    heroImage{ ..., asset-> },
    heroHeading,
    heroHeadingItalic,
    heroDescription,
    heroCtaLabel,
    heroMenuCtaLabel,
    heroMenuCtaUrl,
    occasions[]{ _key, label, heading, description, capacity, facilities, image{ ..., asset-> } },
    venueEyebrow,
    venueHeading,
    venueCtaLabel,
    venues[]{ _key, name, capacity, description, image{ ..., asset-> } },
    menuEyebrow,
    menuHeading,
    menuDescription,
    menuPdfUrl,
    menuPdfFallbackLabel,
    menuCardFallbackLabel,
    ctaBannerImage{ ..., asset-> },
    ctaBannerHeading,
    ctaBannerButtonLabel,
    formHeading,
    formDescription,
    formPhone,
    formEmail,
    ${SECTIONS_QUERY_FRAGMENT}
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    address, phone, email, footerDescription, socialLinks,
    restaurantHours, kitchenHours,
    newsletterLabel, newsletterSubtext, newsletterButtonLabel,
    breadcrumbHomeLabel
  }
}`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SelskaberPage() {
  const { data } = await sanityFetch({ query: QUERY });
  const page = data?.selskaberPage as SelskaberPageData | null;
  const siteSettings = data?.siteSettings as SiteSettings | null;

  const heroImageUrl = page?.heroImage?.asset
    ? urlFor(page.heroImage).width(1200).height(900).auto("format").url()
    : null;

  const ctaBannerImageUrl = page?.ctaBannerImage?.asset
    ? urlFor(page.ctaBannerImage).width(1600).height(800).auto("format").url()
    : null;

  const occasions: Occasion[] = page?.occasions ?? [];
  const venues: Venue[] = page?.venues ?? [];

  const occasionLabels =
    occasions.length > 0
      ? (occasions.map((o) => o.label).filter(Boolean) as string[])
      : undefined;

  return (
    <main className="bg-warm-white min-h-[calc(100vh-80px)]">
      {/* ── Section 1: Hero ─────────────────────────────────────────── */}
      <section className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white">
        {/* Left */}
        <div className="flex flex-col justify-center px-10 lg:px-16 py-20">
          <Breadcrumb current={page?.breadcrumbLabel ?? "Selskaber"} homeLabel={siteSettings?.breadcrumbHomeLabel} />

          <div className="mb-8">
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
              <span className="font-newsreader font-extralight text-dark-stone block">
                {page?.heroHeading ?? "Fejr jeres næste"}
              </span>
              <span className="font-cormorant font-light italic text-brand block">
                {page?.heroHeadingItalic ?? "begivenhed hos os"}
              </span>
            </h1>
          </div>

          <p className="text-warm-brown font-light leading-7 text-base max-w-md mb-10">
            {page?.heroDescription ??
              "Siden 1780 har Allégade 10 dannet rammen om livets store øjeblikke. Fra intime middage til de helt store fester."}
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#foresporgsel" className={buttonVariants({ variant: "primary" })}>
              {page?.heroCtaLabel ?? "Send en forespørgsel"}
            </a>
            {(page?.heroMenuCtaUrl || page?.heroMenuCtaLabel) && (
              <Link
                href={page?.heroMenuCtaUrl ?? "/menukort"}
                className={buttonVariants({ variant: "secondary" })}
              >
                {page?.heroMenuCtaLabel ?? "Se selskabsmenuer"}
              </Link>
            )}
          </div>
        </div>

        {/* Right: image */}
        <div className="relative hidden lg:block overflow-hidden bg-warm-gray min-h-[calc(100vh-80px)]">
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={page?.heroHeading ?? "Selskaber"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-warm-gray" />
          )}
        </div>
      </section>

      {/* ── Section 2: Occasion tabs ─────────────────────────────────── */}
      <SelskaberOccasionTabs occasions={occasions} />

      {/* ── Section 3: Venue carousel ────────────────────────────────── */}
      {(venues.length > 0 || page?.venueHeading) && (
        <VenueCarousel
          venues={venues.map((v) => ({
            _key: v._key,
            name: v.name,
            capacity: v.capacity,
            imageUrl: v.image?.asset
              ? urlFor(v.image).width(800).height(534).auto("format").url()
              : null,
          }))}
          eyebrow={page?.venueEyebrow}
          heading={page?.venueHeading ?? "Vores Selskabslokaler"}
          ctaLabel={page?.venueCtaLabel ?? "Forespørg om lokalet"}
        />
      )}

      {/* ── Section 4: Menu overview ─────────────────────────────────── */}
      {(page?.menuHeading || page?.menuDescription) && (
        <section className="bg-[#eae7e7] py-14 md:py-24 lg:py-32 px-10 lg:px-16">
          <div className="max-w-2xl mx-auto text-center">
            {page.menuEyebrow && (
              <p className="font-cormorant font-light italic text-brand text-2xl mb-4">
                {page.menuEyebrow}
              </p>
            )}
            {page.menuHeading && (
              <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] text-dark-stone leading-tight mb-6">
                {page.menuHeading}
              </h2>
            )}
            {page.menuDescription && (
              <p className="text-warm-brown font-light leading-7 text-base mb-10 max-w-xl mx-auto">
                {page.menuDescription}
              </p>
            )}
            {page.menuPdfUrl ? (
              <a
                href={page.menuPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "dark", size: "lg" })}
              >
                {page.menuPdfFallbackLabel ?? "Se selskabsmenuer (PDF)"}
              </a>
            ) : (
              <Link
                href="/menukort"
                className={buttonVariants({ variant: "dark", size: "lg" })}
              >
                {page.menuCardFallbackLabel ?? "Se vores menukort"}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── Section 7: Inquiry form ──────────────────────────────────── */}
      <SelskaberInquiryForm
        occasionOptions={occasionLabels}
        heading={page?.formHeading}
        description={page?.formDescription}
        phone={page?.formPhone ?? siteSettings?.phone}
        email={page?.formEmail ?? siteSettings?.email}
      />

      <SectionRenderer
        documentId={page?._id ?? "selskaberPage"}
        documentType={page?._type ?? "selskaberPage"}
        sections={page?.sections}
      />
    </main>
  );
}

