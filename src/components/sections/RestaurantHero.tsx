import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { urlFor } from "@/sanity/lib/image";
import { buttonVariants } from "@/lib/button-variants";

import { type SanityImage } from "@/types/sanity";

interface RestaurantHeroProps {
  heroImage?: SanityImage;
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroBookCtaLabel?: string;
  heroBookCtaUrl?: string;
  heroMenuCtaLabel?: string;
  heroMenuCtaUrl?: string;
  breadcrumbHomeLabel?: string;
  globalBookTableUrl?: string;
}

export default function RestaurantHero({
  heroImage,
  heroHeading,
  heroHeadingItalic,
  heroDescription,
  heroBookCtaLabel,
  heroBookCtaUrl,
  heroMenuCtaLabel,
  heroMenuCtaUrl,
  breadcrumbHomeLabel,
  globalBookTableUrl,
}: RestaurantHeroProps) {
  const heroImageUrl = heroImage?.asset
    ? urlFor(heroImage).width(1200).height(1600).auto("format").url()
    : null;

  const bookingUrl = heroBookCtaUrl ?? globalBookTableUrl ?? "#";

  return (
    <section className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white">
      <div className="flex flex-col justify-center px-10 lg:px-16 py-20">
        <Breadcrumb current="Restaurant" homeLabel={breadcrumbHomeLabel} />
        <div className="mb-8">
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
            <span className="font-newsreader font-extralight text-dark-stone block">
              {heroHeading ?? "Mad, atmosfære og"}
            </span>
            <span className="font-cormorant font-light italic text-brand block">
              {heroHeadingItalic ?? "gode øjeblikke"}
            </span>
          </h1>
        </div>
        <p className="text-warm-brown font-light leading-7 text-base max-w-md mb-10">
          {heroDescription ??
            "I de historiske stuer på Allégade 10 serverer vi klassisk dansk køkken..."}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href={bookingUrl} className={buttonVariants({ variant: "primary" })}>
            {heroBookCtaLabel ?? "Book bord"}
          </Link>
          <Link href={heroMenuCtaUrl ?? "/menukort"} className={buttonVariants({ variant: "secondary" })}>
            {heroMenuCtaLabel ?? "Se menukort"}
          </Link>
        </div>
      </div>
      <div className="relative hidden lg:block overflow-hidden bg-warm-gray min-h-[calc(100vh-80px)]">
        {heroImageUrl ? (
          <Image src={heroImageUrl} alt="Restaurant Allégade 10" fill sizes="50vw" className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-warm-gray" />
        )}
      </div>
    </section>
  );
}
