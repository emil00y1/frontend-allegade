import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { type SanityImage } from "@/types/sanity";
import { dataAttr } from "@/sanity/lib/visual-editing";

interface RestaurantPhilosophyProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  philosophyImage?: SanityImage;
  philosophyQuote?: string;
  philosophyAttribution?: string;
}

export default function RestaurantPhilosophy({
  _key,
  documentId,
  documentType,
  philosophyImage,
  philosophyQuote,
  philosophyAttribution,
}: RestaurantPhilosophyProps) {
  const philosophyImageUrl = philosophyImage?.asset
    ? urlFor(philosophyImage).width(1800).height(900).auto("format").url()
    : null;

  return (
    <section className="relative overflow-hidden py-16 md:py-32 lg:py-48 bg-dark-stone max-h-[calc(100vh-80px)] flex items-center justify-center">
      {philosophyImageUrl && (
        <>
          <div
            className="absolute inset-0"
            data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].philosophyImage`)}
          >
            <Image src={philosophyImageUrl} alt="Filosofi" fill sizes="100vw" className="object-cover opacity-30" />
          </div>
          <div className="absolute inset-0 bg-dark-stone/60" />
        </>
      )}
      <div className="relative max-w-3xl mx-auto px-10 text-center">
        <div className="w-12 h-px bg-brand mx-auto mb-10" />
        <blockquote className="font-cormorant font-light italic text-[clamp(1.75rem,4vw,3rem)] text-white leading-relaxed mb-8">
          &ldquo;{philosophyQuote ?? "Vi laver ikke mad for at imponere. Vi laver mad for at glæde."}&rdquo;
        </blockquote>
        {philosophyAttribution && <p className="text-white/50 text-[11px] tracking-[2px] uppercase font-light">— {philosophyAttribution}</p>}
        <div className="w-12 h-px bg-brand mx-auto mt-10" />
      </div>
    </section>
  );
}
