import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

interface Event {
  _id: string;
  title: string;
  slug: { current: string };
  startDate: string;
  category?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
}

interface EventsSectionProps {
  events: Event[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventsSection({ events = [] }: EventsSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="bg-warm-gray px-8 lg:px-20 py-24">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col gap-4">
            <span className="text-warm-brown text-[12px] tracking-[1.2px] uppercase font-light">
              Oplevelser
            </span>
            <h2
              className="text-dark-stone text-5xl"
              style={{ fontFamily: "var(--font-newsreader)", fontWeight: 200 }}
            >
              Events på Allégade 10
            </h2>
          </div>
          <Link
            href="/events"
            className="border-b border-[rgba(144,63,0,0.3)] pb-1 text-brand text-[12px] tracking-[1.2px] uppercase font-light hover:opacity-60 transition-opacity shrink-0 self-start sm:self-auto"
          >
            Se alle events
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event._id} className="bg-warm-white flex flex-col">
              {/* Image */}
              <div className="relative h-[264px] overflow-hidden bg-warm-gray">
                {event.image ? (
                  <Image
                    src={urlFor(event.image).width(600).height(400).url()}
                    alt={event.image.alt || event.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-warm-gray" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-4 p-8 flex-1">
                {event.category && (
                  <span className="text-brand text-[10px] tracking-[1px] uppercase font-light">
                    {event.category}
                  </span>
                )}
                <h3
                  className="text-dark-stone text-2xl"
                  style={{
                    fontFamily: "var(--font-newsreader)",
                    fontWeight: 200,
                  }}
                >
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 py-2 border-b border-border-warm">
                  <CalendarDays className="w-4 h-4 text-warm-brown shrink-0" strokeWidth={1.5} />
                  <span className="text-warm-brown text-sm font-light">
                    {formatDate(event.startDate)}
                  </span>
                </div>
                <Link
                  href={`/events/${event.slug.current}`}
                  className="mt-auto border border-border-warm text-dark-stone text-[10px] tracking-[1px] uppercase font-light text-center py-4 hover:border-brand hover:text-brand transition-colors duration-300"
                >
                  Bestil billet
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
