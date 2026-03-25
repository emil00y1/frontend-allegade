import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import SelskaberOccasionTabs, {
  type Occasion,
} from "@/components/SelskaberOccasionTabs";
import SelskaberInquiryForm from "@/components/SelskaberInquiryForm";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Venue {
  _key: string;
  name?: string;
  capacity?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
}

interface Feature {
  _key: string;
  label?: string;
  icon?: string;
}

interface SelskaberPageData {
  breadcrumbLabel?: string;
  // Hero
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heroImage?: any;
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  heroMenuCtaLabel?: string;
  heroMenuCtaUrl?: string;
  // Occasions
  occasions?: Occasion[];
  // Venues
  venueEyebrow?: string;
  venueHeading?: string;
  venueCtaLabel?: string;
  venues?: Venue[];
  // Features
  features?: Feature[];
  // Menu section
  menuEyebrow?: string;
  menuHeading?: string;
  menuDescription?: string;
  menuPdfUrl?: string;
  menuPdfFallbackLabel?: string;
  menuCardFallbackLabel?: string;
  // CTA banner
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctaBannerImage?: any;
  ctaBannerHeading?: string;
  ctaBannerButtonLabel?: string;
  // Form
  formHeading?: string;
  formDescription?: string;
  formPhone?: string;
  formEmail?: string;
}

