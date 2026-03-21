import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

interface SelskaberSectionProps {
  heading?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backgroundImage?: any;
}

export default function SelskaberSection({
  heading = "Hold Dit Selskab Hos Os",
  description = "Fra intime barnedåb til store bryllupper. Vi skaber de perfekte rammer om jeres næste mindeværdige begivenhed.",
  ctaLabel = "Kontakt os",
  ctaUrl = "/kontakt",
  backgroundImage,
}: SelskaberSectionProps) {
  return (
    <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <Image
          src={urlFor(backgroundImage).width(1600).url()}
          alt={heading}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-dark-stone" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center text-white flex flex-col items-center gap-6 px-6 max-w-3xl mx-auto">
        <h2
          className="text-[clamp(2.5rem,7vw,4.5rem)] text-white text-center leading-none"
          style={{ fontFamily: "var(--font-newsreader)", fontWeight: 200 }}
        >
          {heading}
        </h2>
        <p className="text-lg font-light text-white/80 text-center max-w-xl leading-7">
          {description}
        </p>
        <Link
          href={ctaUrl}
          className="mt-2 bg-white text-dark-stone text-[14px] tracking-[1.4px] uppercase font-light px-12 py-5 hover:bg-warm-white transition-colors duration-300"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
