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

const SELSKABER_PAGE_QUERY = `*[_type == "selskaberPage"][0]{
  heroImage,
  heroTitle,
  mainHeading,
  contentDK,
  contentUK,
  contactPhone,
  contactEmail,
  galleryHeading,
  galleryImages[]{_key, asset, alt}
}`;

export default async function SelskaberPage() {
  const { data: page } = await sanityFetch({ query: SELSKABER_PAGE_QUERY });

  const heroImageUrl = page?.heroImage
    ? urlFor(page.heroImage)?.width(2070).height(1380).url()
    : null;

  const phone = page?.contactPhone;
  const email = page?.contactEmail;

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-stone-300">
          {heroImageUrl && (
            <Image
              src={heroImageUrl}
              alt={page?.heroTitle ?? "Selskabslokale"}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10 flex flex-col items-center text-center px-4 mt-16 max-w-4xl mx-auto">
          {page?.heroTitle && (
            <h1 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tight drop-shadow-sm">
              {page.heroTitle}
            </h1>
          )}
        </div>
      </section>

      {/* Info Section */}
      {(page?.mainHeading || page?.contentDK || page?.contentUK) && (
        <section className="w-full py-24 px-6 bg-stone-50">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            {page?.mainHeading && (
              <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-12 tracking-tight">
                {page.mainHeading}
              </h2>
            )}

            <div className="flex flex-col gap-12 text-base md:text-lg text-stone-600 font-light leading-relaxed">
              {/* DK Section */}
              {page?.contentDK && (
                <div>
                  <h3 className="text-sm font-medium tracking-widest text-stone-400 uppercase mb-4">
                    DK
                  </h3>
                  <div className="prose prose-stone max-w-none">
                    <PortableText value={page.contentDK} />
                  </div>
                  {(phone || email) && (
                    <p className="mt-4">
                      {phone && (
                        <>
                          Ring til os på{" "}
                          <a
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="font-medium text-stone-900 hover:text-stone-600 transition-colors"
                          >
                            {phone}
                          </a>
                        </>
                      )}
                      {phone && email && " eller skriv til "}
                      {email && (
                        <a
                          href={`mailto:${email}`}
                          className="font-medium text-amber-700 hover:text-amber-800 transition-colors"
                        >
                          {email}
                        </a>
                      )}
                      {(phone || email) &&
                        ", så hjælper vi gerne med at finde den løsning der passer bedst til jeres selskab."}
                    </p>
                  )}
                </div>
              )}

              {page?.contentDK && page?.contentUK && (
                <div className="w-12 h-px bg-stone-200 mx-auto" />
              )}

              {/* UK Section */}
              {page?.contentUK && (
                <div>
                  <h3 className="text-sm font-medium tracking-widest text-stone-400 uppercase mb-4">
                    UK
                  </h3>
                  <div className="prose prose-stone max-w-none">
                    <PortableText value={page.contentUK} />
                  </div>
                  {(phone || email) && (
                    <p className="mt-4">
                      {phone && (
                        <>
                          You are welcome to call us at{" "}
                          <a
                            href={`tel:+45${phone.replace(/\s/g, "")}`}
                            className="font-medium text-stone-900 hover:text-stone-600 transition-colors"
                          >
                            +45 {phone}
                          </a>
                        </>
                      )}
                      {phone && email && " or email "}
                      {email && (
                        <a
                          href={`mailto:${email}`}
                          className="font-medium text-amber-700 hover:text-amber-800 transition-colors"
                        >
                          {email}
                        </a>
                      )}
                      {(phone || email) &&
                        ", and we will be happy to help you plan the right arrangement for your party."}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Venues Gallery Section */}
      {(page?.galleryHeading || page?.galleryImages?.length > 0) && (
        <section className="w-full bg-white py-24 px-6 border-t border-stone-100">
          <div className="max-w-7xl mx-auto">
            {page?.galleryHeading && (
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-tight uppercase">
                  {page.galleryHeading}
                </h2>
              </div>
            )}

            {page?.galleryImages?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {page.galleryImages.map(
                  (img: { _key: string; asset: SanityImageSource; alt?: string }) => (
                    <div
                      key={img._key}
                      className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100"
                    >
                      <Image
                        src={urlFor(img.asset)?.width(800).height(600).url()!}
                        alt={img.alt ?? "Selskabslokale"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
