"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { type SanityImage } from "@/types/sanity";

interface DualLandingPageProps {
  restaurantImage?: SanityImage;
  hotelImage?: SanityImage;
}

export default function DualLandingPage({
  restaurantImage,
  hotelImage,
}: DualLandingPageProps) {
  const [hovered, setHovered] = useState<"restaurant" | "hotel" | null>(null);

  const restaurantImageUrl = restaurantImage?.asset
    ? urlFor(restaurantImage).width(1600).height(1200).auto("format").url()
    : null;

  const hotelImageUrl = hotelImage?.asset
    ? urlFor(hotelImage).width(1600).height(1200).auto("format").url()
    : null;

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden">
      {/* Restaurant Panel */}
      <Link
        href="/restaurant"
        className={cn(
          "relative flex-1 overflow-hidden group",
          "h-1/2 md:h-full",
          "transition-[flex] duration-500 ease-in-out",
          hovered === "restaurant" ? "md:flex-[6]" : hovered === "hotel" ? "md:flex-[4]" : "md:flex-[5]",
        )}
        onMouseEnter={() => setHovered("restaurant")}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Background image */}
        {restaurantImageUrl ? (
          <Image
            src={restaurantImageUrl}
            alt="Restaurant"
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-800" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Label */}
        <div className="absolute bottom-10 left-8 md:bottom-14 md:left-12 flex items-end gap-4">
          <span
            className="font-cormorant font-light italic text-white leading-none tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 7vw, 8rem)" }}
          >
            Restaurant
          </span>
          <ArrowUpRight
            className="text-white/70 mb-2 md:mb-3 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            size={28}
          />
        </div>
      </Link>

      {/* Divider */}
      <div className="hidden md:block w-px bg-white/20 z-10 self-stretch" />

      {/* Hotel Panel */}
      <Link
        href="/hotel"
        className={cn(
          "relative flex-1 overflow-hidden group",
          "h-1/2 md:h-full",
          "transition-[flex] duration-500 ease-in-out",
          hovered === "hotel" ? "md:flex-[6]" : hovered === "restaurant" ? "md:flex-[4]" : "md:flex-[5]",
        )}
        onMouseEnter={() => setHovered("hotel")}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Background image */}
        {hotelImageUrl ? (
          <Image
            src={hotelImageUrl}
            alt="Hotel"
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-700" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Label */}
        <div className="absolute bottom-10 left-8 md:bottom-14 md:left-12 flex items-end gap-4">
          <span
            className="font-cormorant font-light italic text-white leading-none tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 7vw, 8rem)" }}
          >
            Hotel
          </span>
          <ArrowUpRight
            className="text-white/70 mb-2 md:mb-3 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            size={28}
          />
        </div>
      </Link>
    </div>
  );
}
