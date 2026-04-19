import Link from "next/link";

type CtaBannerSectionProps = {
  heading?: string;
  description?: string;
  cta?: { label?: string; url?: string };
  ctaSecondary?: { label?: string; url?: string };
  style?: "dark" | "brand" | "light";
};

const styleConfig = {
  dark: {
    bg: "bg-stone-900",
    heading: "text-stone-50",
    description: "text-stone-300",
    primaryBtn:
      "border-white text-white hover:bg-white hover:text-stone-900",
    secondaryBtn:
      "text-stone-300 hover:text-white",
  },
  brand: {
    bg: "bg-brand",
    heading: "text-white",
    description: "text-white/80",
    primaryBtn:
      "border-white text-white hover:bg-white hover:text-brand",
    secondaryBtn:
      "text-white/80 hover:text-white",
  },
  light: {
    bg: "bg-[#f5f0e8]",
    heading: "text-stone-900",
    description: "text-stone-600",
    primaryBtn:
      "border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white",
    secondaryBtn:
      "text-stone-600 hover:text-stone-900",
  },
};

export default function CtaBannerSection({
  heading,
  description,
  cta,
  ctaSecondary,
  style = "dark",
}: CtaBannerSectionProps) {
  const s = styleConfig[style];

  return (
    <section className={`${s.bg} py-20 lg:py-28`}>
      <div className="max-w-4xl mx-auto px-6 lg:px-16 text-center">
        {heading && (
          <h2 className={`font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] mb-5 ${s.heading}`}>
            {heading}
          </h2>
        )}

        {description && (
          <p className={`text-base md:text-lg font-light max-w-2xl mx-auto mb-10 leading-relaxed ${s.description}`}>
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          {cta?.label && cta?.url && (
            <Link
              href={cta.url}
              className={`inline-flex items-center gap-3 border px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 group ${s.primaryBtn}`}
            >
              {cta.label}
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          )}

          {ctaSecondary?.label && ctaSecondary?.url && (
            <Link
              href={ctaSecondary.url}
              className={`text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-300 underline underline-offset-4 ${s.secondaryBtn}`}
            >
              {ctaSecondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
