import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { type GalleryImage } from "@/types/sanity";

interface RestaurantGalleryProps {
  galleryHeading?: string;
  galleryImages?: GalleryImage[];
}

export default function RestaurantGallery({
  galleryHeading,
  galleryImages,
}: RestaurantGalleryProps) {
  const images = (galleryImages || []).slice(0, 4);
  if (images.length === 0) return null;

  return (
    <section className="bg-warm-white py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        {galleryHeading && <p className="text-[10px] tracking-[2px] uppercase text-brand mb-10 text-center">{galleryHeading}</p>}
        {images.length >= 3 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="relative col-span-2 lg:col-span-1 lg:row-span-2 aspect-[4/3] lg:aspect-auto overflow-hidden bg-warm-gray">
              <Image src={urlFor(images[0]).width(800).height(1000).auto("format").url()} alt={images[0].alt ?? "Galleri"} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>
            {images.slice(1, 3).map((img, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                <Image src={urlFor(img).width(700).height(520).auto("format").url()} alt={img.alt ?? "Galleri"} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
              </div>
            ))}
            {images[3] && (
              <div className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                <Image src={urlFor(images[3]).width(700).height(520).auto("format").url()} alt={images[3].alt ?? "Galleri"} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                <Image src={urlFor(img).width(700).height(520).auto("format").url()} alt={img.alt ?? "Galleri"} fill sizes="50vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
