import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { PortableText } from "next-sanity";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/lib/live";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const HOTEL_PAGE_QUERY = `*[_type == "hotelPage"][0]{
  heroImage,
  heroTitle,
  introHeading,
  body,
  catalogHeading,
  catalogDescription,
  ctaText,
  ctaUrl,
  galleryImages[]{_key, asset, alt}
}`;

export default async function HotelPage() {
  const { data: page } = await sanityFetch({ query: HOTEL_PAGE_QUERY });

  const heroImageUrl = page?.heroImage
    ? urlFor(page.heroImage)?.width(2070).height(1380).url()
    : null;

  const ctaText = page?.ctaText ?? "Book Ophold";
  const ctaUrl = page?.ctaUrl ?? "/book-ophold";

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-stone-300">
          {heroImageUrl && (
            <Image
              src={heroImageUrl}
              alt={page?.heroTitle ?? "Allégade 10 Hotel"}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black/30 z-0" />

        <div className="relative z-10 flex flex-col items-center text-center px-4 mt-16 max-w-4xl mx-auto">
          {page?.heroTitle && (
            <h1 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tight drop-shadow-sm">
              {page.heroTitle}
            </h1>
          )}
          <Link
            href={ctaUrl}
            className="group px-8 py-3.5 text-sm tracking-widest uppercase font-medium text-white border border-white/80 rounded hover:bg-white hover:text-stone-900 transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
          >
            <span>{ctaText}</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Intro Section */}
      {(page?.introHeading || page?.body) && (
        <section className="w-full py-24 px-6">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            {page?.introHeading && (
              <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-10 tracking-tight">
                {page.introHeading}
              </h2>
            )}
            {page?.body && (
              <div className="flex flex-col gap-6 text-base md:text-lg text-stone-600 font-light leading-relaxed prose prose-stone max-w-none">
                <PortableText value={page.body} />
              </div>
            )}
            <div className="mt-12">
              <Link
                href={ctaUrl}
                className="group inline-flex items-center gap-2 px-8 py-3 text-sm tracking-widest uppercase font-medium text-stone-900 border border-stone-300 rounded hover:bg-stone-900 hover:text-white transition-all duration-300"
              >
                <span>{ctaText}</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Room Catalog Section */}
      {(page?.catalogHeading || page?.galleryImages?.length > 0) && (
        <section className="w-full bg-white py-24 px-6 border-t border-stone-100">
          <div className="max-w-7xl mx-auto">
            {(page?.catalogHeading || page?.catalogDescription) && (
              <div className="text-center mb-16">
                {page?.catalogHeading && (
                  <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-6 tracking-tight">
                    {page.catalogHeading}
                  </h2>
                )}
                {page?.catalogDescription && (
                  <p className="text-stone-500 font-light max-w-xl mx-auto">
                    {page.catalogDescription}
                  </p>
                )}
              </div>
            )}

            {page?.galleryImages?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {page.galleryImages.map(
                  (img: {
                    _key: string;
                    asset: SanityImageSource;
                    alt?: string;
                  }) => (
                    <div
                      key={img._key}
                      className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100"
                    >
                      <Image
                        src={urlFor(img.asset)?.width(800).height(600).url()!}
                        alt={img.alt ?? "Værelse billede"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
