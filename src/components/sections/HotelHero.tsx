import { urlFor } from "@/sanity/lib/image";
import { type SanityImage } from "@/types/sanity";
import BaseHeroSection from "./BaseHeroSection";

interface HotelHeroProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  heroImage?: SanityImage;
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroStats?: Array<{ _key: string; label?: string; value?: string }>;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaUrl?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaUrl?: string;
  heroFloatingStarText?: string;
  heroFloatingSubtext?: string;
  bookingCtaUrl?: string;
  breadcrumbHomeLabel?: string;
}

export default function HotelHero({
  _key,
  documentId,
  documentType,
  heroImage,
  heroHeading,
  heroHeadingItalic,
  heroDescription,
  heroStats,
  heroPrimaryCtaLabel,
  heroPrimaryCtaUrl,
  heroSecondaryCtaLabel,
  heroSecondaryCtaUrl,
  heroFloatingStarText,
  heroFloatingSubtext,
  bookingCtaUrl,
  breadcrumbHomeLabel,
}: HotelHeroProps) {
  const heroImageUrl = heroImage
    ? urlFor(heroImage).width(1400).height(1800).auto("format").url()
    : null;

  return (
    <BaseHeroSection
      documentId={documentId}
      documentType={documentType}
      sectionKey={_key}
      imageFieldPath="heroImage"
      breadcrumbLabel="Hotel"
      breadcrumbHomeLabel={breadcrumbHomeLabel}
      heading={heroHeading ?? "Overnat i hjertet af"}
      headingItalic={heroHeadingItalic ?? "Frederiksberg"}
      description={
        heroDescription ??
        "Oplev atmosfæren i en af Københavns ældste bygninger. Vores hotel kombinerer 1780'ernes historiske charme med moderne komfort."
      }
      imageUrl={heroImageUrl}
      imageAlt={heroHeading ?? "Hotel"}
      stats={heroStats}
      floatingBadge={{
        primaryText: heroFloatingStarText,
        secondaryText: heroFloatingSubtext,
      }}
      primaryCta={{
        label: heroPrimaryCtaLabel ?? "Book ophold",
        href: heroPrimaryCtaUrl ?? bookingCtaUrl ?? "https://allegade10.suitcasebooking.com/da",
      }}
      secondaryCta={{
        label: heroSecondaryCtaLabel ?? "Se værelser",
        href: heroSecondaryCtaUrl ?? "#vaerelser",
      }}
    />
  );
}
