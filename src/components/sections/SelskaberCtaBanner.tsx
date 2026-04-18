import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface SelskaberCtaBannerProps {
  ctaBannerImage?: any;
  ctaBannerHeading?: string;
  ctaBannerButtonLabel?: string;
}

export default function SelskaberCtaBanner({
  ctaBannerImage,
  ctaBannerHeading,
  ctaBannerButtonLabel,
}: SelskaberCtaBannerProps) {
  const imageUrl = ctaBannerImage?.asset
    ? urlFor(ctaBannerImage).width(1600).height(800).auto("format").url()
    : null;

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden flex items-center justify-center">
      {imageUrl ? (
        <Image src={imageUrl} alt={ctaBannerHeading ?? "CTA"} fill className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-dark-stone" />
      )}
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="relative z-20 text-center px-6">
        <h2 className="text-white text-[clamp(2rem,5vw,3.5rem)] font-newsreader font-extralight mb-10">{ctaBannerHeading}</h2>
        <a href="#foresporgsel" className="bg-white text-dark-stone text-[12px] tracking-[1.4px] uppercase font-light px-10 py-4 hover:bg-warm-white transition-colors duration-300">
          {ctaBannerButtonLabel ?? "Kontakt os"}
        </a>
      </div>
    </section>
  );
}
