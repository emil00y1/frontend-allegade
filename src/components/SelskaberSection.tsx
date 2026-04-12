import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";

interface SelskaberSectionProps {
  heading?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backgroundImage?: any;
}

export default function SelskaberSection({
  heading = "Hold Dit Selskab Hos Us",
  description,
  ctaLabel = "Kontakt os",
  ctaUrl = "/kontakt",
  backgroundImage,
}: SelskaberSectionProps) {
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden py-28">
      {/* Background */}
      {backgroundImage ? (
        <SanityImage
          image={backgroundImage}
          alt={heading}
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-dark-stone" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center text-white flex flex-col items-center gap-6 px-6 max-w-3xl mx-auto">
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] text-white text-center leading-none font-newsreader font-extralight">
          {heading}
        </h2>
        {description && (
          <p className="text-white/80 text-base font-light max-w-xl leading-relaxed">
            {description}
          </p>
        )}
        <Link
          href={ctaUrl}
          className="mt-2 bg-white text-dark-stone text-[12px] tracking-[1.4px] uppercase font-light px-10 py-4 hover:bg-warm-white transition-colors duration-300"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
