import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import { type SanityImage as SanityImageType } from "@/types/sanity";
import { dataAttr } from "@/sanity/lib/visual-editing";

interface HotelRestaurantTeaserProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  restaurantEyebrow?: string;
  restaurantHeading?: string;
  restaurantHeadingItalic?: string;
  restaurantDescription?: string;
  restaurantCtaLabel?: string;
  restaurantCtaUrl?: string;
  restaurantImage?: SanityImageType;
}

export default function HotelRestaurantTeaser({
  _key,
  documentId,
  documentType,
  restaurantEyebrow,
  restaurantHeading,
  restaurantHeadingItalic,
  restaurantDescription,
  restaurantCtaLabel,
  restaurantCtaUrl,
  restaurantImage,
}: HotelRestaurantTeaserProps) {
  return (
    <section className="bg-warm-white border-t border-b border-border-warm/20 px-10 lg:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-warm-gray p-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {restaurantImage?.asset && (
              <div
                className="relative shrink-0 w-full md:w-72 aspect-[3/2] md:aspect-square overflow-hidden"
                data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].restaurantImage`)}
              >
                <SanityImage image={restaurantImage} alt="Restaurant" fill sizes="(max-width: 768px) 100vw, 18rem" className="object-cover" />
              </div>
            )}

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-brand" />
                <span className="text-[10px] tracking-[1px] uppercase font-bold text-brand">{restaurantEyebrow ?? "Gastronomi"}</span>
              </div>

              <h2 className="text-[clamp(1.5rem,2.5vw,1.875rem)] leading-tight">
                <span className="font-newsreader font-extralight text-dark-stone">{restaurantHeading ?? "Din overnatning er tæt på Frederiksbergs "} </span>
                <span className="font-cormorant font-light italic text-dark-stone">{restaurantHeadingItalic ?? "ældste restaurant"}</span>
              </h2>

              {restaurantDescription && <p className="text-warm-brown text-base leading-6 font-light max-w-xl">{restaurantDescription}</p>}

              <Link href={restaurantCtaUrl ?? "/"} className="self-start border-b border-brand pb-1 text-[11px] tracking-[1.1px] uppercase font-bold text-brand hover:opacity-70 transition-opacity">
                {restaurantCtaLabel ?? "Udforsk Restauranten"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
