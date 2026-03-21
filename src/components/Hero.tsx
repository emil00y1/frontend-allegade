import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface HeroProps {
  tagline?: string;
  heading?: string;
  headingItalic?: string;
  description?: string;
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
  description = "Hvor historiens vingesus møder nutidens gastronomi i hjertet af det gamle Frederiksberg.",
  ctaPrimaryLabel = "Find dit bord",
  ctaPrimaryUrl = "/book-bord",
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
        poster={backgroundImage ? urlFor(backgroundImage).width(1600).url() : undefined}
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
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Vertical side text */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 hidden md:block">
        <span
          className="text-white/30 text-[10px] tracking-[5px] uppercase font-light block"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {sideText}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto flex flex-col items-center mt-20">
        {/* Tagline */}
        <span className="text-brand-light text-[12px] tracking-[3.6px] uppercase font-light mb-8 block">
          {tagline}
        </span>

        {/* Heading */}
        <h1 className="mb-8 text-center leading-none">
          <span
            className="block text-[clamp(3rem,8vw,6rem)] text-white"
            style={{ fontFamily: "var(--font-newsreader)", fontWeight: 200 }}
          >
            {heading}
          </span>
          <span
            className="block text-[clamp(3rem,8vw,6rem)] text-white/90"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontStyle: "italic",
            }}
          >
            {headingItalic}
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg font-light text-white/75 text-center mb-12 max-w-xl tracking-[0.45px] leading-7">
          {description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={ctaPrimaryUrl}
            className="px-10 py-4 text-[14px] tracking-[1.4px] uppercase font-light text-[#331200] bg-brand-light hover:brightness-105 transition-all duration-300"
          >
            {ctaPrimaryLabel}
          </Link>
          <Link
            href={ctaSecondaryUrl}
            className="px-10 py-4 text-[14px] tracking-[1.4px] uppercase font-light text-white border border-white/40 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            {ctaSecondaryLabel}
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        <span className="text-white/60 text-[10px] tracking-[1px] uppercase font-light">
          Scroll
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
