import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/lib/image";
import { buttonVariants } from "@/lib/button-variants";
import StructuredData from "@/components/StructuredData";

const EVENT_QUERY = `*[_type == "event" && slug.current == $slug && (!defined(publishAt) || publishAt <= now()) && (!defined(unpublishAt) || unpublishAt > now())][0]{
  _id, title, slug, seo,
  startDate, endDate, price, priceDescription, category, excerpt,
  image{ ..., asset-> },
  venue->{ title, slug, capacity, description },
  menu[]{ course, description },
  body
}`;

const SLUGS_QUERY = `*[_type == "event" && defined(slug.current)]{ "slug": slug.current }`;

const BOOKING_URL =
  "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";

export async function generateStaticParams() {
  const events = await client.fetch(SLUGS_QUERY);
  return (events || []).map((e: any) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: event } = await sanityFetch<any>({
    query: EVENT_QUERY,
    params: { slug },
  });

  if (!event) return { title: "Begivenheder | Allégade 10" };

  const seo = event.seo;
  const title = seo?.metaTitle || event.title || "Begivenhed";
  const description = seo?.metaDescription || event.excerpt || undefined;
  const ogImage = seo?.shareImage
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : event.image?.asset
      ? urlFor(event.image).width(1200).height(630).url()
      : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateRange(start: string, end?: string) {
  const startDate = formatDate(start);
  if (!end) return startDate;
  const endDate = formatDate(end);
  return startDate === endDate ? startDate : `${startDate} — ${endDate}`;
}

function formatTimeRange(start: string, end?: string) {
  const startTime = formatTime(start);
  if (!end) return startTime;
  const endTime = formatTime(end);
  return `${startTime} – ${endTime}`;
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: event } = await sanityFetch<any>({
    query: EVENT_QUERY,
    params: { slug },
  });

  if (!event) {
    notFound();
  }

  const heroImageUrl = event.image?.asset
    ? urlFor(event.image).width(1600).height(1000).auto("format").url()
    : null;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    ...(event.startDate && { startDate: event.startDate }),
    ...(event.endDate && { endDate: event.endDate }),
    ...(event.excerpt && { description: event.excerpt }),
    ...(heroImageUrl && { image: heroImageUrl }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(event.price != null && {
      offers: {
        "@type": "Offer",
        price: event.price,
        priceCurrency: "DKK",
        url: BOOKING_URL,
        availability: "https://schema.org/InStock",
        ...(event.startDate && { validFrom: event.startDate }),
      },
    }),
    location: {
      "@type": "Place",
      name: event.venue?.title || "Allégade 10",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Allégade 10",
        addressLocality: "Frederiksberg",
        postalCode: "2000",
        addressCountry: "DK",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Allégade 10",
      url: "https://allegade10.dk",
    },
    performer: {
      "@type": "Organization",
      name: "Allégade 10",
    },
  };

  return (
    <main>
      <StructuredData data={eventSchema} />

      {/* Hero */}
      <section className="relative bg-warm-gray min-h-[50vh] lg:min-h-[65vh] overflow-hidden">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-warm-gray" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 z-10 max-w-6xl mx-auto px-10 lg:px-16 pb-12">
          <nav className="flex items-center gap-2 text-[10px] tracking-[1px] uppercase text-white/60 mb-4">
            <Link
              href="/begivenheder"
              className="hover:text-white transition-colors"
            >
              Begivenheder
            </Link>
            <span className="text-white/40">&rsaquo;</span>
            <span className="text-white/90">{event.title}</span>
          </nav>

          {event.category && (
            <span className="inline-block text-[10px] tracking-[1.5px] uppercase font-light text-brand-light bg-white/10 backdrop-blur-sm px-3 py-1.5 mb-4">
              {event.category}
            </span>
          )}

          <h1 className="font-newsreader font-extralight text-[clamp(2rem,5vw,3.5rem)] text-white leading-none [text-shadow:0_2px_16px_rgba(0,0,0,0.4)]">
            {event.title}
          </h1>

          {event.startDate && (
            <div className="flex items-center gap-4 mt-4 text-white/80">
              <div className="flex items-center gap-2">
                <CalendarDays
                  className="w-4 h-4 text-brand-light shrink-0"
                  strokeWidth={1.5}
                />
                <span className="text-[11px] tracking-[1px] uppercase font-light">
                  {formatDateRange(event.startDate, event.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock
                  className="w-4 h-4 text-brand-light shrink-0"
                  strokeWidth={1.5}
                />
                <span className="text-[11px] tracking-[1px] uppercase font-light">
                  {formatTimeRange(event.startDate, event.endDate)}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <section className="bg-warm-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-10 lg:px-16">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Left column: description + body + menu */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              {event.excerpt && (
                <p className="text-warm-brown font-light leading-7 text-lg">
                  {event.excerpt}
                </p>
              )}

              {Array.isArray(event.body) && event.body.length > 0 && (
                <div className="prose prose-base max-w-none font-light leading-relaxed prose-stone prose-headings:font-newsreader prose-headings:font-extralight prose-a:text-brand">
                  <PortableText value={event.body} />
                </div>
              )}

              {/* Menu */}
              {Array.isArray(event.menu) && event.menu.length > 0 && (
                <div className="border-t border-border-warm pt-10">
                  <h2 className="text-[11px] tracking-[1.4px] uppercase font-light text-dark-stone mb-8">
                    Menu
                  </h2>
                  <div className="flex flex-col gap-6">
                    {event.menu.map(
                      (
                        item: { course: string; description?: string },
                        i: number,
                      ) => (
                        <div key={i} className="flex flex-col gap-1">
                          <h3 className="font-newsreader font-extralight text-xl text-dark-stone">
                            {item.course}
                          </h3>
                          {item.description && (
                            <p className="text-warm-brown text-sm font-light italic">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: info card */}
            <div className="flex flex-col gap-8">
              <div className="border border-border-warm p-6 bg-warm-gray flex flex-col gap-5">
                <p className="text-[10px] tracking-[1.2px] uppercase text-warm-brown font-light">
                  Praktisk info
                </p>

                {/* Date */}
                {event.startDate && (
                  <div className="flex items-start gap-3">
                    <CalendarDays
                      className="w-4 h-4 text-brand mt-0.5 shrink-0"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-dark-stone text-sm font-light">
                        {formatDateRange(event.startDate, event.endDate)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Time */}
                {event.startDate && (
                  <div className="flex items-start gap-3">
                    <Clock
                      className="w-4 h-4 text-brand mt-0.5 shrink-0"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-dark-stone text-sm font-light">
                        {formatTimeRange(event.startDate, event.endDate)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Venue */}
                {event.venue && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="w-4 h-4 text-brand mt-0.5 shrink-0"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-dark-stone text-sm font-light">
                        {event.venue.title}
                      </p>
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {event.venue?.capacity && (
                  <div className="flex items-start gap-3">
                    <Users
                      className="w-4 h-4 text-brand mt-0.5 shrink-0"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-dark-stone text-sm font-light">
                        Op til {event.venue.capacity} gæster
                      </p>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="border-t border-border-warm/30 pt-4">
                  <p className="text-[10px] tracking-[1.2px] uppercase text-warm-brown font-light mb-1">
                    Pris
                  </p>
                  {event.price != null ? (
                    <p className="font-newsreader font-extralight text-3xl text-dark-stone">
                      {event.price === 0
                        ? "Gratis"
                        : `${event.price.toLocaleString("da-DK")} `}
                      {event.price > 0 && (
                        <span className="text-base ml-1 text-warm-brown">
                          kr.
                        </span>
                      )}
                    </p>
                  ) : (
                    <p className="text-warm-brown font-light text-sm">
                      Kontakt os for pris
                    </p>
                  )}
                  {event.priceDescription && (
                    <p className="text-warm-brown text-xs font-light mt-1">
                      {event.priceDescription}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    buttonVariants({ variant: "primary" }) + " text-center"
                  }
                >
                  Book plads
                </Link>

                <Link
                  href="/begivenheder"
                  className="text-center text-[11px] tracking-[1px] uppercase font-light text-warm-brown hover:text-brand transition-colors"
                >
                  &larr; Alle begivenheder
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-dark-stone py-16 lg:py-20 text-center">
        <div className="max-w-xl mx-auto px-8">
          <p className="text-[10px] tracking-[1.4px] uppercase font-light text-brand-light mb-4">
            Sikr din plads
          </p>
          <h2 className="font-newsreader font-extralight text-[clamp(1.5rem,3vw,2.25rem)] text-white mb-8 leading-snug">
            Vil du deltage i{" "}
            <span className="font-cormorant font-light italic">
              {event.title}?
            </span>
          </h2>
          <Link
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "primary" })}
          >
            Book plads
          </Link>
        </div>
      </section>
    </main>
  );
}
