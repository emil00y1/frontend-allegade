import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

interface WelcomeSectionProps {
  eyebrow?: string;
  heading?: string;
  paragraph1?: string;
  paragraph2?: string;
  linkLabel?: string;
  linkUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
}

export default function WelcomeSection({
  eyebrow = "Vores Historie",
  heading = "Et samlingspunkt gennem århundreder",
  paragraph1 = "Siden 1797 har Allégade 10 været rammen om Frederiksbergs mest betydningsfulde møder. Her, hvor de gamle lindetræer kaster skygger over de historiske mure, fortsætter vi traditionen med klassisk dansk gæstfrihed.",
  paragraph2 = "Vores køkken forener det bedste fra det traditionelle danske smørrebrød med moderne europæiske teknikker, altid med fokus på sæsonens fineste råvarer og det gode håndværk.",
  linkLabel = "Læs mere",
  linkUrl = "/om-os",
  image,
}: WelcomeSectionProps) {
  return (
    <section className="bg-warm-white px-8 lg:px-20 py-24">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Text column */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <span
            className="text-brand text-2xl"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            {eyebrow}
          </span>

          <h2
            className="text-dark-stone text-5xl leading-tight"
            style={{ fontFamily: "var(--font-newsreader)", fontWeight: 200 }}
          >
            {heading}
          </h2>

          <div className="flex flex-col gap-6 max-w-2xl">
            {paragraph1 && (
              <p className="text-warm-brown text-base font-light leading-[26px]">
                {paragraph1}
              </p>
            )}
            {paragraph2 && (
              <p className="text-warm-brown text-base font-light leading-[26px]">
                {paragraph2}
              </p>
            )}
          </div>

          <Link
            href={linkUrl}
            className="inline-block border-b border-brand pb-1 text-brand text-[12px] tracking-[1.2px] uppercase font-light hover:opacity-60 transition-opacity w-fit"
          >
            {linkLabel}
          </Link>
        </div>

        {/* Image column */}
        <div className="lg:col-span-5 relative">
          {/* Decorative offset square */}
          <div className="absolute bottom-[-24px] left-[-24px] w-24 h-24 bg-[rgba(144,63,0,0.1)] z-0 pointer-events-none" />

          <div className="relative z-10 bg-warm-gray overflow-hidden aspect-[5/7]">
            {image ? (
              <Image
                src={urlFor(image).width(800).url()}
                alt={image.alt || heading}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-warm-gray" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
