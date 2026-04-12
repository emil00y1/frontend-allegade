import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { type SanityImage } from "@/types/sanity";
import { dataAttr } from "@/sanity/lib/visual-editing";

interface HotelFacilitiesProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  facilitiesHeading?: string;
  facilitiesHeadingItalic?: string;
  facilitiesDescription?: string;
  facilities?: Array<{ _key: string; icon?: SanityImage; title?: string; description?: string }>;
}

export default function HotelFacilities({
  _key,
  documentId,
  documentType,
  facilitiesHeading,
  facilitiesHeadingItalic,
  facilitiesDescription,
  facilities,
}: HotelFacilitiesProps) {
  const list = facilities || [];
  if (list.length === 0) return null;

  return (
    <section className="bg-warm-white px-10 lg:px-16 py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-20">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-none">
            <span className="font-newsreader font-extralight text-dark-stone">
              {facilitiesHeading ?? "Faciliteter "}
            </span>
            <span className="font-cormorant font-light italic text-brand-mid">
              {facilitiesHeadingItalic ?? "& Bekvemmeligheder"}
            </span>
          </h2>
          {facilitiesDescription && (
            <p className="text-warm-brown text-base leading-6 max-w-sm font-light">
              {facilitiesDescription}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-16">
          {list.map((f: any) => {
            const iconUrl = f.icon?.asset ? urlFor(f.icon).width(56).height(56).url() : null;
            return (
              <div key={f._key} className="flex flex-col gap-0">
                {iconUrl ? (
                  <div
                    className="w-7 h-7 mb-[28px] relative shrink-0"
                    data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].facilities[_key=="${f._key}"].icon`)}
                  >
                    <Image src={iconUrl} alt={f.title ?? ""} width={28} height={28} className="object-contain" />
                  </div>
                ) : (
                  <div className="w-7 h-7 mb-[28px] bg-border-warm/40 rounded-sm" />
                )}
                <h3 className="text-[12px] tracking-[1.2px] uppercase font-bold text-dark-stone mb-2">
                  {f.title}
                </h3>
                {f.description && (
                  <p className="text-warm-brown text-sm leading-[1.625] font-light">
                    {f.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
