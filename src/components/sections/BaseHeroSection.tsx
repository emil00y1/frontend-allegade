import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { dataAttr } from "@/sanity/lib/visual-editing";

// Shared scaffold for all split-layout hero sections (Restaurant, Hotel,
// Menukort, Selskaber, Events). Variants differ in details — stats row,
// floating badge, serving times, grid ratio — but the 2-column layout,
// headline typography, breadcrumb and CTA treatment are identical.
// Passing content via slots keeps the type surface small and lets each hero
// stay explicit about its own data shape.

export type HeroCta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

type Stat = { _key?: string; label?: string; value?: string };
type ServingTime = { label?: string; time?: string };

export interface BaseHeroSectionProps {
  // Visual editing wiring
  documentId?: string;
  documentType?: string;
  sectionKey?: string;
  imageFieldPath?: string;

  // Breadcrumb
  breadcrumbLabel: string;
  breadcrumbHomeLabel?: string;

  // Copy
  heading: string;
  headingItalic?: string;
  description?: string;

  // Image (caller pre-resolves URL so this component stays purely presentational)
  imageUrl?: string | null;
  imageAlt?: string;
  imageSizes?: string;

  // CTAs
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;

  // Optional decorations
  stats?: Stat[];
  servingTimes?: ServingTime[];
  floatingBadge?: {
    primaryText?: string;
    secondaryText?: string;
  };

  // Layout tweaks
  gridClassName?: string;
  minHeightClassName?: string;
  headingSize?: "sm" | "lg";
}

function isExternal(url?: string) {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

function HeroCtaLink({ cta }: { cta: HeroCta }) {
  return (
    <Link
      href={cta.href}
      target={isExternal(cta.href) ? "_blank" : undefined}
      rel={isExternal(cta.href) ? "noopener noreferrer" : undefined}
      className={buttonVariants({ variant: cta.variant ?? "primary" })}
    >
      {cta.label}
    </Link>
  );
}

export default function BaseHeroSection({
  documentId,
  documentType,
  sectionKey,
  imageFieldPath,
  breadcrumbLabel,
  breadcrumbHomeLabel,
  heading,
  headingItalic,
  description,
  imageUrl,
  imageAlt,
  imageSizes = "50vw",
  primaryCta,
  secondaryCta,
  stats,
  servingTimes,
  floatingBadge,
  gridClassName = "grid lg:grid-cols-2",
  minHeightClassName = "min-h-[calc(100vh-80px)]",
  headingSize = "lg",
}: BaseHeroSectionProps) {
  const headingClass =
    headingSize === "sm"
      ? "text-[clamp(2rem,4vw,3.25rem)]"
      : "text-[clamp(2.5rem,5vw,4.5rem)]";

  const imageDataAttr =
    sectionKey && imageFieldPath
      ? dataAttr(documentId, documentType, `sections[_key=="${sectionKey}"].${imageFieldPath}`)
      : undefined;

  return (
    <section className={cn(gridClassName, minHeightClassName, "bg-warm-white")}>
      <div className="flex flex-col justify-center px-10 lg:px-16 py-20">
        <Breadcrumb current={breadcrumbLabel} homeLabel={breadcrumbHomeLabel} />

        <div className="mb-8">
          <h1 className={cn(headingClass, "leading-none")}>
            <span className="font-newsreader font-light text-dark-stone block">
              {heading}
            </span>
            {headingItalic && (
              <span className="font-cormorant font-light italic text-brand block">
                {headingItalic}
              </span>
            )}
          </h1>
        </div>

        {description && (
          <p className="text-warm-brown font-normal leading-7 text-base max-w-md mb-10">
            {description}
          </p>
        )}

        {stats && stats.length > 0 && (
          <div className="border-t border-b border-border-warm/30 py-6 mb-10 grid grid-cols-2 sm:grid-cols-3 gap-y-6">
            {stats.map((stat, i) => (
              <div key={stat._key ?? i} className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[1px] uppercase text-warm-brown/60">
                  {stat.label}
                </span>
                <span className="font-newsreader font-light text-xl text-dark-stone">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {servingTimes && servingTimes.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
            {servingTimes.map((st, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-brand shrink-0" />
                <span className="text-[11px] font-light text-dark-stone">
                  <span className="font-light text-warm-brown/80 uppercase tracking-[0.5px] text-[10px] mr-1">
                    {st.label}:
                  </span>
                  {st.time}
                </span>
              </div>
            ))}
          </div>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap gap-4">
            {primaryCta && <HeroCtaLink cta={primaryCta} />}
            {secondaryCta && (
              <HeroCtaLink cta={{ ...secondaryCta, variant: secondaryCta.variant ?? "secondary" }} />
            )}
          </div>
        )}
      </div>

      <div className={cn("relative hidden lg:block overflow-hidden bg-warm-gray", minHeightClassName)}>
        <div className="absolute inset-0" data-sanity={imageDataAttr}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt ?? heading}
              fill
              sizes={imageSizes}
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-warm-gray" />
          )}
        </div>
        {floatingBadge && (floatingBadge.primaryText || floatingBadge.secondaryText) && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-12 left-12 bg-warm-white px-8 py-6 shadow-2xl">
              {floatingBadge.primaryText && (
                <p className="font-cormorant font-light italic text-brand text-2xl leading-none mb-2">
                  {floatingBadge.primaryText}
                </p>
              )}
              {floatingBadge.secondaryText && (
                <p className="text-[10px] tracking-[1px] uppercase text-warm-brown">
                  {floatingBadge.secondaryText}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
