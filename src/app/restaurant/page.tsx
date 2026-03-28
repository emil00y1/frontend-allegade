import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { createDataAttribute } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import { SectionRenderer } from "@/components/sections";
import { buttonVariants } from "@/lib/button-variants";
import { type SanityImage, type SiteSettings } from "@/types/sanity";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";

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
  image?: SanityImage;
}

interface RestaurantPageData {
  _id: string;
  _type: string;
  title?: string;
  seo?: any;
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
  storyStats?: Stat[];
  menuTeaserEyebrow?: string;
  menuTeaserHeading?: string;
  menuTeaserDescription?: string;
  menuServices?: MenuService[];
  menuCtaLabel?: string;
  menuCtaUrl?: string;
  philosophyImage?: SanityImage;
  philosophyQuote?: string;
  philosophyAttribution?: string;
  galleryHeading?: string;
  galleryImages?: (SanityImage & { _key?: string })[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections?: any[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "restaurantPage": *[_type == "restaurantPage"][0]{
    _id,
    _type,
    title,
    seo,
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
    galleryImages[]{ ..., asset->, alt },
    ${SECTIONS_QUERY_FRAGMENT}
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
  const isDraftMode = (await draftMode()).isEnabled;
  const result = data as {
    restaurantPage: RestaurantPageData | null;
    siteSettings: SiteSettings | null;
  } | null;

  const page = result?.restaurantPage;

  // Helper: returns data-sanity attribute only in draft/preview mode
  const da = (path: string) =>
    isDraftMode && page?._id
      ? {
          "data-sanity": createDataAttribute({
            id: page._id,
            type: page._type,
            path,
          }).toString(),
        }
      : {};
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

  const stats = page?.storyStats ?? [];
  const services = page?.menuServices ?? [];

  const galleryImages = page?.galleryImages?.slice(0, 4) ?? [];

  return (
    <main>
      {/* If sections array is empty, render the old fixed layout as fallback */}
      {(!page?.sections || page.sections.length === 0) ? (
        <>
          {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
          <section className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white">
            <div className="flex flex-col justify-center px-10 lg:px-16 py-20" {...da("heroHeading")}>
              <Breadcrumb current="Restaurant" homeLabel={siteSettings?.breadcrumbHomeLabel} />
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
              <p className="text-warm-brown font-light leading-7 text-base max-w-md mb-10">
                {page?.heroDescription ?? "I de historiske stuer på Allégade 10 serverer vi klassisk dansk køkken..."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={bookingUrl} className={buttonVariants({ variant: "primary" })}>
                  {page?.heroBookCtaLabel ?? "Book bord"}
                </Link>
                <Link href={page?.heroMenuCtaUrl ?? "/menukort"} className={buttonVariants({ variant: "secondary" })}>
                  {page?.heroMenuCtaLabel ?? "Se menukort"}
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block overflow-hidden bg-warm-gray min-h-[calc(100vh-80px)]" {...da("heroImage")}>
              {heroImageUrl ? <Image src={heroImageUrl} alt="Restaurant Allégade 10" fill sizes="50vw" className="object-cover" priority /> : <div className="absolute inset-0 bg-warm-gray" />}
            </div>
          </section>

          {/* ── Section 2: Story ─────────────────────────────────────────────── */}
          <section className="bg-warm-white pt-24 pb-24 lg:pt-32 lg:pb-32 border-t border-border-warm/20">
            <div className="max-w-6xl mx-auto px-10 lg:px-16">
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                <div className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden bg-warm-gray" {...da("storyImage")}>
                  {storyImageUrl ? <Image src={storyImageUrl} alt="Om Allégade 10 restaurant" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /> : <div className="absolute inset-0 bg-warm-gray" />}
                </div>
                <div className="flex flex-col gap-8" {...da("storyHeading")}>
                  <SectionHeading eyebrow={page?.storyEyebrow ?? "Vores Restaurant"} heading={page?.storyHeading ?? "Et sted hvor maden og stemningen taler for sig selv"} />
                  <div className="flex flex-col gap-4">
                    {(page?.storyBody ?? "Vi laver mad med respekt for den klassiske danske madtradition...").split("\n\n").map((para, i) => (
                      <p key={i} className="text-warm-brown font-light leading-7 text-base">{para}</p>
                    ))}
                  </div>
                  <div className="border-t border-border-warm/30 pt-8 grid grid-cols-3 gap-6" {...da("storyStats")}>
                    {stats.map((stat) => (
                      <div key={stat._key}>
                        <p className="font-newsreader font-extralight text-xl text-dark-stone leading-tight mb-1">{stat.value}</p>
                        <p className="text-[10px] tracking-[1px] uppercase text-warm-brown/70 font-light leading-snug">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 3: Menu Services ─────────────────────────────────────── */}
          <section className="bg-warm-gray py-14 md:py-24 lg:py-32">
            <div className="max-w-6xl mx-auto px-10 lg:px-16">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16" {...da("menuTeaserHeading")}>
                <SectionHeading eyebrow={page?.menuTeaserEyebrow ?? "Menukort"} heading={page?.menuTeaserHeading ?? "Noget for enhver lejlighed"} />
                <p className="text-warm-brown font-light text-sm leading-6 max-w-sm lg:text-right">
                  {page?.menuTeaserDescription ?? "Vi serverer hele dagen — fra weekend brunch til klassisk frokost..."}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-warm/20" {...da("menuServices")}>
                {services.map((service) => {
                  const imgUrl = service.image?.asset ? urlFor(service.image).width(700).height(500).auto("format").url() : null;
                  return (
                    <div key={service._key} className="bg-warm-gray flex flex-col p-8 pb-10">
                      <div className="relative aspect-[4/3] overflow-hidden bg-warm-gray mb-8">
                        {imgUrl ? <Image src={imgUrl} alt={service.title ?? ""} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="absolute inset-0 bg-warm-gray" />}
                      </div>
                      <div className="flex flex-col gap-4 flex-1">
                        {service.timeLabel && <span className="text-[10px] tracking-[1.5px] uppercase text-brand font-light">{service.timeLabel}</span>}
                        <h3 className="font-newsreader font-extralight text-2xl text-dark-stone leading-tight">{service.title}</h3>
                        <p className="text-warm-brown font-light text-sm leading-6 flex-1">{service.description}</p>
                        {service.priceFrom != null && (
                          <p className="font-newsreader font-extralight text-lg text-dark-stone mt-auto pt-4 border-t border-border-warm/20">
                            Fra {service.priceFrom},- {service.priceLabel && <span className="text-warm-brown/70 text-sm font-light ml-1">{service.priceLabel}</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-12 flex justify-center">
                <Link href={page?.menuCtaUrl ?? "/menukort"} className={buttonVariants({ variant: "ghost", size: "lg" })}>
                  {page?.menuCtaLabel ?? "Se det fulde menukort"}
                </Link>
              </div>
            </div>
          </section>

          {/* ── Section 5: Philosophy Quote ──────────────────────────────────── */}
          <section className="relative overflow-hidden py-16 md:py-32 lg:py-48 bg-dark-stone max-h-[calc(100vh-80px)] flex items-center justify-center" {...da("philosophyQuote")}>
            {philosophyImageUrl && (
              <>
                <Image src={philosophyImageUrl} alt="Allégade 10 restaurant atmosfære" fill sizes="100vw" className="object-cover opacity-30" />
                <div className="absolute inset-0 bg-dark-stone/60" />
              </>
            )}
            <div className="relative max-w-3xl mx-auto px-10 text-center">
              <div className="w-12 h-px bg-brand mx-auto mb-10" />
              <blockquote className="font-cormorant font-light italic text-[clamp(1.75rem,4vw,3rem)] text-white leading-relaxed mb-8">
                &ldquo;{page?.philosophyQuote ?? "Vi laver ikke mad for at imponere. Vi laver mad for at glæde."}&rdquo;
              </blockquote>
              {page?.philosophyAttribution && <p className="text-white/50 text-[11px] tracking-[2px] uppercase font-light">— {page.philosophyAttribution}</p>}
              <div className="w-12 h-px bg-brand mx-auto mt-10" />
            </div>
          </section>

          {/* ── Section 6: Gallery ───────────────────────────────────────────── */}
          {galleryImages.length > 0 && (
            <section className="bg-warm-white py-14 md:py-24 lg:py-32" {...da("galleryImages")}>
              <div className="max-w-6xl mx-auto px-10 lg:px-16">
                {page?.galleryHeading && <p className="text-[10px] tracking-[2px] uppercase text-brand mb-10 text-center">{page.galleryHeading}</p>}
                {galleryImages.length >= 3 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="relative col-span-2 lg:col-span-1 lg:row-span-2 aspect-[4/3] lg:aspect-auto overflow-hidden bg-warm-gray">
                      <Image src={urlFor(galleryImages[0]).width(800).height(1000).auto("format").url()} alt={galleryImages[0].alt ?? "Restaurant Allégade 10"} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                    {galleryImages.slice(1, 3).map((img, i) => (
                      <div key={i} className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                        <Image src={urlFor(img).width(700).height(520).auto("format").url()} alt={img.alt ?? "Restaurant Allégade 10"} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                      </div>
                    ))}
                    {galleryImages[3] && (
                      <div className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                        <Image src={urlFor(galleryImages[3]).width(700).height(520).auto("format").url()} alt={galleryImages[3].alt ?? "Restaurant Allégade 10"} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                        <Image src={urlFor(img).width(700).height(520).auto("format").url()} alt={img.alt ?? "Restaurant Allégade 10"} fill sizes="50vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        <SectionRenderer
          documentId={page?._id ?? "restaurantPage"}
          documentType={page?._type ?? "restaurantPage"}
          sections={page?.sections}
        />
      )}
    </main>
  );
}
