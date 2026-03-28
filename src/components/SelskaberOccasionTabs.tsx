"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

export interface Occasion {
  _key: string;
  label?: string;
  heading?: string;
  description?: string;
  capacity?: string;
  facilities?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
}

interface SelskaberOccasionTabsProps {
  occasions: Occasion[];
}

const AUTO_ADVANCE_MS = 8000;

const DEFAULT_OCCASIONS: Occasion[] = [
  {
    _key: "bryllup",
    label: "Bryllup",
    heading: "Uforglemmelige Bryllupper",
    description:
      "Lad jeres kærlighedshistorie blive en del af vores historie. Vi tilbyder de mest romantiske rammer på Frederiksberg med plads til både reception og den store festmiddag.",
    capacity: "Op til 120 gæster",
    facilities: "Egen bar & terrasse",
  },
  {
    _key: "barnedab",
    label: "Barnedåb",
    heading: "Fejr den nye Verdensborger",
    description:
      "En varm og hyggelig ramme til at fejre livets første store dag. Vi sørger for det hele, så I kan nyde øjeblikket med familie og venner.",
    capacity: "Op til 60 gæster",
    facilities: "Privat sal",
  },
  {
    _key: "foedselsdag",
    label: "Fødselsdag",
    heading: "En Dag I Aldrig Glemmer",
    description:
      "Fra den runde fødselsdag til den intime middag med de nærmeste. Vi skræddersyr aftenen efter jeres ønsker og gør den til noget helt særligt.",
    capacity: "Op til 80 gæster",
    facilities: "Fleksibel opstilling",
  },
  {
    _key: "firmafest",
    label: "Firmafest",
    heading: "Styrk Jeres Fællesskab",
    description:
      "Uanset om det er den årlige julefrokost, et teambuilding-arrangement eller en reception — vi leverer professionelle rammer og en uforglemmelig oplevelse.",
    capacity: "Op til 120 gæster",
    facilities: "AV-udstyr tilgængeligt",
  },
  {
    _key: "konfirmation",
    label: "Konfirmation",
    heading: "Markér det Store Skridt",
    description:
      "Fejr konfirmanden med stil i historiske omgivelser. Vi hjælper med at skabe en dag, konfirmanden og hele familien vil huske for altid.",
    capacity: "Op til 80 gæster",
    facilities: "Tilpasset menu",
  },
];

export default function SelskaberOccasionTabs({
  occasions,
}: SelskaberOccasionTabsProps) {
  const items = occasions.length > 0 ? occasions : DEFAULT_OCCASIONS;
  const [activeKey, setActiveKey] = useState(items[0]?._key ?? "");
  const [visible, setVisible] = useState(true);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const pendingKeyRef = useRef<string | null>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const activeIndex = items.findIndex((o) => o._key === activeKey);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const FADE_MS = 175;

  const switchTo = useCallback(
    (key: string) => {
      if (key === activeKey) return;
      pendingKeyRef.current = key;
      setVisible(false);
      setTimeout(() => {
        setActiveKey(key);
        setProgress(0);
        startTimeRef.current = Date.now();
        pendingKeyRef.current = null;
        setVisible(true);
      }, FADE_MS);
    },
    [activeKey],
  );

  const advanceTab = useCallback(() => {
    const idx = items.findIndex((o) => o._key === activeKey);
    const next = (idx + 1) % items.length;
    switchTo(items[next]._key);
  }, [items, activeKey, switchTo]);

  // Auto-advance timer
  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now() - progress * AUTO_ADVANCE_MS;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = elapsed / AUTO_ADVANCE_MS;
      if (pct >= 1) {
        advanceTab();
      } else {
        setProgress(pct);
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, activeKey, advanceTab, progress]);

  const handleTabClick = (key: string) => switchTo(key);

  // Scroll hint
  useEffect(() => {
    const el = tabBarRef.current;
    if (!el) return;
    const check = () => setShowScrollHint(el.scrollLeft < 10);
    el.addEventListener("scroll", check, { passive: true });
    return () => el.removeEventListener("scroll", check);
  }, []);

  const active = items.find((o) => o._key === activeKey) ?? items[0];

  const imageUrl = active?.image?.asset
    ? urlFor(active.image).width(800).height(530).auto("format").url()
    : null;

  return (
    <section
      className="bg-warm-gray py-14 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        {/* Tab bar */}
        <div className="relative mb-16">
          <div
            ref={tabBarRef}
            className="border-b border-border-warm/30 flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((occasion) => {
              const isActive = occasion._key === activeKey;
              return (
                <button
                  key={occasion._key}
                  onClick={() => handleTabClick(occasion._key)}
                  className={cn(
                    "shrink-0 px-8 py-5 text-[11px] tracking-[1.5px] uppercase font-light border-b-2 transition-all duration-200 focus:outline-none",
                    isActive
                      ? "border-brand text-brand"
                      : "border-transparent text-warm-brown/60 hover:text-dark-stone",
                  )}
                >
                  {occasion.label ?? occasion._key}
                </button>
              );
            })}
          </div>

          {/* Scroll hint — mobile only */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 w-16 flex items-center justify-end pr-2 transition-opacity duration-125 md:hidden",
              showScrollHint ? "opacity-100" : "opacity-0",
            )}
            style={{
              background:
                "linear-gradient(to right, transparent, var(--warm-gray) 70%)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-warm-brown/50"
            >
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div
          className={cn(
            "grid lg:grid-cols-2 gap-16 lg:gap-20 items-center min-h-[340px] transition-opacity duration-300 ease-in-out",
            visible ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Left: text */}
          <div className="flex flex-col gap-6">
            <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] text-dark-stone leading-tight">
              {active?.heading}
            </h2>

            <p className="text-warm-brown font-light leading-7 text-base max-w-lg">
              {active?.description}
            </p>

            {(active?.capacity || active?.facilities) && (
              <div className="border-t border-border-warm/20 pt-8 mt-2 grid grid-cols-2 gap-8">
                {active.capacity && (
                  <div>
                    <p className="text-[10px] tracking-[1px] uppercase text-brand mb-1.5">
                      Kapacitet
                    </p>
                    <p className="font-newsreader font-light text-lg text-dark-stone leading-snug">
                      {active.capacity}
                    </p>
                  </div>
                )}
                {active.facilities && (
                  <div>
                    <p className="text-[10px] tracking-[1px] uppercase text-brand mb-1.5">
                      Faciliteter
                    </p>
                    <p className="font-newsreader font-light text-lg text-dark-stone leading-snug">
                      {active.facilities}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: image */}
          <div className="relative aspect-[3/2] overflow-hidden bg-[#e5e2e1]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={active?.heading ?? ""}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#e5e2e1]" />
            )}
          </div>
        </div>

        {/* Timer bar */}
        <div className="mt-10 flex gap-1.5">
          {items.map((item, idx) => (
            <button
              key={item._key}
              onClick={() => handleTabClick(item._key)}
              className="relative h-[3px] flex-1 bg-border-warm/20 overflow-hidden cursor-pointer"
              aria-label={item.label ?? item._key}
            >
              <div
                className={cn(
                  "absolute inset-y-0 left-0 bg-brand transition-none",
                  idx < activeIndex && "w-full",
                  idx > activeIndex && "w-0",
                )}
                style={
                  idx === activeIndex
                    ? { width: `${progress * 100}%` }
                    : undefined
                }
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

