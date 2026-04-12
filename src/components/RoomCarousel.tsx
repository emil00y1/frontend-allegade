"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SanityImage } from "@/components/SanityImage";

interface RoomImage {
  _key?: string;
  asset?: { _ref?: string; url?: string };
  alt?: string;
}

export interface HotelRoom {
  _id: string;
  title: string;
  slug?: { current: string };
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
}

interface RoomCarouselProps {
  rooms: HotelRoom[];
  bookingCtaUrl?: string;
  sectionHeading?: string;
  sectionHeadingItalic?: string;
}

/* ── Image slider for each room card ─────────────────────────────────── */

function RoomImageSlider({
  images,
  alt,
}: {
  images: RoomImage[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIndex((i) => (i - 1 + count) % count);
    },
    [count],
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIndex((i) => (i + 1) % count);
    },
    [count],
  );

  const current = images[index];

  return (
    <div className="group/slider relative w-full aspect-[4/3] overflow-hidden bg-warm-gray">
      {current?.asset ? (
        <SanityImage
          image={current}
          alt={current.alt ?? alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300"
        />
      ) : (
        <div className="absolute inset-0 bg-warm-white border border-border-warm flex items-center justify-center">
          <span className="text-[10px] tracking-[1px] uppercase text-warm-brown/50">
            Billede kommer snart
          </span>
        </div>
      )}

      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-dark-stone p-1.5 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 shadow-sm"
            aria-label="Forrige billede"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-dark-stone p-1.5 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 shadow-sm"
            aria-label="Næste billede"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </>
      )}

      {count > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                i === index ? "bg-white w-3" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Billede ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Room card ───────────────────────────────────────────────────────── */

function RoomCard({
  room,
  bookingCtaUrl,
}: {
  room: HotelRoom;
  bookingCtaUrl: string;
}) {
  const allImages: RoomImage[] = [];
  if (room.image) allImages.push(room.image);
  if (room.gallery) allImages.push(...room.gallery);

  const finalUrl =
    room.ctaUrl ?? bookingCtaUrl ?? "https://allegade10.suitcasebooking.com/da";
  const isExternal = finalUrl.startsWith("http");

  return (
    <div className="bg-warm-white shadow-sm overflow-hidden flex flex-col">
      <RoomImageSlider
        images={allImages.length > 0 ? allImages : [{}]}
        alt={room.title}
      />

      <div className="px-6 py-5 flex flex-col flex-1">
        {room.slug?.current ? (
          <Link href={`/hotel/vaerelser/${room.slug.current}`} className="group/title">
            <h3 className="font-newsreader font-extralight text-xl leading-7 text-dark-stone mb-2 group-hover/title:text-brand transition-colors duration-200">
              {room.title}
            </h3>
          </Link>
        ) : (
          <h3 className="font-newsreader font-extralight text-xl leading-7 text-dark-stone mb-2">
            {room.title}
          </h3>
        )}

        {room.description && (
          <p className="text-warm-brown text-sm leading-5 font-light mb-3">
            {room.description}
          </p>
        )}

        {room.features && room.features.length > 0 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
            {room.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 13 10"
                  fill="none"
                  className="shrink-0 text-brand"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5L4.5 8.5L12 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs text-dark-stone">{feat}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto border-t border-border-warm/30 pt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-[1px] uppercase text-dark-stone opacity-60 mb-0.5">
              {room.priceLabel ?? "Pris pr. nat"}
            </p>
            {room.pricePerNight ? (
              <p className="font-newsreader font-extralight text-lg text-dark-stone">
                {room.pricePerNight.toLocaleString("da-DK")} DKK
              </p>
            ) : (
              <p className="font-newsreader font-extralight text-sm text-warm-brown/70">
                Kontakt os
              </p>
            )}
          </div>
          <Link
            href={finalUrl}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="shrink-0 px-5 py-2.5 text-[10px] tracking-[1.5px] uppercase font-bold text-white bg-brand-mid hover:bg-brand transition-colors duration-300"
          >
            {room.ctaLabel ?? "Reserver"}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Room grid section ───────────────────────────────────────────────── */

export default function RoomCarousel({
  rooms,
  bookingCtaUrl = "https://allegade10.suitcasebooking.com/da",
  sectionHeading = "Udforsk vores værelser",
}: RoomCarouselProps) {
  if (!rooms || rooms.length === 0) return null;

  return (
    <section id="vaerelser" className="bg-warm-gray py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-dark-stone">
            {sectionHeading || "Udforsk vores værelser"}
          </h2>
        </div>

        {/* Room grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              bookingCtaUrl={bookingCtaUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
