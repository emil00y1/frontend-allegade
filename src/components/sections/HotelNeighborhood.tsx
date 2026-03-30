import dynamic from "next/dynamic";
const HotelMap = dynamic(() => import("@/components/HotelMap"));

interface HotelNeighborhoodProps {
  neighborhoodHeading?: string;
  neighborhoodHeadingItalic?: string;
  neighborhoodAddress?: string;
  neighborhoodCity?: string;
  neighborhoodMapUrl?: string;
  neighborhoodItems?: Array<{ _key: string; title?: string; walkTime?: string; description?: string }>;
  mapEyebrow?: string;
  directionsLabel?: string;
}

export default function HotelNeighborhood({
  neighborhoodHeading,
  neighborhoodHeadingItalic,
  neighborhoodAddress,
  neighborhoodCity,
  neighborhoodMapUrl,
  neighborhoodItems,
  mapEyebrow,
  directionsLabel,
}: HotelNeighborhoodProps) {
  const list = neighborhoodItems || [];
  return (
    <section className="bg-warm-gray grid lg:grid-cols-2">
      <HotelMap
        src={
          neighborhoodMapUrl ??
          "https://www.openstreetmap.org/export/embed.html?bbox=12.5229%2C55.6710%2C12.5429%2C55.6810&layer=mapnik&marker=55.67597%2C12.53295"
        }
      />

      <div className="flex flex-col justify-center px-12 lg:px-24 py-24">
        <p className="text-[10px] tracking-[2px] uppercase text-warm-brown mb-8">
          {mapEyebrow ?? "Beliggenhed"}
        </p>

        <div className="mb-2">
          <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] text-dark-stone leading-none">
            {neighborhoodAddress ?? "Allégade 10"}
          </h2>
          <p className="font-cormorant font-light italic text-brand text-xl mt-2">
            {neighborhoodCity ?? "2000 Frederiksberg"}
          </p>
        </div>

        <div className="w-10 h-px bg-border-warm/40 my-8" />

        {list.length > 0 && (
          <>
            {(neighborhoodHeading || neighborhoodHeadingItalic) && (
              <p className="text-[10px] tracking-[1.5px] uppercase text-warm-brown/70 mb-6">
                {neighborhoodHeading} {neighborhoodHeadingItalic}
              </p>
            )}
            <ul className="flex flex-col gap-8 mb-10">
              {list.map((item) => (
                <li key={item._key} className="flex gap-6 items-start">
                  <div className="mt-0.5 shrink-0 text-warm-brown/50">
                    <svg width="14" height="18" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0C3.589 0 0 3.589 0 8c0 5.25 8 12 8 12S16 13.25 16 8c0-4.411-3.589-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[11px] tracking-[1.2px] uppercase font-bold text-dark-stone shrink-0">{item.title}</h3>
                      <div className="flex-1 h-px bg-border-warm/30" />
                      {item.walkTime && <span className="font-cormorant font-light italic text-sm text-dark-stone shrink-0">{item.walkTime}</span>}
                    </div>
                    {item.description && <p className="text-warm-brown text-sm leading-5 font-light">{item.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(neighborhoodAddress || "Allégade 10, 2000 Frederiksberg")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-[11px] tracking-[1.5px] uppercase text-dark-stone border-b border-dark-stone/30 pb-0.5 w-fit hover:border-dark-stone transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" fill="currentColor" />
          </svg>
          {directionsLabel ?? "Få vejledning"}
        </a>
      </div>
    </section>
  );
}
