import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

interface EventsArchiveProps {
  archiveEyebrow?: string;
  archiveHeading?: string;
  pastEvents?: any[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });
}

export default function EventsArchive({
  archiveEyebrow,
  archiveHeading,
  pastEvents,
}: EventsArchiveProps) {
  const list = pastEvents || [];
  if (list.length === 0) return null;

  return (
    <section className="bg-warm-white py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        <div className="mb-16">
          <p className="text-[10px] tracking-[2px] uppercase text-warm-brown/50 mb-4">{archiveEyebrow ?? "Arkiv"}</p>
          <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] text-dark-stone/60 leading-tight">
            {archiveHeading ?? "Tidligere begivenheder"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {list.map((event) => {
            const imageUrl = event.image?.asset ? urlFor(event.image).width(600).height(400).auto("format").url() : null;
            return (
              <Link key={event._id} href={`/events/${event.slug.current}`} className="group flex flex-col opacity-60 hover:opacity-100 transition-opacity duration-300">
                <div className="relative aspect-[3/2] overflow-hidden bg-warm-gray grayscale group-hover:grayscale-0 transition-all duration-500">
                  {imageUrl ? <Image src={imageUrl} alt={event.title} fill className="object-cover" /> : <div className="absolute inset-0 bg-warm-gray" />}
                </div>
                <div className="pt-4 flex flex-col gap-1.5">
                  {event.category && <span className="text-warm-brown/60 text-[10px] tracking-[1px] uppercase font-light">{event.category}</span>}
                  <h3 className="font-newsreader font-extralight text-base text-dark-stone leading-snug">{event.title}</h3>
                  <span className="text-warm-brown/60 text-xs font-light">{formatDate(event.startDate)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
