import { SanityImage } from "@/components/SanityImage";
import { dataAttr } from "@/sanity/lib/visual-editing";

type QuoteSectionProps = {
  _key?: string;
  documentId?: string;
  documentType?: string;
  quote?: string;
  attribution?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backgroundImage?: any;
  backgroundColor?: "white" | "beige" | "dark";
};

const bgMap = {
  white: "bg-white",
  beige: "bg-[#f5f0e8]",
  dark: "bg-stone-900",
};

const textColorMap = {
  white: "text-stone-800",
  beige: "text-stone-800",
  dark: "text-stone-100",
};

const attrColorMap = {
  white: "text-stone-500",
  beige: "text-stone-500",
  dark: "text-stone-400",
};

export default function QuoteSection({
  _key,
  documentId,
  documentType,
  quote,
  attribution,
  backgroundImage,
  backgroundColor = "beige",
}: QuoteSectionProps) {
  if (!quote) return null;

  const hasImage = !!backgroundImage?.asset;

  return (
    <section className={`relative overflow-hidden py-28 lg:py-40 ${hasImage ? "" : bgMap[backgroundColor]}`}>
      {hasImage && (
        <>
          <div
            className="absolute inset-0"
            data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].backgroundImage`)}
          >
            <SanityImage
              image={backgroundImage}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-16 text-center">
        <div className="mb-8 flex justify-center">
          <svg
            className={`w-10 h-10 ${hasImage ? "text-white/40" : attrColorMap[backgroundColor]} opacity-50`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
        </div>

        <blockquote
          className={`font-serif text-2xl md:text-3xl lg:text-4xl font-light leading-snug italic ${
            hasImage ? "text-white" : textColorMap[backgroundColor]
          }`}
        >
          {quote}
        </blockquote>

        {attribution && (
          <p
            className={`mt-8 text-xs tracking-[0.25em] uppercase font-medium ${
              hasImage ? "text-white/70" : attrColorMap[backgroundColor]
            }`}
          >
            — {attribution}
          </p>
        )}
      </div>
    </section>
  );
}
