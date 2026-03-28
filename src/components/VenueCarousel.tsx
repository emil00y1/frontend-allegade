"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface VenueItem {
  _key: string;
  name?: string;
  capacity?: string;
  imageUrl?: string | null;
}

interface VenueCarouselProps {
  venues: VenueItem[];
  ctaLabel?: string;
  eyebrow?: string;
  heading?: string;
}

export default function VenueCarousel({
  venues,
  ctaLabel = "Forespørg om lokalet",
  eyebrow,
  heading = "Vores Selskabslokaler",
}: VenueCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const navigate = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-card]");
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth + 16; // 16 = gap-4
    el.scrollBy({ left: dir === "next" ? cardWidth : -cardWidth, behavior: "smooth" });
  };

  return (
    <section className="bg-warm-white py-14 md:py-24 lg:py-32">
      {/* Heading row */}
      <div className="max-w-[1280px] mx-auto px-10 lg:px-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            {eyebrow && (
              <p className="font-cormorant font-light italic text-brand text-xl mb-2">
                {eyebrow}
              </p>
            )}
            <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] text-dark-stone leading-none">
              {heading}
            </h2>
          </div>

          <div className="flex items-center gap-2 mb-1 shrink-0">
            <button
              onClick={() => navigate("prev")}
              disabled={!canPrev}
              aria-label="Forrige lokale"
              className={`w-9 h-9 flex items-center justify-center border transition-colors duration-200 ${
                canPrev
                  ? "border-dark-stone/30 text-dark-stone hover:border-dark-stone"
                  : "border-border-warm/40 text-dark-stone/20 cursor-not-allowed"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M7.5 1.5L3 6L7.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => navigate("next")}
              disabled={!canNext}
              aria-label="Næste lokale"
              className={`w-9 h-9 flex items-center justify-center border transition-colors duration-200 ${
                canNext
                  ? "border-dark-stone/30 text-dark-stone hover:border-dark-stone"
                  : "border-border-warm/40 text-dark-stone/20 cursor-not-allowed"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M4.5 1.5L9 6L4.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll track — left-padded, bleeds right */}
      <div className="pl-10 lg:pl-16">
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
          {venues.map((venue) => (
            <div
              key={venue._key}
              data-card
              className="snap-start shrink-0 min-w-[76%] sm:min-w-[44%] lg:min-w-[calc(25%-12px)] group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[3/2] bg-warm-gray overflow-hidden">
                {venue.imageUrl ? (
                  <Image
                    src={venue.imageUrl}
                    alt={venue.name ?? "Lokale"}
                    fill
                    sizes="(max-width: 640px) 76vw, (max-width: 1024px) 44vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-warm-gray" />
                )}
              </div>

              {/* Info */}
              <div className="pt-5 pr-4 flex flex-col gap-1.5">
                <h3 className="font-newsreader font-extralight text-[1.2rem] text-dark-stone leading-tight">
                  {venue.name}
                </h3>
                {venue.capacity && (
                  <p className="text-[10px] tracking-[1.5px] uppercase text-brand font-light">
                    {venue.capacity}
                  </p>
                )}
                <a
                  href="#foresporgsel"
                  className="mt-3 inline-flex items-center gap-2 text-[10px] tracking-[1.5px] uppercase text-dark-stone/50 border-b border-dark-stone/15 pb-0.5 w-fit hover:text-dark-stone hover:border-dark-stone/40 transition-colors duration-200"
                >
                  {ctaLabel}
                  <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1 9L9 1M9 1H3M9 1V7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}

          {/* Right-edge breathing room */}
          <div className="shrink-0 w-10 lg:w-16" aria-hidden />
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-[1280px] mx-auto px-10 lg:px-16 mt-8">
        <div className="h-px bg-dark-stone/10 relative">
          <div
            className="absolute inset-y-0 left-0 bg-dark-stone/35 transition-[width] duration-100"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
