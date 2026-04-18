import { urlFor } from "@/sanity/lib/image";
import { type SanityImage } from "@/types/sanity";
import BaseHeroSection from "./BaseHeroSection";

interface RestaurantHeroProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
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
  _key,
  documentId,
  documentType,
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

  return (
    <BaseHeroSection
      documentId={documentId}
      documentType={documentType}
      sectionKey={_key}
      imageFieldPath="heroImage"
      breadcrumbLabel="Restaurant"
      breadcrumbHomeLabel={breadcrumbHomeLabel}
      heading={heroHeading ?? "Mad, atmosfære og"}
      headingItalic={heroHeadingItalic ?? "gode øjeblikke"}
      description={
        heroDescription ??
        "I de historiske stuer på Allégade 10 serverer vi klassisk dansk køkken..."
      }
      imageUrl={heroImageUrl}
      imageAlt="Restaurant Allégade 10"
      primaryCta={{
        label: heroBookCtaLabel ?? "Book bord",
        href: heroBookCtaUrl ?? globalBookTableUrl ?? "#",
      }}
      secondaryCta={{
        label: heroMenuCtaLabel ?? "Se menukort",
        href: heroMenuCtaUrl ?? "/menukort",
      }}
    />
  );
}
