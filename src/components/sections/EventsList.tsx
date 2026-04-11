import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ShareButton from "@/components/ShareButton";
import { urlFor } from "@/sanity/lib/image";

interface EventsListProps {
  upcomingHeading?: string;
  emptyStateHeading?: string;
  emptyStateText?: string;
  freeLabel?: string;
  upcomingEvents?: any[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" });
}

export default function EventsList({
  upcomingHeading,
  emptyStateHeading,
  emptyStateText,
  freeLabel = "Gratis",
  upcomingEvents,
}: EventsListProps) {
  const list = upcomingEvents || [];
  return (
    <section id="begivenheder" className="bg-warm-gray py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        <SectionHeading
          eyebrow={`${list.length} ${list.length === 1 ? "kommende begivenhed" : "kommende begivenheder"}`}
          heading={upcomingHeading ?? "Hvad sker der næste gang"}
          className="mb-16"
        />

        {list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((event) => {
              const imageUrl = event.image?.asset ? urlFor(event.image).width(800).height(600).auto("format").url() : null;
              return (
                <Link key={event._id} href={`/begivenheder/${event.slug.current}`} className="group flex flex-col bg-warm-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                    {imageUrl ? (
                      <Image src={imageUrl} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-warm-gray" />
                    )}
                  </div>
                  <div className="flex flex-col gap-3 p-6 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-3">
                        {event.category && <span className="text-brand text-[10px] tracking-[1.5px] uppercase font-light">{event.category}</span>}
                        <h3 className="font-newsreader font-extralight text-xl text-dark-stone leading-snug group-hover:text-brand transition-colors duration-200">{event.title}</h3>
                      </div>
                      <ShareButton url={`/begivenheder/${event.slug.current}`} title={event.title} />
                    </div>
                    <div className="border-t border-border-warm/30 mt-auto pt-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-brand shrink-0" strokeWidth={1.5} />
                        <span className="text-warm-brown text-xs font-light">{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-brand shrink-0" strokeWidth={1.5} />
                        <span className="text-warm-brown text-xs font-light">{formatTime(event.startDate)}</span>
                      </div>
                      {event.price != null && (
                        <p className="text-dark-stone text-sm font-light mt-1">
                          {event.price === 0 ? freeLabel : `${event.price} kr.`}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="border border-border-warm/20 py-20 text-center">
            <p className="font-newsreader font-extralight text-2xl text-dark-stone mb-3">{emptyStateHeading ?? "Ingen kommende begivenheder"}</p>
            <p className="text-warm-brown text-sm font-light">{emptyStateText ?? "Følg med her — nye events annonceres løbende."}</p>
          </div>
        )}
      </div>
    </section>
  );
}
