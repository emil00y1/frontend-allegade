import SectionHeading from "@/components/SectionHeading";

interface ArrivalItem {
  _key: string;
  emoji?: string;
  title?: string;
  description?: string;
  note?: string;
}

interface HotelArrivalProps {
  eyebrow?: string;
  heading?: string;
  headingItalic?: string;
  description?: string;
  arrivalItems?: ArrivalItem[];
}

const DEFAULT_ITEMS: ArrivalItem[] = [
  { _key: "checkin", emoji: "🕒", title: "Check-in", description: "Fra kl. 15:00", note: "Tidlig check-in kan arrangeres mod gebyr" },
  { _key: "checkout", emoji: "🕙", title: "Check-out", description: "Inden kl. 11:00", note: "Sen check-out mod gebyr efter aftale" },
  { _key: "parking", emoji: "🚗", title: "Parkering", description: "Gadeparkering tilgængelig på Allégade og omliggende gader" },
  { _key: "wifi", emoji: "📶", title: "WiFi", description: "Gratis højhastigheds WiFi i alle rum og fællesarealer" },
  { _key: "breakfast", emoji: "☕", title: "Morgenmad", description: "Serveres kl. 07:30–10:00 i restauranten" },
  { _key: "pets", emoji: "🐾", title: "Kæledyr", description: "Vi er desværre ikke et kæledyrsvenligt hotel" },
];

export default function HotelArrival({
  eyebrow,
  heading,
  headingItalic,
  description,
  arrivalItems,
}: HotelArrivalProps) {
  const items = arrivalItems && arrivalItems.length > 0 ? arrivalItems : DEFAULT_ITEMS;

  return (
    <section className="bg-warm-gray py-24 lg:py-32 border-t border-border-warm/20">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        <div className="max-w-xl mb-16">
          <SectionHeading
            eyebrow={eyebrow ?? "Praktisk info"}
            heading={heading ?? "Alt du skal vide om"}
            headingItalic={headingItalic ?? "dit ophold"}
          />
          {description && (
            <p className="mt-6 text-warm-brown font-light leading-7 text-base">
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-warm/20">
          {items.map((item) => (
            <div
              key={item._key}
              className="bg-warm-white p-8 flex flex-col gap-3"
            >
              {item.emoji && (
                <span className="text-2xl leading-none" role="img" aria-hidden="true">
                  {item.emoji}
                </span>
              )}
              <h3 className="text-[11px] tracking-[1.4px] uppercase font-light text-dark-stone">
                {item.title}
              </h3>
              <p className="text-warm-brown font-light text-sm leading-6">
                {item.description}
              </p>
              {item.note && (
                <p className="text-[11px] text-warm-brown/70 font-light italic leading-5 mt-auto pt-2 border-t border-border-warm/30">
                  {item.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
