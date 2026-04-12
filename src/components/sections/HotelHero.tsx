import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { urlFor } from "@/sanity/lib/image";
import { buttonVariants } from "@/lib/button-variants";
import { type SanityImage } from "@/types/sanity";
import { dataAttr } from "@/sanity/lib/visual-editing";

interface HotelHeroProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  heroImage?: SanityImage;
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroStats?: Array<{ _key: string; label?: string; value?: string }>;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaUrl?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaUrl?: string;
  heroFloatingStarText?: string;
  heroFloatingSubtext?: string;
  bookingCtaUrl?: string;
  breadcrumbHomeLabel?: string;
}

export default function HotelHero({
  _key,
  documentId,
  documentType,
  heroImage,
  heroHeading,
  heroHeadingItalic,
  heroDescription,
  heroStats,
  heroPrimaryCtaLabel,
  heroPrimaryCtaUrl,
  heroSecondaryCtaLabel,
  heroSecondaryCtaUrl,
  heroFloatingStarText,
  heroFloatingSubtext,
  bookingCtaUrl,
  breadcrumbHomeLabel,
}: HotelHeroProps) {
  const stats = heroStats || [];
  const heroImageUrl = heroImage
    ? urlFor(heroImage).width(1400).height(1800).auto("format").url()
    : null;

  const primaryCtaUrl = heroPrimaryCtaUrl ?? bookingCtaUrl ?? "https://allegade10.suitcasebooking.com/da";
  const primaryCtaLabel = heroPrimaryCtaLabel ?? "Book ophold";
  const secondaryCtaUrl = heroSecondaryCtaUrl ?? "#vaerelser";
  const secondaryCtaLabel = heroSecondaryCtaLabel ?? "Se værelser";

  return (
    <section className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white">
      <div className="flex flex-col justify-center px-10 lg:px-16 py-20">
        <Breadcrumb current="Hotel" homeLabel={breadcrumbHomeLabel} />
        <div className="mb-8">
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
            <span className="font-newsreader font-extralight text-dark-stone block">
              {heroHeading ?? "Overnat i hjertet af"}
            </span>
            <span className="font-cormorant font-light italic text-brand block">
              {heroHeadingItalic ?? "Frederiksberg"}
            </span>
          </h1>
        </div>
        <p className="text-warm-brown font-light leading-7 text-base max-w-md mb-10">
          {heroDescription ?? "Oplev atmosfæren i en af Københavns ældste bygninger. Vores hotel kombinerer 1780'ernes historiske charme med moderne komfort."}
        </p>

        {stats.length > 0 && (
          <div className="border-t border-b border-border-warm/30 py-6 mb-10 grid grid-cols-2 sm:grid-cols-3 gap-y-6">
            {stats.map((stat) => (
              <div key={stat._key} className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[1px] uppercase text-warm-brown/60">{stat.label}</span>
                <span className="font-newsreader font-extralight text-xl text-dark-stone">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <Link
            href={primaryCtaUrl}
            target={primaryCtaUrl?.startsWith("http") ? "_blank" : undefined}
            rel={primaryCtaUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
            className={buttonVariants({ variant: "primary" })}
          >
            {primaryCtaLabel}
          </Link>
          <Link href={secondaryCtaUrl} className={buttonVariants({ variant: "secondary" })}>
            {secondaryCtaLabel}
          </Link>
        </div>
      </div>

      <div className="relative hidden lg:block min-h-[calc(100vh-80px)] overflow-hidden">
        <div
          className="absolute inset-0"
          data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].heroImage`)}
        >
          {heroImageUrl ? (
            <Image src={heroImageUrl} alt={heroHeading ?? "Hotel"} fill sizes="50vw" className="object-cover object-center" priority />
          ) : (
            <div className="absolute inset-0 bg-warm-gray" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
        {(heroFloatingStarText || heroFloatingSubtext) && (
          <div className="absolute bottom-12 left-12 bg-warm-white px-8 py-6 shadow-2xl">
            {heroFloatingStarText && <p className="font-cormorant font-light italic text-brand text-2xl leading-none mb-2">{heroFloatingStarText}</p>}
            {heroFloatingSubtext && <p className="text-[10px] tracking-[1px] uppercase text-warm-brown">{heroFloatingSubtext}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
