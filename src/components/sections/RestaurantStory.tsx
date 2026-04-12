import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { urlFor } from "@/sanity/lib/image";
import { type SanityImage } from "@/types/sanity";
import { dataAttr } from "@/sanity/lib/visual-editing";

interface RestaurantStoryProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  storyImage?: SanityImage;
  storyEyebrow?: string;
  storyHeading?: string;
  storyBody?: string;
  storyStats?: Array<{ _key: string; value?: string; label?: string }>;
}

export default function RestaurantStory({
  _key,
  documentId,
  documentType,
  storyImage,
  storyEyebrow,
  storyHeading,
  storyBody,
  storyStats,
}: RestaurantStoryProps) {
  const stats = storyStats || [];
  const storyImageUrl = storyImage?.asset
    ? urlFor(storyImage).width(900).height(1200).auto("format").url()
    : null;

  return (
    <section className="bg-warm-white pt-24 pb-24 lg:pt-32 lg:pb-32 border-t border-border-warm/20">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div
            className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden bg-warm-gray"
            data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].storyImage`)}
          >
            {storyImageUrl ? (
              <Image src={storyImageUrl} alt="Om Allégade 10" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-warm-gray" />
            )}
          </div>
          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow={storyEyebrow ?? "Vores Restaurant"} heading={storyHeading ?? "Et sted hvor maden og stemningen taler for sig selv"} />
            <div className="flex flex-col gap-4">
              {(storyBody ?? "Vi laver mad med respekt for den klassiske danske madtradition...").split("\n\n").map((para, i) => (
                <p key={i} className="text-warm-brown font-light leading-7 text-base">{para}</p>
              ))}
            </div>
            <div className="border-t border-border-warm/30 pt-8 grid grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <div key={stat._key || i}>
                  <p className="font-newsreader font-extralight text-xl text-dark-stone leading-tight mb-1">{stat.value}</p>
                  <p className="text-[10px] tracking-[1px] uppercase text-warm-brown/70 font-light leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
