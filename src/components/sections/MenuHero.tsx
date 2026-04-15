import { urlFor } from "@/sanity/lib/image";
import { type SanityImage } from "@/types/sanity";
import BaseHeroSection from "./BaseHeroSection";

interface MenuHeroProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  breadcrumbLabel?: string;
  headerHeading?: string;
  headerDescription?: string;
  headerImage?: SanityImage;
  headerServingTimes?: Array<{ label?: string; time?: string }>;
  bookTableLabel?: string;
  bookTableUrl?: string;
  breadcrumbHomeLabel?: string;
  globalBookTableUrl?: string;
}

export default function MenuHero({
  _key,
  documentId,
  documentType,
  breadcrumbLabel,
  headerHeading,
  headerDescription,
  headerImage,
  headerServingTimes,
  bookTableLabel,
  bookTableUrl,
  breadcrumbHomeLabel,
  globalBookTableUrl,
}: MenuHeroProps) {
  const finalBookingUrl =
    bookTableUrl ||
    globalBookTableUrl ||
    "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";

  const headerImageUrl = headerImage?.asset
    ? urlFor(headerImage).width(900).height(600).auto("format").url()
    : null;

  return (
    <BaseHeroSection
      documentId={documentId}
      documentType={documentType}
      sectionKey={_key}
      imageFieldPath="headerImage"
      breadcrumbLabel={breadcrumbLabel ?? "Menukort"}
      breadcrumbHomeLabel={breadcrumbHomeLabel}
      heading={headerHeading ?? "Vores Menukort"}
      description={
        headerDescription ??
        "Fra klassisk dansk smørrebrød til aftenmenu..."
      }
      imageUrl={headerImageUrl}
      imageAlt={headerHeading ?? "Menukort"}
      imageSizes="40vw"
      servingTimes={headerServingTimes}
      primaryCta={{
        label: bookTableLabel ?? "Book bord",
        href: finalBookingUrl,
      }}
      gridClassName="grid lg:grid-cols-[3fr_2fr]"
      minHeightClassName="min-h-[30vh]"
      headingSize="sm"
    />
  );
}
