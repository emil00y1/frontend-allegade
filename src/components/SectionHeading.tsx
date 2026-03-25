interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  headingItalic?: string;
  /** Heading element level. Defaults to "h2". */
  as?: "h1" | "h2" | "h3";
  /** xl = text-5xl, lg = clamp(2–3.25rem), md = clamp(1.75–2.5rem). Defaults to "md". */
  size?: "xl" | "lg" | "md";
  /** Heading text colour. Defaults to "stone". */
  color?: "stone" | "white";
  /** Italic accent colour. Defaults to "stone". */
  italicColor?: "stone" | "brand" | "white";
  /** Eyebrow style. "brand" = small brand uppercase, "muted" = warm-brown. Defaults to "brand". */
  eyebrowStyle?: "brand" | "muted";
  /** Extra classes on the wrapper div. */
  className?: string;
}

const sizeClasses = {
  xl: "text-5xl",
  lg: "text-[clamp(2rem,4vw,3.25rem)]",
  md: "text-[clamp(1.75rem,3vw,2.5rem)]",
};

const colorClasses = {
  stone: "text-dark-stone",
  white: "text-white",
};

const italicColorClasses = {
  stone: "text-dark-stone",
  brand: "text-brand",
  white: "text-white",
};

const eyebrowClasses = {
  brand: "text-[10px] tracking-[2px] uppercase text-brand mb-4 block",
  muted: "text-[12px] tracking-[1.2px] uppercase font-light text-warm-brown mb-3 block",
};

export default function SectionHeading({
  eyebrow,
  heading,
  headingItalic,
  as: Tag = "h2",
  size = "md",
  color = "stone",
  italicColor = "stone",
  eyebrowStyle = "brand",
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow && (
        <span className={eyebrowClasses[eyebrowStyle]}>{eyebrow}</span>
      )}
      <Tag
        className={`font-newsreader font-extralight leading-tight ${sizeClasses[size]} ${colorClasses[color]}`}
      >
        {headingItalic ? (
          <>
            <span className="block">{heading}</span>
            <span
              className={`font-cormorant font-light italic block ${italicColorClasses[italicColor]}`}
            >
              {headingItalic}
            </span>
          </>
        ) : (
          heading
        )}
      </Tag>
    </div>
  );
}
