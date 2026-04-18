import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";
import type { TypedObject } from "sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/lib/image";
import { buttonVariants } from "@/lib/button-variants";
import StructuredData from "@/components/StructuredData";
import RoomGallery from "@/components/RoomGallery";

interface RoomImage {
  asset?: { _ref?: string; url?: string };
  alt?: string;
}

interface RoomPageData {
  _id: string;
  title: string;
  slug: { current: string };
  roomType?: string;
  pricePerNight?: number;
  priceLabel?: string;
  description?: string;
  note?: string;
  features?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  image?: RoomImage;
  gallery?: RoomImage[];
  body?: TypedObject[];
}

const ROOM_QUERY = `*[_type == "hotelRoom" && slug.current == $slug][0]{
  _id, title, slug, roomType, pricePerNight, priceLabel,
  description, note, features, ctaLabel, ctaUrl,
  seo,
  image{ ..., asset-> },
  gallery[]{ ..., asset-> },
  body
}`;

const ROOM_SLUGS_QUERY = `*[_type == "hotelRoom" && defined(slug.current)]{ "slug": slug.current }`;

export async function generateStaticParams() {
  const rooms = await client.fetch<Array<{ slug: string }>>(ROOM_SLUGS_QUERY);
  return (rooms ?? []).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({ query: ROOM_QUERY, params: { slug } });
  const room = data as RoomPageData | null;
  if (!room) return {};

  const seo = (room as any).seo;
  const title = seo?.metaTitle || room.title;
  const description = seo?.metaDescription || room.description;
  const ogImage = seo?.shareImage
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : room.image?.asset
      ? urlFor(room.image).width(1200).height(630).url()
      : undefined;

  return {
    title: `${title} | Hotel Allégade 10`,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await sanityFetch({ query: ROOM_QUERY, params: { slug } });
  const room = data as RoomPageData | null;

  if (!room) notFound();

  const bookingUrl =
    room.ctaUrl ?? "https://allegade10.suitcasebooking.com/da";
  const isExternal = bookingUrl.startsWith("http");

  const heroImageUrl = room.image?.asset
    ? urlFor(room.image).width(1600).height(1000).auto("format").url()
    : null;

  const galleryImages: RoomImage[] = [];
  if (room.image) galleryImages.push(room.image);
  if (room.gallery) galleryImages.push(...room.gallery);

  const roomSchema = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: room.title,
    ...(room.description && { description: room.description }),
    ...(room.roomType && { bed: room.roomType }),
    ...(heroImageUrl && { image: heroImageUrl }),
    ...(room.features?.length && {
      amenityFeature: room.features.map((feat) => ({
        "@type": "LocationFeatureSpecification",
        name: feat,
        value: true,
      })),
    }),
    ...(room.pricePerNight && {
      offers: {
        "@type": "Offer",
        price: room.pricePerNight,
        priceCurrency: "DKK",
        url: bookingUrl,
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: room.pricePerNight,
          priceCurrency: "DKK",
          unitCode: "NIG",
          unitText: "night",
        },
      },
    }),
    containedInPlace: {
      "@type": "Hotel",
      name: "Hotel Allégade 10",
      url: "https://allegade10.dk/hotel",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Allégade 10",
        addressLocality: "Frederiksberg",
        postalCode: "2000",
        addressCountry: "DK",
      },
    },
  };

  return (
    <main>
      <StructuredData data={roomSchema} />
      {/* Hero */}
      <section className="relative bg-warm-gray min-h-[50vh] lg:min-h-[65vh] overflow-hidden">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={room.title}
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
            <Link href="/hotel" className="hover:text-white transition-colors">Hotel</Link>
            <span className="text-white/40">›</span>
            <Link href="/hotel#vaerelser" className="hover:text-white transition-colors">Alle værelser</Link>
            <span className="text-white/40">›</span>
            <span className="text-white/90">{room.title}</span>
          </nav>
          <h1 className="font-newsreader font-extralight text-[clamp(2rem,5vw,3.5rem)] text-white leading-none [text-shadow:0_2px_16px_rgba(0,0,0,0.4)]">
            {room.title}
          </h1>
          {room.roomType && (
            <p className="text-[11px] tracking-[1.6px] uppercase font-light text-white/80 mt-3">
              {room.roomType}
            </p>
          )}
        </div>
      </section>

      {/* Main content */}
      <section className="bg-warm-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-10 lg:px-16">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Left: description + body */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {room.description && (
                <p className="text-warm-brown font-light leading-7 text-base">
                  {room.description}
                </p>
              )}

              {room.body && room.body.length > 0 && (
                <div className="prose prose-base max-w-none font-light leading-relaxed prose-stone prose-headings:font-newsreader prose-headings:font-extralight prose-a:text-brand">
                  <PortableText value={room.body} />
                </div>
              )}

              {room.note && (
                <p className="text-sm text-warm-brown/80 font-light italic border-l-2 border-brand/30 pl-4">
                  {room.note}
                </p>
              )}
            </div>

            {/* Right: price + features + CTA */}
            <div className="flex flex-col gap-8">
              {/* Pricing */}
              <div className="border border-border-warm p-6 bg-warm-gray flex flex-col gap-4">
                <div>
                  <p className="text-[10px] tracking-[1.2px] uppercase text-warm-brown font-light mb-1">
                    {room.priceLabel ?? "Pris pr. nat"}
                  </p>
                  {room.pricePerNight ? (
                    <p className="font-newsreader font-extralight text-3xl text-dark-stone">
                      {room.pricePerNight.toLocaleString("da-DK")}
                      <span className="text-base ml-1 text-warm-brown"> DKK</span>
                    </p>
                  ) : (
                    <p className="text-warm-brown font-light text-sm">Kontakt os for pris</p>
                  )}
                </div>

                <Link
                  href={bookingUrl}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={buttonVariants({ variant: "primary" }) + " text-center"}
                >
                  {room.ctaLabel ?? "Book ophold"}
                </Link>

                <Link
                  href="/hotel#vaerelser"
                  className="text-center text-[11px] tracking-[1px] uppercase font-light text-warm-brown hover:text-brand transition-colors"
                >
                  ← Se alle værelser
                </Link>
              </div>

              {/* Features */}
              {room.features && room.features.length > 0 && (
                <div>
                  <h2 className="text-[11px] tracking-[1.4px] uppercase font-light text-dark-stone mb-4">
                    Faciliteter
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {room.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 13 10"
                          fill="none"
                          className="shrink-0 text-brand"
                        >
                          <path
                            d="M1 5L4.5 8.5L12 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm text-warm-brown font-light">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <RoomGallery
        images={galleryImages
          .filter((img) => img?.asset)
          .map((img) => ({
            src: urlFor(img).width(800).height(600).auto("format").url(),
            hiRes: urlFor(img).width(1600).auto("format").url(),
            alt: img.alt ?? room.title,
          }))}
      />

      {/* Bottom CTA */}
      <section className="bg-dark-stone py-16 lg:py-20 text-center">
        <div className="max-w-xl mx-auto px-8">
          <p className="text-[10px] tracking-[1.4px] uppercase font-light text-brand-light mb-4">
            Book dit ophold
          </p>
          <h2 className="font-newsreader font-extralight text-[clamp(1.5rem,3vw,2.25rem)] text-white mb-8 leading-snug">
            Klar til at booke{" "}
            <span className="font-cormorant font-light italic">{room.title}?</span>
          </h2>
          <Link
            href={bookingUrl}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={buttonVariants({ variant: "primary" })}
          >
            {room.ctaLabel ?? "Book ophold"}
          </Link>
        </div>
      </section>
    </main>
  );
}
