import type { TypedObject } from "sanity";
import { HotelFaqAccordion } from "@/components/HotelFaqAccordion";

interface HotelPracticalInfoProps {
  practicalInfoHeading?: string;
  practicalInfoHeadingItalic?: string;
  faqItems?: Array<{ _key: string; question?: string; answer?: TypedObject[] | string }>;
}

export default function HotelPracticalInfo({
  practicalInfoHeading,
  practicalInfoHeadingItalic,
  faqItems,
}: HotelPracticalInfoProps) {
  const items = faqItems || [];
  if (items.length === 0) return null;

  return (
    <section className="bg-warm-white px-10 lg:px-16 py-14 md:py-24 lg:py-32">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] text-center mb-16 leading-none">
          <span className="font-newsreader font-extralight text-dark-stone">
            {practicalInfoHeading ?? "Godt at "}{" "}
          </span>
          <span className="font-cormorant font-light italic text-dark-stone">
            {practicalInfoHeadingItalic ?? "Vide"}
          </span>
        </h2>
        <HotelFaqAccordion items={items} />
      </div>
    </section>
  );
}
