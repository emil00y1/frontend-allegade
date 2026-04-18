import { urlFor } from "@/sanity/lib/image";
import BaseHeroSection from "./BaseHeroSection";

interface SelskaberHeroProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  breadcrumbLabel?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  _key,
  documentId,
  documentType,
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
    <BaseHeroSection
      documentId={documentId}
      documentType={documentType}
      sectionKey={_key}
      imageFieldPath="heroImage"
      breadcrumbLabel={breadcrumbLabel ?? "Selskaber"}
      breadcrumbHomeLabel={breadcrumbHomeLabel}
      heading={heroHeading ?? "Fejr jeres næste"}
      headingItalic={heroHeadingItalic ?? "begivenhed hos os"}
      description={
        heroDescription ??
        "Siden 1780 har Allégade 10 dannet rammen om livets store øjeblikke."
      }
      imageUrl={heroImageUrl}
      imageAlt={heroHeading ?? "Selskaber"}
      imageSizes="(max-width: 1024px) 100vw, 50vw"
      primaryCta={{
        label: heroCtaLabel ?? "Send en forespørgsel",
        href: "#foresporgsel",
      }}
      secondaryCta={
        heroMenuCtaUrl || heroMenuCtaLabel
          ? {
              label: heroMenuCtaLabel ?? "Se selskabsmenuer",
              href: heroMenuCtaUrl ?? "/menukort",
            }
          : undefined
      }
    />
  );
}
