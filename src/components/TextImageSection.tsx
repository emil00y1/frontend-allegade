import Link from "next/link";
import { PortableText } from "next-sanity";
import type { TypedObject } from "sanity";
import { SanityImage } from "@/components/SanityImage";
import { dataAttr } from "@/sanity/lib/visual-editing";

type TextImageSectionProps = {
  _key?: string;
  documentId?: string;
  documentType?: string;
  heading?: string;
  subheading?: string;
  body?: TypedObject[];
  cta?: { label?: string; url?: string };
  imagePosition?: "left" | "right";
  backgroundColor?: "white" | "beige" | "dark";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
};

const bgMap = {
  white: "bg-white",
  beige: "bg-[#f5f0e8]",
  dark: "bg-stone-900",
};

const textColorMap = {
  white: "text-stone-900",
  beige: "text-stone-900",
  dark: "text-stone-50",
};

const accentColorMap = {
  white: "text-stone-400",
  beige: "text-stone-500",
  dark: "text-stone-400",
};

const dividerColorMap = {
  white: "bg-stone-300",
  beige: "bg-stone-400",
  dark: "bg-stone-600",
};

const frameColorMap = {
  white: "border-stone-200",
  beige: "border-stone-300",
  dark: "border-stone-700",
};

const ctaStyleMap = {
  white: "border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white",
  beige: "border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white",
  dark: "border-stone-100 text-stone-100 hover:bg-stone-100 hover:text-stone-900",
};

export default function TextImageSection({
  _key,
  documentId,
  documentType,
  heading,
  subheading,
  body,
  cta,
  imagePosition = "right",
  backgroundColor = "white",
  image,
}: TextImageSectionProps) {
  const bg = bgMap[backgroundColor];
  const textColor = textColorMap[backgroundColor];
  const accentColor = accentColorMap[backgroundColor];
  const dividerColor = dividerColorMap[backgroundColor];
  const frameColor = frameColorMap[backgroundColor];
  const ctaStyle = ctaStyleMap[backgroundColor];

  const imageFirst = imagePosition === "left";

  const imageBlock = image ? (
    <div className={`flex items-center justify-center w-full pb-8 lg:py-20 ${imageFirst ? "order-last lg:order-first" : "order-last"}`}>
      <div className="relative w-full lg:max-w-[82%]">
        {/* Decorative offset frame — desktop only */}
        <div
          className={`hidden lg:block absolute inset-0 lg:translate-x-5 lg:translate-y-5 border ${frameColor}`}
          aria-hidden="true"
        />
        {/* Image */}
        <div
          className="relative aspect-[3/2] lg:aspect-[4/5] overflow-hidden shadow-xl"
          data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].image`)}
        >
          <SanityImage
            image={image}
            alt={image?.alt ?? heading ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        {/* Caption */}
        {image?.caption && (
          <p className={`mt-3 text-xs tracking-widest uppercase ${accentColor} text-right pr-1`}>
            {image.caption}
          </p>
        )}
      </div>
    </div>
  ) : null;

  const textBlock = (
    <div className="flex flex-col justify-center py-10 lg:py-24 lg:px-4 order-first">
      {subheading && (
        <span className={`text-xs tracking-[0.25em] uppercase font-medium mb-6 ${accentColor}`}>
          {subheading}
        </span>
      )}

      {heading && (
        <h2 className={`font-serif text-4xl md:text-5xl xl:text-[3.25rem] font-light leading-[1.1] mb-7 ${textColor}`}>
          {heading}
        </h2>
      )}

      <div className={`w-10 h-px mb-8 ${dividerColor}`} />

      {body && body.length > 0 && (
        <div
          className={`prose prose-base max-w-none font-light leading-relaxed ${
            backgroundColor === "dark"
              ? "prose-invert prose-p:text-stone-300"
              : "prose-stone prose-p:text-stone-600"
          }`}
        >
          <PortableText value={body} />
        </div>
      )}

      {cta?.label && cta?.url && (
        <div className="mt-10">
          <Link
            href={cta.url}
            className={`inline-flex items-center gap-3 border px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 group ${ctaStyle}`}
          >
            {cta.label}
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <section className={`${bg} w-full overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16 items-center">
          {imageFirst ? (
            <>
              {imageBlock}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {imageBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
