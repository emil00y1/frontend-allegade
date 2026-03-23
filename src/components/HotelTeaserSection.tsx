import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

interface HotelTeaserSectionProps {
  eyebrow?: string;
  heading?: string;
  pricingText?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
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
    <section className="bg-warm-white px-8 lg:px-20 py-24">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-16 items-center">
        {/* Text column */}
        <div className="flex-1 flex flex-col gap-8">
          <span className="text-brand text-[12px] tracking-[1.2px] uppercase font-light">
            {eyebrow}
          </span>

          <h2 className="text-dark-stone text-5xl font-newsreader font-extralight">
            {heading}
          </h2>

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
            <Image
              src={urlFor(image).width(800).url()}
              alt={heading}
              fill
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
