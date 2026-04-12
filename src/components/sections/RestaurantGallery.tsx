import { SanityImage } from "@/components/SanityImage";
import { type GalleryImage } from "@/types/sanity";
import { dataAttr } from "@/sanity/lib/visual-editing";

interface RestaurantGalleryProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  galleryHeading?: string;
  galleryImages?: GalleryImage[];
}

export default function RestaurantGallery({
  _key,
  documentId,
  documentType,
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
            <div
              className="relative col-span-2 lg:col-span-1 lg:row-span-2 aspect-[4/3] lg:aspect-auto overflow-hidden bg-warm-gray"
              data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].galleryImages[_key=="${images[0]._key}"]`)}
            >
              <SanityImage image={images[0]} alt={images[0].alt ?? "Galleri"} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>
            {images.slice(1, 3).map((img) => (
              <div
                key={img._key}
                className="relative aspect-[4/3] overflow-hidden bg-warm-gray"
                data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].galleryImages[_key=="${img._key}"]`)}
              >
                <SanityImage image={img} alt={img.alt ?? "Galleri"} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
              </div>
            ))}
            {images[3] && (
              <div
                className="relative aspect-[4/3] overflow-hidden bg-warm-gray"
                data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].galleryImages[_key=="${images[3]._key}"]`)}
              >
                <SanityImage image={images[3]} alt={images[3].alt ?? "Galleri"} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {images.map((img) => (
              <div
                key={img._key}
                className="relative aspect-[4/3] overflow-hidden bg-warm-gray"
                data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].galleryImages[_key=="${img._key}"]`)}
              >
                <SanityImage image={img} alt={img.alt ?? "Galleri"} fill sizes="50vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
