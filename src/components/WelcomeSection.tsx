import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import { dataAttr } from "@/sanity/lib/visual-editing";

interface WelcomeSectionProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
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
  _key,
  documentId,
  documentType,
  eyebrow = "Vores Historie",
  heading = "Et samlingspunkt gennem århundreder",
  paragraph1 = "Siden 1797 har Allégade 10 været rammen om Frederiksbergs mest betydningsfulde møder. Her, hvor de gamle lindetræer kaster skygger over de historiske mure, fortsætter vi traditionen med klassisk dansk gæstfrihed.",
  paragraph2 = "Vores køkken forener det bedste fra det traditionelle danske smørrebrød med moderne europæiske teknikker, altid med fokus på sæsonens fineste råvarer og det gode håndværk.",
  linkLabel = "Læs mere",
  linkUrl = "/om-os",
  image,
}: WelcomeSectionProps) {
  return (
    <section className="bg-warm-white px-8 lg:px-20 lg:min-h-[calc(100vh-80px)] flex items-center py-16 lg:py-0">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
        {/* Text column */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <span className="text-brand text-2xl font-cormorant font-light italic">
            {eyebrow}
          </span>

          <h2 className="text-dark-stone text-[clamp(1.75rem,4vw,3rem)] leading-tight font-newsreader font-light">
            {heading}
          </h2>

          <div className="flex flex-col gap-6 max-w-2xl">
            {paragraph1 && (
              <p className="text-warm-brown text-base font-normal leading-[26px]">
                {paragraph1}
              </p>
            )}
            {paragraph2 && (
              <p className="text-warm-brown text-base font-normal leading-[26px]">
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
        <div className="lg:col-span-5 relative flex justify-center">
          <div
            className="relative bg-warm-gray overflow-hidden aspect-[4/3] lg:aspect-[4/5] w-full max-w-[75%] sm:max-w-[65%] md:max-w-md lg:max-w-none"
            data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].image`)}
          >
            {image ? (
              <SanityImage
                image={image}
                alt={image.alt || heading}
                fill
                sizes="(max-width: 1024px) 75vw, 40vw"
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
