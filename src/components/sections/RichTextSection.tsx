import { PortableText } from "next-sanity";
import type { TypedObject } from "sanity";

type RichTextSectionProps = {
  eyebrow?: string;
  heading?: string;
  body?: TypedObject[];
  alignment?: "left" | "center";
  maxWidth?: "narrow" | "medium" | "full";
  backgroundColor?: "white" | "beige" | "dark";
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

const maxWidthMap = {
  narrow: "max-w-2xl",
  medium: "max-w-4xl",
  full: "max-w-6xl",
};

export default function RichTextSection({
  eyebrow,
  heading,
  body,
  alignment = "left",
  maxWidth = "medium",
  backgroundColor = "white",
}: RichTextSectionProps) {
  const centered = alignment === "center";

  return (
    <section className={`${bgMap[backgroundColor]} py-14 md:py-24 lg:py-32`}>
      <div className={`${maxWidthMap[maxWidth]} mx-auto px-6 lg:px-16 ${centered ? "text-center" : ""}`}>
        {eyebrow && (
          <span
            className={`block text-xs tracking-[0.25em] uppercase font-medium mb-6 ${accentColorMap[backgroundColor]}`}
          >
            {eyebrow}
          </span>
        )}

        {heading && (
          <h2
            className={`font-serif text-3xl md:text-4xl xl:text-5xl font-light leading-[1.1] mb-7 ${textColorMap[backgroundColor]}`}
          >
            {heading}
          </h2>
        )}

        <div className={`w-10 h-px mb-8 ${dividerColorMap[backgroundColor]} ${centered ? "mx-auto" : ""}`} />

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
      </div>
    </section>
  );
}
