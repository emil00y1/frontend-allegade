import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import { type SanityImage as SanityImageType } from "@/types/sanity";

interface HotelTeaserSectionProps {
  eyebrow?: string;
  heading?: string;
  pricingText?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  image?: SanityImageType;
}

export default function HotelTeaserSection({
  eyebrow = "Overnatning",
  heading = "Hotel på Allégade 10",
  pricingText = "Fra kun 770,- pr. nat!",
  description = "Oplev historisk charme i vores nyrenoverede værelser, placeret midt i Frederiksbergs hjerte.",
  ctaLabel = "Book værelse",
  ctaUrl = "/hotel",
  image,
}: HotelTeaserSectionProps) {
  return (
    <section className="bg-warm-white px-8 lg:px-20 lg:min-h-[calc(100vh-80px)] flex items-center py-16 lg:py-0">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center w-full">
        {/* Text column */}
        <div className="flex-1 flex flex-col gap-8">
          <SectionHeading eyebrow={eyebrow} heading={heading} size="xl" />

          {/* Quote / pricing box */}
          <div className="bg-warm-gray border-l-4 border-brand pl-9 pr-8 py-8 flex flex-col gap-3">
            <p className="text-dark-stone text-2xl font-newsreader font-extralight italic">
              {pricingText}
            </p>
            <p className="text-warm-brown text-sm font-light leading-5">
              {description}
            </p>
          </div>

          <Link
            href={ctaUrl}
            className="self-start bg-brand text-white text-[14px] tracking-[1.4px] uppercase font-light px-10 py-4 hover:opacity-90 transition-opacity duration-300"
          >
            {ctaLabel}
          </Link>
        </div>

        {/* Image column */}
        <div className="flex-1 relative h-[320px] overflow-hidden bg-warm-gray w-full">
          {image ? (
            <SanityImage
              image={image}
              alt={heading}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-warm-gray" />
          )}
        </div>
      </div>
    </section>
  );
}
