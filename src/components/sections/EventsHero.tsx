import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import { urlFor } from "@/sanity/lib/image";
import { buttonVariants } from "@/lib/button-variants";

interface EventsHeroProps {
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  featuredEvent?: any;
  breadcrumbHomeLabel?: string;
}

export default function EventsHero({
  heroHeading,
  heroHeadingItalic,
  heroDescription,
  heroCtaLabel,
  featuredEvent,
  breadcrumbHomeLabel,
}: EventsHeroProps) {
  const featuredImageUrl = featuredEvent?.image?.asset
    ? urlFor(featuredEvent.image).width(1200).height(1600).auto("format").url()
    : null;

  return (
    <section className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white">
      <div className="flex flex-col justify-center px-10 lg:px-16 py-20">
        <Breadcrumb current="Begivenheder" homeLabel={breadcrumbHomeLabel} />
        <div className="mb-8">
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
            <span className="font-newsreader font-extralight text-dark-stone block">{heroHeading ?? "Begivenheder"}</span>
            <span className="font-cormorant font-light italic text-brand block">{heroHeadingItalic ?? "på Allégade 10"}</span>
          </h1>
        </div>
        <p className="text-warm-brown font-light leading-7 text-base max-w-md mb-10">
          {heroDescription ?? "Oplev Allégade 10's unikke begivenheder i historiske omgivelser."}
        </p>
        <a href="#begivenheder" className={buttonVariants({ variant: "primary" })}>
          {heroCtaLabel ?? "Se alle begivenheder"}
        </a>
      </div>
      <div className="relative hidden lg:block overflow-hidden bg-warm-gray min-h-[calc(100vh-80px)]">
        {featuredImageUrl ? (
          <Image src={featuredImageUrl} alt="Begivenhed" fill sizes="50vw" className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-warm-gray" />
        )}
      </div>
    </section>
  );
}
