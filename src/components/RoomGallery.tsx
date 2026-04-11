"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";

interface RoomGalleryImage {
  src: string;
  hiRes: string;
  alt: string;
}

interface RoomGalleryProps {
  images: RoomGalleryImage[];
  heading?: string;
}

export default function RoomGallery({ images, heading = "Galleri" }: RoomGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length <= 1) return null;

  const lightboxImages = images.map((img) => ({
    src: img.hiRes,
    alt: img.alt,
  }));

  return (
    <section className="bg-warm-gray py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        <h2 className="text-[11px] tracking-[1.4px] uppercase font-light text-dark-stone mb-8">
          {heading}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden bg-warm-gray cursor-pointer ${
                i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"
              }`}
              onClick={() => setLightboxIndex(i)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
