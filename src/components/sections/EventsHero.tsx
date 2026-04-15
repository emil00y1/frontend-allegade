import { urlFor } from "@/sanity/lib/image";
import BaseHeroSection from "./BaseHeroSection";

interface EventsHeroProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  heroHeading?: string;
  heroHeadingItalic?: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heroImage?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  featuredEvent?: any;
  breadcrumbHomeLabel?: string;
}

export default function EventsHero({
  _key,
  documentId,
  documentType,
  heroHeading,
  heroHeadingItalic,
  heroDescription,
  heroCtaLabel,
  heroImage,
  featuredEvent,
  breadcrumbHomeLabel,
}: EventsHeroProps) {
  // Prefer the explicitly uploaded hero image; fall back to the featured event's image.
  const imageSource = heroImage?.asset
    ? heroImage
    : featuredEvent?.image?.asset
      ? featuredEvent.image
      : null;
  const featuredImageUrl = imageSource
    ? urlFor(imageSource).width(1200).height(1600).auto("format").url()
    : null;

  return (
    <BaseHeroSection
      documentId={documentId}
      documentType={documentType}
      sectionKey={_key}
      imageFieldPath="heroImage"
      breadcrumbLabel="Begivenheder"
      breadcrumbHomeLabel={breadcrumbHomeLabel}
      heading={heroHeading ?? "Begivenheder"}
      headingItalic={heroHeadingItalic ?? "på Allégade 10"}
      description={
        heroDescription ??
        "Oplev Allégade 10's unikke begivenheder i historiske omgivelser."
      }
      imageUrl={featuredImageUrl}
      imageAlt="Begivenhed"
      primaryCta={{
        label: heroCtaLabel ?? "Se alle begivenheder",
        href: "#begivenheder",
      }}
    />
  );
}
