import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stat {
  _key: string;
  value?: string;
  label?: string;
}

interface MenuService {
  _key: string;
  title?: string;
  timeLabel?: string;
  description?: string;
  priceFrom?: number;
  priceLabel?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
}

interface RestaurantPageData {
  // Hero
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heroImage?: any;
  heroBadge?: string;
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroBookCtaLabel?: string;
  heroBookCtaUrl?: string;
  heroMenuCtaLabel?: string;
  heroMenuCtaUrl?: string;
  // Story
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storyImage?: any;
  storyEyebrow?: string;
  storyHeading?: string;
  storyBody?: string;
  storyStats?: Stat[];
  // Menu teaser
  menuTeaserEyebrow?: string;
  menuTeaserHeading?: string;
  menuTeaserDescription?: string;
  menuServices?: MenuService[];
  menuCtaLabel?: string;
  menuCtaUrl?: string;
  // Philosophy
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  philosophyImage?: any;
  philosophyQuote?: string;
  philosophyAttribution?: string;
  // Gallery
  galleryHeading?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  galleryImages?: any[];
}

interface SiteSettingsData {
  address?: string;
  phone?: string;
  email?: string;
  footerDescription?: string;
  restaurantHours?: { days?: string; hours: string }[];
  kitchenHours?: { label?: string; hours: string }[];
  socialLinks?: { platform: string; url: string }[];
  newsletterLabel?: string;
  newsletterSubtext?: string;
  newsletterButtonLabel?: string;
  ctaBookTableUrl?: string;
}

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "restaurantPage": *[_type == "restaurantPage"][0]{
    heroImage{ ..., asset-> },
    heroBadge, heroHeading, heroHeadingItalic, heroDescription,
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
    restaurantHours, kitchenHours, ctaBookTableUrl,
    newsletterLabel, newsletterSubtext, newsletterButtonLabel
  }
}`;

// ─── Default fallbacks ────────────────────────────────────────────────────────

const DEFAULT_STATS: Stat[] = [
  { _key: "s1", value: "Siden 1780", label: "Del af Frederiksbergs historie" },
  { _key: "s2", value: "Op til 120", label: "Gæster i vores sale" },
  { _key: "s3", value: "Dagligt", label: "Åbent til brunch, frokost & aften" },
];

const DEFAULT_SERVICES: MenuService[] = [
  {
    _key: "brunch",
    title: "Brunch",
    timeLabel: "Lørdag & Søndag 10:00–13:00",
    description:
      "Start weekenden med vores hjemmelavede brunch — fra æg og bacon til friske, sprøde brød og årstidens frugt.",
    priceFrom: 199,
    priceLabel: "pr. person",
  },
  {
    _key: "frokost",
    title: "Frokost",
    timeLabel: "Mandag–Søndag 11:30–16:00",
    description:
      "Klassisk dansk frokost med smørrebrød i top — fra sild og stjerneskud til hjemmelavet leverpostej og roastbeef.",
    priceFrom: 89,
    priceLabel: "pr. stk. smørrebrød",
  },
  {
    _key: "aften",
    title: "Aftenmenu",
    timeLabel: "Dagligt fra 17:00",
    description:
      "Aftenens menu veksler med sæsonen og byder på to- og treretter med fokus på lokale råvarer og klassiske tilberedninger.",
    priceFrom: 285,
    priceLabel: "pr. person (2 retter)",
  },
];

const DEFAULT_RESTAURANT_HOURS = [
  { days: "Mandag – Torsdag", hours: "11:30 – 23:00" },
  { days: "Fredag – Lørdag", hours: "11:30 – 00:00" },
  { days: "Søndag", hours: "11:30 – 22:00" },
];

const DEFAULT_KITCHEN_HOURS = [
  { label: "Brunch", hours: "Lør–Søn 10:00–13:00" },
  { label: "Frokost", hours: "11:30–16:00" },
  { label: "Aften", hours: "Fra 17:00" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RestaurantPage() {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as {
    restaurantPage: RestaurantPageData | null;
    siteSettings: SiteSettingsData | null;
  } | null;

  const page = result?.restaurantPage;
  const siteSettings = result?.siteSettings;

  const heroImageUrl = page?.heroImage?.asset
    ? urlFor(page.heroImage).width(1200).height(1600).auto("format").url()
    : null;

  const storyImageUrl = page?.storyImage?.asset
    ? urlFor(page.storyImage).width(900).height(1200).auto("format").url()
    : null;

  const philosophyImageUrl = page?.philosophyImage?.asset
    ? urlFor(page.philosophyImage).width(1800).height(900).auto("format").url()
    : null;

  const bookingUrl =
    page?.heroBookCtaUrl ??
    siteSettings?.ctaBookTableUrl ??
    "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";

  const stats = page?.storyStats?.length ? page.storyStats : DEFAULT_STATS;
  const services = page?.menuServices?.length
    ? page.menuServices
    : DEFAULT_SERVICES;

  const restaurantHours = siteSettings?.restaurantHours?.length
    ? siteSettings.restaurantHours
    : DEFAULT_RESTAURANT_HOURS;

  const kitchenHours = siteSettings?.kitchenHours?.length
    ? siteSettings.kitchenHours
    : DEFAULT_KITCHEN_HOURS;

  const galleryImages = page?.galleryImages?.slice(0, 4) ?? [];

  return (
    <main>
      {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
      <section className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white">
        {/* Left: content */}
        <div className="flex flex-col justify-center px-10 lg:px-16 py-20">
          <Breadcrumb current="Restaurant" />

          {page?.heroBadge && (
            <div className="inline-flex mb-6">
              <span className="border border-border-warm px-4 py-1.5 text-[10px] tracking-[3px] uppercase font-semibold text-dark-stone">
                {page.heroBadge}
              </span>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
              <span className="font-newsreader font-extralight text-dark-stone block">
                {page?.heroHeading ?? "Mad, atmosfære og"}
              </span>
              <span className="font-cormorant font-light italic text-brand block">
                {page?.heroHeadingItalic ?? "gode øjeblikke"}
              </span>
            </h1>
          </div>

          <p className="text-warm-brown font-light leading-7 text-base max-w-sm mb-10">
            {page?.heroDescription ??
              "I de historiske stuer på Allégade 10 serverer vi klassisk dansk køkken med respekt for råvarerne og sæsonen. Kom til brunch, frokost eller middag."}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={bookingUrl}
              className="px-8 py-4 text-[11px] tracking-[2px] uppercase font-light text-white bg-brand hover:opacity-90 transition-opacity"
            >
              {page?.heroBookCtaLabel ?? "Book bord"}
            </Link>
            <Link
              href={page?.heroMenuCtaUrl ?? "/menukort"}
              className="px-8 py-4 text-[11px] tracking-[2px] uppercase font-light text-dark-stone border border-border-warm hover:border-dark-stone/50 transition-colors"
            >
              {page?.heroMenuCtaLabel ?? "Se menukort"}
            </Link>
          </div>
        </div>

        {/* Right: hero image */}
        <div className="relative hidden lg:block overflow-hidden bg-[#e5e2e1] min-h-[calc(100vh-80px)]">
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt="Restaurant Allégade 10"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[#e5e2e1]" />
          )}
        </div>
      </section>

      {/* ── Section 2: Story ─────────────────────────────────────────────── */}
      <section className="bg-warm-white py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#e5e2e1]">
              {storyImageUrl ? (
                <Image
                  src={storyImageUrl}
                  alt="Om Allégade 10 restaurant"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[#e5e2e1]" />
              )}
            </div>

            {/* Right: text */}
            <div className="flex flex-col gap-8">
              <SectionHeading
                eyebrow={page?.storyEyebrow ?? "Vores Restaurant"}
                heading={
                  page?.storyHeading ??
                  "Et sted hvor maden og stemningen taler for sig selv"
                }
                size="lg"
              />

              <div className="flex flex-col gap-4">
                {(
                  page?.storyBody ??
                  "Vi laver mad med respekt for den klassiske danske madtradition. Fra det gennemtænkte smørrebrød til aftenens omhyggeligt sammensatte menu — vi arbejder med sæsonens råvarer og lader dem tale for sig selv.\n\nSiden 1780 har Allégade 10 været samlingspunkt for Frederiksbergs borgere. Det er en arv vi tager alvorligt — og en atmosfære du mærker, så snart du træder ind ad døren."
                )
                  .split("\n\n")
                  .map((para, i) => (
                    <p
                      key={i}
                      className="text-warm-brown font-light leading-7 text-base"
                    >
                      {para}
                    </p>
                  ))}
              </div>

              {/* Stats */}
              <div className="border-t border-border-warm/30 pt-8 grid grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div key={stat._key}>
                    <p className="font-newsreader font-extralight text-xl text-dark-stone leading-tight mb-1">
                      {stat.value}
                    </p>
                    <p className="text-[10px] tracking-[1px] uppercase text-warm-brown/70 font-light leading-snug">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Menu Services ─────────────────────────────────────── */}
      <section className="bg-warm-gray py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-10 lg:px-16">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <SectionHeading
              eyebrow={page?.menuTeaserEyebrow ?? "Menukort"}
              heading={page?.menuTeaserHeading ?? "Noget for enhver lejlighed"}
            />
            <p className="text-warm-brown font-light text-sm leading-6 max-w-sm lg:text-right">
              {page?.menuTeaserDescription ??
                "Vi serverer hele dagen — fra weekend brunch til klassisk frokost og aftenens lidt mere festlige menu."}
            </p>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-warm/20">
            {services.map((service) => {
              const imgUrl = service.image?.asset
                ? urlFor(service.image)
                    .width(700)
                    .height(500)
                    .auto("format")
                    .url()
                : null;
              return (
                <div key={service._key} className="bg-warm-gray flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#e5e2e1]">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={service.title ?? ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#e5e2e1]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col gap-4 flex-1">
                    {service.timeLabel && (
                      <span className="text-[10px] tracking-[1.5px] uppercase text-brand font-light">
                        {service.timeLabel}
                      </span>
                    )}
                    <h3 className="font-newsreader font-extralight text-2xl text-dark-stone leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-warm-brown font-light text-sm leading-6 flex-1">
                      {service.description}
                    </p>
                    {service.priceFrom != null && (
                      <p className="font-newsreader font-extralight text-lg text-dark-stone mt-auto pt-4 border-t border-border-warm/20">
                        Fra {service.priceFrom},-
                        {service.priceLabel && (
                          <span className="text-warm-brown/70 text-sm font-light ml-1">
                            {service.priceLabel}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 flex justify-center">
            <Link
              href={page?.menuCtaUrl ?? "/menukort"}
              className="border border-border-warm text-dark-stone text-[11px] tracking-[2px] uppercase font-light px-10 py-4 hover:border-brand hover:text-brand transition-colors"
            >
              {page?.menuCtaLabel ?? "Se det fulde menukort"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: Philosophy Quote ──────────────────────────────────── */}
      {(page?.philosophyQuote || page?.philosophyImage) && (
        <section className="relative overflow-hidden py-32 lg:py-48 bg-dark-stone">
          {/* Background image */}
          {philosophyImageUrl && (
            <>
              <Image
                src={philosophyImageUrl}
                alt="Allégade 10 restaurant atmosfære"
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-dark-stone/60" />
            </>
          )}

          {/* Content */}
          <div className="relative max-w-3xl mx-auto px-10 text-center">
            <div className="w-12 h-px bg-brand mx-auto mb-10" />
            <blockquote className="font-cormorant font-light italic text-[clamp(1.75rem,4vw,3rem)] text-white leading-relaxed mb-8">
              &ldquo;
              {page?.philosophyQuote ??
                "Vi laver ikke mad for at imponere. Vi laver mad for at glæde."}
              &rdquo;
            </blockquote>
            {page?.philosophyAttribution && (
              <p className="text-white/50 text-[11px] tracking-[2px] uppercase font-light">
                — {page.philosophyAttribution}
              </p>
            )}
            <div className="w-12 h-px bg-brand mx-auto mt-10" />
          </div>
        </section>
      )}

      {/* ── Section 6: Gallery ───────────────────────────────────────────── */}
      {galleryImages.length > 0 && (
        <section className="bg-warm-white py-24 lg:py-32">
          <div className="max-w-6xl mx-auto px-10 lg:px-16">
            {page?.galleryHeading && (
              <p className="text-[10px] tracking-[2px] uppercase text-brand mb-10 text-center">
                {page.galleryHeading}
              </p>
            )}

            {/* Asymmetric grid: 1 large left + 2 stacked right (or 4 equal) */}
            {galleryImages.length >= 3 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Large image spanning 2 rows on left */}
                <div className="relative col-span-2 lg:col-span-1 lg:row-span-2 aspect-[4/3] lg:aspect-auto overflow-hidden bg-[#e5e2e1]">
                  <Image
                    src={urlFor(galleryImages[0])
                      .width(800)
                      .height(1000)
                      .auto("format")
                      .url()}
                    alt={galleryImages[0].alt ?? "Restaurant Allégade 10"}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Right: 2 stacked */}
                {galleryImages.slice(1, 3).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] overflow-hidden bg-[#e5e2e1]"
                  >
                    <Image
                      src={urlFor(img)
                        .width(700)
                        .height(520)
                        .auto("format")
                        .url()}
                      alt={img.alt ?? "Restaurant Allégade 10"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {/* 4th image if exists */}
                {galleryImages[3] && (
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#e5e2e1]">
                    <Image
                      src={urlFor(galleryImages[3])
                        .width(700)
                        .height(520)
                        .auto("format")
                        .url()}
                      alt={galleryImages[3].alt ?? "Restaurant Allégade 10"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] overflow-hidden bg-[#e5e2e1]"
                  >
                    <Image
                      src={urlFor(img)
                        .width(700)
                        .height(520)
                        .auto("format")
                        .url()}
                      alt={img.alt ?? "Restaurant Allégade 10"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

