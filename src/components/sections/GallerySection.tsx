"use client";

import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import { SanityImage } from "@/components/SanityImage";
import Lightbox from "@/components/Lightbox";
import { dataAttr } from "@/sanity/lib/visual-editing";

type GalleryImage = {
  _key: string;
  alt?: string;
  caption?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asset?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type GallerySectionProps = {
  _key?: string;
  documentId?: string;
  documentType?: string;
  heading?: string;
  images?: GalleryImage[];
  columns?: "2" | "3" | "4";
  aspectRatio?: "landscape" | "square" | "portrait";
};

const colsMap = {
  "2": "grid-cols-1 md:grid-cols-2",
  "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

const aspectMap = {
  landscape: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/3] md:aspect-[3/4]",
};

const dimensionsMap = {
  landscape: { width: 800, height: 450 },
  square: { width: 700, height: 700 },
  portrait: { width: 600, height: 800 },
};

export default function GallerySection({
  _key,
  documentId,
  documentType,
  heading,
  images,
  columns = "3",
  aspectRatio = "landscape",
}: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const dims = dimensionsMap[aspectRatio];

  const validImages = images.filter((img) => img?.asset);

  const lightboxImages = validImages.map((img) => ({
    src: urlFor(img).width(1600).auto("format").url(),
    alt: img.alt,
  }));

  return (
    <section className="bg-warm-white py-14 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {heading && (
          <h2 className="font-serif text-3xl md:text-4xl font-light text-dark-stone mb-12 text-center">
            {heading}
          </h2>
        )}

        <div className={`grid ${colsMap[columns]} gap-4`}>
          {images.map((img, idx) => {
            if (!img?.asset) return null;
            const validIndex = validImages.indexOf(img);
            return (
              <figure
                key={img._key}
                className="group overflow-hidden cursor-pointer"
                onClick={() => setLightboxIndex(validIndex)}
              >
                <div
                  className={`relative ${aspectMap[aspectRatio]} overflow-hidden bg-warm-gray`}
                  data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].images[_key=="${img._key}"]`)}
                >
                  <SanityImage
                    image={img}
                    alt={img.alt ?? ""}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes={`(max-width: 768px) 100vw, ${Math.round(100 / Number(columns))}vw`}
                  />
                </div>
                {img.caption && (
                  <figcaption className="mt-2 text-xs tracking-widest uppercase text-warm-brown/70 text-center">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
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
