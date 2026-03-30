import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { urlFor } from "@/sanity/lib/image";
import { buttonVariants } from "@/lib/button-variants";

interface SelskaberHeroProps {
  breadcrumbLabel?: string;
  heroImage?: any;
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  heroMenuCtaLabel?: string;
  heroMenuCtaUrl?: string;
  breadcrumbHomeLabel?: string;
}

export default function SelskaberHero({
  breadcrumbLabel,
  heroImage,
  heroHeading,
  heroHeadingItalic,
  heroDescription,
  heroCtaLabel,
  heroMenuCtaLabel,
  heroMenuCtaUrl,
  breadcrumbHomeLabel,
}: SelskaberHeroProps) {
  const heroImageUrl = heroImage?.asset
    ? urlFor(heroImage).width(1200).height(900).auto("format").url()
    : null;

  return (
    <section className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white">
      <div className="flex flex-col justify-center px-10 lg:px-16 py-20">
        <Breadcrumb current={breadcrumbLabel ?? "Selskaber"} homeLabel={breadcrumbHomeLabel} />
        <div className="mb-8">
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
            <span className="font-newsreader font-extralight text-dark-stone block">
              {heroHeading ?? "Fejr jeres næste"}
            </span>
            <span className="font-cormorant font-light italic text-brand block">
              {heroHeadingItalic ?? "begivenhed hos os"}
            </span>
          </h1>
        </div>
        <p className="text-warm-brown font-light leading-7 text-base max-w-md mb-10">
          {heroDescription ?? "Siden 1780 har Allégade 10 dannet rammen om livets store øjeblikke."}
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="#foresporgsel" className={buttonVariants({ variant: "primary" })}>
            {heroCtaLabel ?? "Send en forespørgsel"}
          </a>
          {(heroMenuCtaUrl || heroMenuCtaLabel) && (
            <Link href={heroMenuCtaUrl ?? "/menukort"} className={buttonVariants({ variant: "secondary" })}>
              {heroMenuCtaLabel ?? "Se selskabsmenuer"}
            </Link>
          )}
        </div>
      </div>
      <div className="relative hidden lg:block overflow-hidden bg-warm-gray min-h-[calc(100vh-80px)]">
        {heroImageUrl ? (
          <Image src={heroImageUrl} alt={heroHeading ?? "Selskaber"} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-warm-gray" />
        )}
      </div>
    </section>
  );
}
