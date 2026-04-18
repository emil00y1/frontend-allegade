"use client";

import { useState, useCallback, useMemo } from "react";
import { ZoomIn } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { SanityImage } from "@/components/SanityImage";
import Lightbox from "@/components/Lightbox";
import { dataAttr } from "@/sanity/lib/visual-editing";

type GalleryImage = {
  _key: string;
  alt?: string;
  caption?: string;
  category?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asset?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type GallerySectionProps = {
  _key?: string;
  documentId?: string;
  documentType?: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  images?: GalleryImage[];
  columns?: "2" | "3" | "4";
  layout?: "grid" | "magazine";
  aspectRatio?: "landscape" | "square" | "portrait";
  initialCount?: number;
};

const colsMap = {
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-2 md:grid-cols-3",
  "4": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

const aspectMap = {
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

// Magazine layout: 3-column grid where every group of 5 starts with a
// wide feature image (col-span-2), followed by 4 square thumbnails.
function MagazineGrid({
  images,
  sectionKey,
  documentId,
  documentType,
  onOpen,
}: {
  images: GalleryImage[];
  sectionKey?: string;
  documentId?: string;
  documentType?: string;
  onOpen: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
      {images.map((img, idx) => {
        const groupPos = idx % 5; // 0 = feature, 1-4 = thumbnails
        const isFeatured = groupPos === 0;
        return (
          <figure
            key={img._key}
            className={`group relative overflow-hidden cursor-pointer bg-warm-gray ${
              isFeatured ? "col-span-2 aspect-[16/9]" : "aspect-square"
            }`}
            onClick={() => onOpen(idx)}
            data-sanity={dataAttr(
              documentId,
              documentType,
              `sections[_key=="${sectionKey}"].images[_key=="${img._key}"]`,
            )}
          >
            <SanityImage
              image={img}
              alt={img.alt ?? ""}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes={
                isFeatured
                  ? "(max-width: 768px) 100vw, 66vw"
                  : "(max-width: 768px) 50vw, 33vw"
              }
            />
            <GalleryOverlay caption={img.caption} />
          </figure>
        );
      })}
    </div>
  );
}

function GalleryOverlay({ caption }: { caption?: string }) {
  return (
    <div className="absolute inset-0 bg-dark-stone/0 group-hover:bg-dark-stone/30 transition-all duration-300 flex flex-col items-center justify-center">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
        <ZoomIn className="w-6 h-6 text-warm-white" strokeWidth={1.5} />
        {caption && (
          <span className="text-warm-white text-[11px] tracking-[1.2px] uppercase px-4 text-center line-clamp-2">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}

const DEFAULT_INITIAL = 9;

export default function GallerySection({
  _key,
  documentId,
  documentType,
  eyebrow,
  heading,
  subheading,
  images,
  columns = "3",
  layout = "grid",
  aspectRatio = "landscape",
  initialCount = DEFAULT_INITIAL,
}: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const validImages = useMemo(() => (images ?? []).filter((img) => img?.asset), [images]);

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  if (validImages.length === 0) return null;

  const shownImages = validImages.slice(0, visibleCount);
  const hasMore = visibleCount < validImages.length;

  const lightboxImages = useMemo(() => validImages.map((img) => ({
    src: urlFor(img).width(1600).auto("format").url(),
    alt: img.alt,
    caption: img.caption,
  })), [validImages]);

  return (
    <section className="bg-warm-white py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Section header */}
        {(eyebrow || heading || subheading) && (
          <div className="text-center mb-12 md:mb-16">
            {eyebrow && (
              <p className="text-brand text-[11px] tracking-[2.5px] uppercase font-light mb-4">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-newsreader font-light text-dark-stone text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-warm-brown font-normal text-base max-w-xl mx-auto leading-7">
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        {layout === "magazine" ? (
          <MagazineGrid
            images={shownImages}
            sectionKey={_key}
            documentId={documentId}
            documentType={documentType}
            onOpen={openLightbox}
          />
        ) : (
          <div className={`grid ${colsMap[columns]} gap-2 md:gap-3`}>
            {shownImages.map((img, idx) => (
              <figure
                key={img._key}
                className="group relative overflow-hidden cursor-pointer bg-warm-gray"
                onClick={() => openLightbox(idx)}
                data-sanity={dataAttr(
                  documentId,
                  documentType,
                  `sections[_key=="${_key}"].images[_key=="${img._key}"]`,
                )}
              >
                <div className={`relative ${aspectMap[aspectRatio]}`}>
                  <SanityImage
                    image={img}
                    alt={img.alt ?? ""}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes={`(max-width: 640px) 50vw, ${Math.round(100 / Number(columns))}vw`}
                  />
                  <GalleryOverlay caption={img.caption} />
                </div>
                {img.caption && (
                  <figcaption className="px-1 pt-2 pb-1 text-[10px] tracking-[1.2px] uppercase text-warm-brown/60 text-center">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="text-center mt-10 md:mt-14">
            <button
              onClick={() => setVisibleCount((c) => c + initialCount)}
              className="inline-flex items-center gap-2 border border-border-warm text-dark-stone text-[11px] tracking-[2px] uppercase font-light px-8 py-4 hover:border-dark-stone/50 transition-colors"
            >
              Vis flere billeder
              <span className="text-warm-brown/50">
                ({validImages.length - visibleCount} tilbage)
              </span>
            </button>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </section>
  );
}
