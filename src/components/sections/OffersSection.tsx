import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import { dataAttr } from "@/sanity/lib/visual-editing";

type Offer = {
  _key: string;
  title?: string;
  description?: string;
  price?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
  badge?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

type OffersSectionProps = {
  _key?: string;
  documentId?: string;
  documentType?: string;
  heading?: string;
  description?: string;
  offers?: Offer[];
};

export default function OffersSection({
  _key,
  documentId,
  documentType,
  heading,
  description,
  offers,
}: OffersSectionProps) {
  if (!offers?.length) return null;

  return (
    <section className="bg-[#f5f0e8] py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        {heading && (
          <h2 className="font-serif text-3xl md:text-4xl xl:text-5xl font-light leading-[1.1] text-stone-900 mb-5 text-center">
            {heading}
          </h2>
        )}

        {description && (
          <p className="text-stone-600 text-base md:text-lg font-light leading-relaxed text-center max-w-2xl mx-auto mb-14">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer._key}
              className="bg-white flex flex-col overflow-hidden"
            >
              {offer.image?.asset && (
                <div
                  className="aspect-[4/3] relative"
                  data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].offers[_key=="${offer._key}"].image`)}
                >
                  <SanityImage
                    image={offer.image}
                    alt={offer.title || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {offer.badge && (
                    <span className="absolute top-4 right-4 bg-stone-900 text-white text-xs tracking-[0.15em] uppercase font-medium px-3 py-1.5">
                      {offer.badge}
                    </span>
                  )}
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                {offer.title && (
                  <h3 className="font-serif text-xl md:text-2xl font-light text-stone-900 mb-3">
                    {offer.title}
                  </h3>
                )}

                {offer.price && (
                  <p className="text-sm tracking-[0.15em] uppercase font-medium text-stone-500 mb-4">
                    {offer.price}
                  </p>
                )}

                {offer.description && (
                  <p className="text-stone-600 text-sm font-light leading-relaxed mb-8 flex-1">
                    {offer.description}
                  </p>
                )}

                {offer.ctaLabel && offer.ctaUrl && (
                  <Link
                    href={offer.ctaUrl}
                    className="inline-flex items-center gap-3 border border-stone-900 text-stone-900 px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:bg-stone-900 hover:text-white group self-start"
                  >
                    {offer.ctaLabel}
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      &rarr;
                    </span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
