"use client";

import { useState, useRef, useEffect } from "react";
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
  const [showScrollHint, setShowScrollHint] = useState(true);
  const tabBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tabBarRef.current;
    if (!el) return;
    const check = () => setShowScrollHint(el.scrollLeft < 10);
    el.addEventListener("scroll", check, { passive: true });
    return () => el.removeEventListener("scroll", check);
  }, []);

  const active = items.find((o) => o._key === activeKey) ?? items[0];

  const imageUrl = active?.image?.asset
    ? urlFor(active.image).width(900).height(700).auto("format").url()
    : null;

  return (
    <section className="bg-warm-gray py-24">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        {/* Tab bar */}
        <div className="relative mb-16">
          <div ref={tabBarRef} className="border-b border-border-warm/30 flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((occasion) => {
            const isActive = occasion._key === activeKey;
            return (
              <button
                key={occasion._key}
                onClick={() => setActiveKey(occasion._key)}
                className={cn(
                  "shrink-0 px-8 py-5 text-[11px] tracking-[1.5px] uppercase font-light border-b-2 transition-all duration-200 focus:outline-none",
                  isActive
                    ? "border-brand text-brand"
                    : "border-transparent text-warm-brown/60 hover:text-dark-stone"
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
              "pointer-events-none absolute inset-y-0 right-0 w-16 flex items-center justify-end pr-2 transition-opacity duration-300 md:hidden",
              showScrollHint ? "opacity-100" : "opacity-0"
            )}
            style={{ background: "linear-gradient(to right, transparent, var(--warm-gray) 70%)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-warm-brown/50">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: text */}
          <div className="flex flex-col gap-6">
            <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3.5vw,2.75rem)] text-dark-stone leading-tight">
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
          <div className="relative aspect-[4/3] lg:aspect-[3/4] overflow-hidden bg-[#e5e2e1]">
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
      </div>
    </section>
  );
}