interface SiteSettingsData {
  address?: string;
  phone?: string;
  email?: string;
  footerDescription?: string;
  restaurantHours?: { days?: string; hours: string }[];
  kitchenHours?: { label?: string; hours: string }[];
  socialLinks?: { platform: string; url: string }[];
  breadcrumbHomeLabel?: string;
}

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "selskaberPage": *[_type == "selskaberPage"][0]{
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
    features[]{ _key, label, icon },
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
    formEmail
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    address, phone, email, footerDescription, socialLinks,
    restaurantHours, kitchenHours,
    newsletterLabel, newsletterSubtext, newsletterButtonLabel,
    breadcrumbHomeLabel
  }
}`;

// ─── Feature icons ────────────────────────────────────────────────────────────

function FeatureIcon({ type }: { type?: string }) {
  switch (type) {
    case "bar":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="text-brand"
        >
          <path
            d="M21 5H3l7 9.46V19H8v2h8v-2h-2v-4.54L21 5zM5.88 7h12.24l-1.5 2H7.38L5.88 7z"
            fill="currentColor"
          />
        </svg>
      );
    case "layout":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="text-brand"
        >
          <path
            d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"
            fill="currentColor"
          />
        </svg>
      );
    case "music":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="text-brand"
        >
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" fill="currentColor" />
        </svg>
      );
    case "camera":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="text-brand"
        >
          <path
            d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4zm7-12H9.83L8.59 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
            fill="currentColor"
          />
        </svg>
      );
    case "flower":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="text-brand"
        >
          <path
            d="M12 22a7 7 0 0 0 7-7c0-2.38-1.19-4.47-3-5.74V4a2 2 0 0 0-4 0v5.26C10.19 10.53 9 12.62 9 15a7 7 0 0 0 3 5.74V22h0z"
            fill="currentColor"
          />
        </svg>
      );
    case "star":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="text-brand"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="currentColor"
          />
        </svg>
      );
    default: // "menu" and fallback
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="text-brand"
        >
          <path
            d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8.07-6.76-7.04-15.03-7v7h15.03z"
            fill="currentColor"
          />
        </svg>
      );
  }
}

const DEFAULT_FEATURES: Feature[] = [
  { _key: "f1", label: "Tilpasset menu", icon: "menu" },
  { _key: "f2", label: "Egen bartender", icon: "bar" },
  { _key: "f3", label: "Fleksibel opstilling", icon: "layout" },
  { _key: "f4", label: "Musikmuligheder", icon: "music" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SelskaberPage() {
  const { data } = await sanityFetch({ query: QUERY });
  const page = data?.selskaberPage as SelskaberPageData | null;
  const siteSettings = data?.siteSettings as SiteSettingsData | null;

  const heroImageUrl = page?.heroImage?.asset
    ? urlFor(page.heroImage).width(1200).height(900).auto("format").url()
    : null;

  const ctaBannerImageUrl = page?.ctaBannerImage?.asset
    ? urlFor(page.ctaBannerImage).width(1600).height(800).auto("format").url()
    : null;

  const occasions: Occasion[] = page?.occasions ?? [];
  const venues: Venue[] = page?.venues ?? [];
  const features =
    page?.features && page.features.length > 0
      ? page.features
      : DEFAULT_FEATURES;

  const occasionLabels =
    occasions.length > 0
      ? (occasions.map((o) => o.label).filter(Boolean) as string[])
      : undefined;

  return (
    <main className="bg-warm-white min-h-[calc(100vh-80px)]">
      {/* ── Section 1: Hero ─────────────────────────────────────────── */}
      <section className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        {/* Left */}
        <div className="flex flex-col justify-center px-10 lg:px-16 pt-32 pb-16 lg:pt-40 lg:pb-20">
          <Breadcrumb current={page?.breadcrumbLabel ?? "Selskaber"} homeLabel={siteSettings?.breadcrumbHomeLabel} />

          <h1 className="font-newsreader font-extralight text-[clamp(2.5rem,5vw,4.5rem)] text-dark-stone leading-none mb-3">
            {page?.heroHeading ?? "Fejr jeres næste"}
          </h1>
          <h1 className="font-cormorant font-light italic text-[clamp(2.5rem,5vw,4.5rem)] text-brand leading-none mb-8">
            {page?.heroHeadingItalic ?? "begivenhed hos os"}
          </h1>

          <p className="text-warm-brown font-light leading-7 text-base max-w-md mb-10">
            {page?.heroDescription ??
              "Siden 1780 har Allégade 10 dannet rammen om livets store øjeblikke. Fra intime middage til de helt store fester."}
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#foresporgsel"
              className="px-8 py-4 text-[11px] tracking-[2px] uppercase font-light text-white bg-brand hover:opacity-90 transition-opacity"
            >
              {page?.heroCtaLabel ?? "Send en forespørgsel"}
            </a>
            {(page?.heroMenuCtaUrl || page?.heroMenuCtaLabel) && (
              <Link
                href={page?.heroMenuCtaUrl ?? "/menukort"}
                className="px-8 py-4 text-[11px] tracking-[2px] uppercase font-light text-dark-stone border border-border-warm hover:border-dark-stone/50 transition-colors"
              >
                {page?.heroMenuCtaLabel ?? "Se selskabsmenuer"}
              </Link>
            )}
          </div>
        </div>

        {/* Right: image */}
        <div className="relative min-h-[50vh] lg:min-h-0 overflow-hidden bg-warm-gray">
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={page?.heroHeading ?? "Selskaber"}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[#e5e2e1]" />
          )}
        </div>
      </section>

      {/* ── Section 2: Occasion tabs ─────────────────────────────────── */}
      <SelskaberOccasionTabs occasions={occasions} />

      {/* ── Section 3: Venue cards ───────────────────────────────────── */}
      {(venues.length > 0 || page?.venueHeading) && (
        <section className="bg-warm-white py-24 lg:py-32 px-10 lg:px-16">
          <div className="max-w-6xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-16">
              {page?.venueEyebrow && (
                <p className="font-cormorant font-light italic text-brand text-xl mb-3">
                  {page.venueEyebrow}
                </p>
              )}
              <h2 className="font-newsreader font-extralight text-[clamp(2rem,4vw,3.25rem)] text-dark-stone leading-none">
                {page?.venueHeading ?? "Vores Selskabslokaler"}
              </h2>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-6">
              {(venues.length > 0
                ? venues
                : ([
                    {
                      _key: "sal",
                      name: "Den Store Sal",
                      capacity: "Op til 80 gæster",
                      description:
                        "Vores mest prægtige lokale med højt til loftet, krystallysekroner og udsigt til den historiske have. Perfekt til større selskaber.",
                    },
                    {
                      _key: "salon",
                      name: "Den Private Salon",
                      capacity: "Op til 24 gæster",
                      description:
                        "En intim og eksklusiv oplevelse. Ideel til forretningsmiddage eller mindre familiesammenkomster, hvor samtalen er i fokus.",
                    },
                    {
                      _key: "keglebanen",
                      name: "Keglebanen",
                      capacity: "Op til 40 gæster",
                      description:
                        "Et unikt og historisk rum med karakter. Keglebanen byder på en afslappet stemning perfekt til festlige lejligheder.",
                    },
                  ] as Venue[])
              ).map((venue, i) => {
                const imgUrl = venue.image?.asset
                  ? urlFor(venue.image)
                      .width(800)
                      .height(600)
                      .auto("format")
                      .url()
                  : null;
                const imageLeft = i % 2 === 0;

                return (
                  <div
                    key={venue._key}
                    className={`flex flex-col lg:flex-row ${imageLeft ? "" : "lg:flex-row-reverse"} bg-warm-gray overflow-hidden min-h-[280px]`}
                  >
                    {/* Image */}
                    <div className="relative w-full lg:w-1/2 min-h-[240px] lg:min-h-0 bg-[#e5e2e1]">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={venue.name ?? "Lokale"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#e5e2e1]" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center p-10 lg:p-14">
                      <h3 className="font-newsreader font-extralight text-2xl text-dark-stone leading-tight mb-2">
                        {venue.name}
                      </h3>
                      {venue.capacity && (
                        <p className="text-[10px] tracking-[1.5px] uppercase text-brand mb-5">
                          {venue.capacity}
                        </p>
                      )}
                      {venue.description && (
                        <p className="text-warm-brown font-light text-sm leading-6 mb-8 max-w-sm">
                          {venue.description}
                        </p>
                      )}
                      <a
                        href="#foresporgsel"
                        className="inline-flex items-center gap-2 text-[11px] tracking-[1.5px] uppercase text-dark-stone border-b border-dark-stone/30 pb-0.5 w-fit hover:border-dark-stone transition-colors"
                      >
                        {page?.venueCtaLabel ?? "Forespørg om lokalet"}
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M1 9L9 1M9 1H3M9 1V7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 4: Features strip ────────────────────────────────── */}
      <section className="bg-warm-white border-t border-b border-border-warm/20 py-16 px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((f) => (
              <div
                key={f._key}
                className="flex flex-col items-center text-center gap-4"
              >
                <FeatureIcon type={f.icon} />
                <p className="text-[11px] tracking-[1.5px] uppercase font-light text-warm-brown">
                  {f.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Menu overview ─────────────────────────────────── */}
      {(page?.menuHeading || page?.menuDescription) && (
        <section className="bg-[#eae7e7] py-24 lg:py-32 px-10 lg:px-16">
          <div className="max-w-2xl mx-auto text-center">
            {page.menuEyebrow && (
              <p className="font-cormorant font-light italic text-brand text-2xl mb-4">
                {page.menuEyebrow}
              </p>
            )}
            {page.menuHeading && (
              <h2 className="font-newsreader font-extralight text-[clamp(2rem,4vw,3rem)] text-dark-stone leading-tight mb-6">
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
                className="inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[2px] uppercase font-light text-white bg-dark-stone hover:opacity-80 transition-opacity"
              >
                {page.menuPdfFallbackLabel ?? "Se selskabsmenuer (PDF)"}
              </a>
            ) : (
              <Link
                href="/menukort"
                className="inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[2px] uppercase font-light text-white bg-dark-stone hover:opacity-80 transition-opacity"
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

      {/* ── Footer ──────────────────────────────────────────────────── */}
    </main>
  );
}

