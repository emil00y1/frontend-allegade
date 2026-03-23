import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface HeroProps {
  tagline?: string;
  heading?: string;
  headingItalic?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryUrl?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryUrl?: string;
  sideText?: string;
  backgroundVideoUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backgroundImage?: any;
}

export default function Hero({
  tagline = "Kulturel perle i Frederiksbergs centrum",
  heading = "Velkommen til",
  headingItalic = "Allégade 10",
  ctaPrimaryLabel = "Find dit bord",
  ctaPrimaryUrl = "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10",
  ctaSecondaryLabel = "Se vores værelser",
  ctaSecondaryUrl = "/hotel",
  sideText = "Siden 1780 — Frederiksberg",
  backgroundVideoUrl = "https://cdn.sanity.io/files/b0bkhf04/production/bf5322023ca71a37f92e42f0607cfba31b760e04.mp4",
  backgroundImage,
}: HeroProps) {
  return (
    <section className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster={
          backgroundImage
            ? urlFor(backgroundImage).width(1600).url()
            : undefined
        }
      >
        <source src={backgroundVideoUrl} type="video/mp4" />
      </video>

      {/* Fallback image if no video */}
      {!backgroundVideoUrl && backgroundImage && (
        <Image
          src={urlFor(backgroundImage).width(1600).url()}
          alt="Allégade 10"
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.65)_100%)]" />

      {/* Vertical side text */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 hidden md:block">
        <span className="text-white/30 text-[10px] tracking-[5px] uppercase font-light block [writing-mode:vertical-rl] rotate-180">
          {sideText}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto flex flex-col items-center my-16">
        {/* Tagline */}
        <span className="text-brand-light text-[12px] tracking-[3.6px] uppercase font-light mb-8 block">
          {tagline}
        </span>

        {/* Heading */}
        <h1 className="mb-16 text-center leading-none [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
          <span className="block text-[clamp(3rem,8vw,6rem)] text-white font-newsreader font-extralight">
            {heading}
          </span>
          <span className="block text-[clamp(3rem,8vw,6rem)] text-white/90 font-cormorant font-light italic">
            {headingItalic}
          </span>
        </h1>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={ctaPrimaryUrl}
            target={ctaPrimaryUrl?.startsWith("http") ? "_blank" : undefined}
            rel={
              ctaPrimaryUrl?.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="px-10 py-4 text-[14px] tracking-[1.4px] uppercase font-light text-white bg-brand hover:brightness-110 transition-all duration-300"
          >
            {ctaPrimaryLabel}
          </Link>
          <Link
            href={ctaSecondaryUrl}
            target={ctaSecondaryUrl?.startsWith("http") ? "_blank" : undefined}
            rel={
              ctaSecondaryUrl?.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="px-10 py-4 text-[14px] tracking-[1.4px] uppercase font-light text-white border border-white/40 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            {ctaSecondaryLabel}
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/50"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}

