"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

interface RoomImage {
  _key?: string;
  asset?: { _ref?: string; url?: string };
  alt?: string;
}

export interface HotelRoom {
  _id: string;
  title: string;
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

export default function RoomCarousel({
  rooms,
  bookingCtaUrl = "https://allegade10.suitcasebooking.com/da",
  sectionHeading = "Udforsk",
  sectionHeadingItalic = "Værelserne",
}: RoomCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!rooms || rooms.length === 0) return null;

  const room = rooms[activeIndex];

  // Build image list: primary image first, then gallery
  const allImages: RoomImage[] = [];
  if (room.image) allImages.push(room.image);
  if (room.gallery) allImages.push(...room.gallery);

  const mainImage = allImages[0];
  const thumbImages = allImages.slice(1, 4);
  const extraCount = Math.max(0, allImages.length - 4);

  const prev = () => setActiveIndex((i) => (i - 1 + rooms.length) % rooms.length);
  const next = () => setActiveIndex((i) => (i + 1) % rooms.length);

  return (
    <section id="vaerelser" className="bg-warm-gray py-24 lg:py-32">
      {/* Section heading */}
      <div className="px-10 lg:px-16 mb-10 text-center">
        <h2 className="text-[clamp(2rem,4vw,3rem)] leading-none inline">
          <span className="font-newsreader font-extralight text-dark-stone">
            {sectionHeading}{" "}
          </span>
          <span className="font-cormorant font-light italic text-dark-stone">
            {sectionHeadingItalic}
          </span>
        </h2>
      </div>

      {/* Room tabs */}
      {rooms.length > 1 && (
        <div className="px-10 lg:px-16 mb-10">
          <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap">
            {rooms.map((r, i) => (
              <button
                key={r._id}
                onClick={() => setActiveIndex(i)}
                className={`px-6 py-2.5 text-[11px] tracking-[1.2px] uppercase font-light transition-all duration-200 border ${
                  i === activeIndex
                    ? "bg-brand text-white border-brand"
                    : "bg-transparent text-warm-brown border-border-warm hover:border-brand hover:text-dark-stone"
                }`}
              >
                {r.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative px-10 lg:px-16">
        {/* Prev/next arrows — sides of the section */}
        {rooms.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-warm-white/90 hover:bg-warm-white text-dark-stone p-2 transition-all duration-200 shadow-md"
              aria-label="Forrige værelse"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-warm-white/90 hover:bg-warm-white text-dark-stone p-2 transition-all duration-200 shadow-md"
              aria-label="Næste værelse"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
          {/* Gallery — 8 cols */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Main image */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-warm-gray">
              {mainImage?.asset ? (
                <Image
                  src={urlFor(mainImage).width(1200).height(675).auto("format").url()}
                  alt={mainImage.alt ?? room.title}
                  fill
                  className="object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="absolute inset-0 bg-warm-white border border-border-warm flex items-center justify-center">
                  <span className="text-[10px] tracking-[1px] uppercase text-warm-brown/50">
                    Billede kommer snart
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {thumbImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {thumbImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden bg-warm-gray"
                  >
                    {img.asset && (
                      <Image
                        src={urlFor(img).width(400).height(400).auto("format").url()}
                        alt={img.alt ?? "Værelse detalje"}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                ))}
                {extraCount > 0 && (
                  <div className="relative aspect-square bg-warm-white border border-border-warm flex items-center justify-center">
                    <span className="text-[10px] tracking-[1px] uppercase text-dark-stone">
                      +{extraCount} Fotos
                    </span>
                  </div>
                )}
                {thumbImages.length < 3 && extraCount === 0 &&
                  Array.from({ length: 3 - thumbImages.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="aspect-square bg-warm-white border border-border-warm"
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Room Card — 4 cols */}
          <div className="lg:col-span-4 bg-warm-white border-l-4 border-brand px-10 py-10 flex flex-col justify-between shadow-sm">
            <div className="flex flex-col gap-4 pb-10">
              {room.roomType && (
                <span className="text-[10px] tracking-[1px] uppercase font-bold text-brand">
                  {room.roomType}
                </span>
              )}
              <h3 className="font-newsreader font-extralight text-[1.875rem] leading-9 text-dark-stone">
                {room.title}
              </h3>
              {room.description && (
                <p className="text-warm-brown text-base leading-6 font-light pt-2">
                  {room.description}
                </p>
              )}
              {room.note && (
                <p className="text-warm-brown/70 text-sm leading-5 font-light italic">
                  {room.note}
                </p>
              )}
              {room.features && room.features.length > 0 && (
                <ul className="flex flex-col gap-4 pt-4">
                  {room.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg
                        width="13"
                        height="10"
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
                      <span className="text-sm text-dark-stone">{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Price + CTA */}
            <div className="border-t border-border-warm/30 pt-8 flex flex-col gap-6">
              <div>
                <p className="text-[10px] tracking-[1px] uppercase text-dark-stone opacity-60 mb-1">
                  {room.priceLabel ?? "Pris pr. nat"}
                </p>
                {room.pricePerNight ? (
                  <p className="font-newsreader font-extralight text-2xl text-dark-stone">
                    {room.pricePerNight.toLocaleString("da-DK")} DKK
                  </p>
                ) : (
                  <p className="font-newsreader font-extralight text-lg text-warm-brown/70">
                    Kontakt os
                  </p>
                )}
              </div>
              {(() => {
                const finalUrl = room.ctaUrl ?? bookingCtaUrl ?? "https://allegade10.suitcasebooking.com/da";
                const isExternal = finalUrl.startsWith("http");
                return (
                  <Link
                    href={finalUrl}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="px-8 py-4 text-[11px] tracking-[2.2px] uppercase font-bold text-white bg-brand-mid hover:bg-brand transition-colors duration-300"
                  >
                    {room.ctaLabel ?? "Reserver nu"}
                  </Link>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
