import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { urlFor } from "@/sanity/lib/image";
import { type SanityImage } from "@/types/sanity";
import { dataAttr } from "@/sanity/lib/visual-editing";

interface HotelStoryProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  storyImage?: SanityImage;
  storyEyebrow?: string;
  storyHeading?: string;
  storyHeadingItalic?: string;
  storyBody?: string;
  storyStats?: Array<{ _key: string; value?: string; label?: string }>;
}

export default function HotelStory({
  _key,
  documentId,
  documentType,
  storyImage,
  storyEyebrow,
  storyHeading,
  storyHeadingItalic,
  storyBody,
  storyStats,
}: HotelStoryProps) {
  const stats = storyStats || [];
  const storyImageUrl = storyImage?.asset
    ? urlFor(storyImage).width(900).height(1200).auto("format").url()
    : null;

  const paragraphs = (
    storyBody ??
    "Allégade 10 er en af Frederiksbergs ældste bygninger — opført i slutningen af 1700-tallet og siden da et samlingspunkt for byens liv. Gennem generationer har bygningen rummet gæster, der søgte mere end bare et sted at sove.\n\nI dag kombinerer vi historiens charme med moderne gæstfrihed. Hvert værelse bærer spor af fortiden, men er udstyret med alt, hvad der gør et ophold behageligt."
  ).split("\n\n");

  return (
    <section className="bg-warm-white py-24 lg:py-32 border-t border-border-warm/20">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div
            className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden bg-warm-gray order-last lg:order-first"
            data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].storyImage`)}
          >
            {storyImageUrl ? (
              <Image
                src={storyImageUrl}
                alt="Allégade 10 hotel"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-warm-gray" />
            )}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow={storyEyebrow ?? "Siden 1780"}
              heading={storyHeading ?? "En bygning med sjæl"}
              headingItalic={storyHeadingItalic ?? "og historie"}
            />
            <div className="flex flex-col gap-4">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-warm-brown font-light leading-7 text-base">
                  {para}
                </p>
              ))}
            </div>

            {stats.length > 0 && (
              <div className="border-t border-border-warm/30 pt-8 grid grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <div key={stat._key || i}>
                    <p className="font-newsreader font-extralight text-2xl text-dark-stone leading-tight mb-1">
                      {stat.value}
                    </p>
                    <p className="text-[10px] tracking-[1px] uppercase text-warm-brown font-light leading-snug">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
