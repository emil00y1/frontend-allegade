import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";

type BannerSectionProps = {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backgroundImage?: any;
  overlay?: "light" | "medium" | "dark";
  size?: "small" | "medium" | "large";
};

const sizeMap = {
  small: "py-12 md:py-20 lg:py-28",
  medium: "py-16 md:py-28 lg:py-40",
  large: "py-20 md:py-36 lg:py-52",
};

const overlayMap = {
  light: "bg-black/30",
  medium: "bg-black/50",
  dark: "bg-black/70",
};

export default function BannerSection({
  heading,
  subheading,
  ctaLabel,
  ctaUrl,
  backgroundImage,
  overlay = "medium",
  size = "medium",
}: BannerSectionProps) {
  return (
    <section className={`relative overflow-hidden ${sizeMap[size]}`}>
      {backgroundImage?.asset && (
        <SanityImage
          image={backgroundImage}
          alt={backgroundImage?.alt ?? heading ?? ""}
          fill
          className="object-cover"
          sizes="100vw"
        />
      )}

      <div className={`absolute inset-0 ${overlayMap[overlay]}`} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-16 text-center">
        {heading && (
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light leading-[1.1] text-white mb-6">
            {heading}
          </h2>
        )}

        {subheading && (
          <p className="text-base md:text-lg font-light text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            {subheading}
          </p>
        )}

        {ctaLabel && ctaUrl && (
          <Link
            href={ctaUrl}
            className="inline-flex items-center gap-3 border border-white/80 px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium text-white transition-all duration-300 hover:bg-white hover:text-stone-900 group"
          >
            {ctaLabel}
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
