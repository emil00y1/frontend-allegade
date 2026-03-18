import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
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
  galleryHeading,
  galleryImages[]{_key, asset, alt}
}`;

export default async function SelskaberPage() {
  const { data: page } = await sanityFetch({ query: SELSKABER_PAGE_QUERY });

  const heroImageUrl = page?.heroImage
    ? urlFor(page.heroImage)?.width(2070).height(1380).url()
    : "https://images.unsplash.com/photo-1466978913421-bac160b86a88?q=80&w=2070&auto=format&fit=crop";

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-stone-200">
          <Image
            src={heroImageUrl!}
            alt={page?.heroTitle ?? "Selskabslokale"}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 mt-16 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tight drop-shadow-sm">
            {page?.heroTitle ?? "Selskaber"}
          </h1>
        </div>
      </section>

      {/* Info Section */}
      <section className="w-full py-24 px-6 bg-stone-50">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-12 tracking-tight">
            {page?.mainHeading ?? "Fejr dit selskab med stil!"}
          </h2>

          <div className="flex flex-col gap-12 text-base md:text-lg text-stone-600 font-light leading-relaxed">
            {/* DK Section */}
            <div>
              <h3 className="text-sm font-medium tracking-widest text-stone-400 uppercase mb-4">
                DK
              </h3>
              {page?.contentDK ? (
                <div className="prose prose-stone max-w-none">
                  <PortableText value={page.contentDK} />
                </div>
              ) : (
                <>
                  <p className="mb-4">
                    Har du spørgsmål til vores selskabsmenuer, eller ønsker du
                    at høre nærmere om mulighederne for et arrangement hos os,
                    er du altid velkommen til at kontakte os.
                  </p>
                  <p>
                    Ring til os på{" "}
                    <a
                      href="tel:33311751"
                      className="font-medium text-stone-900 hover:text-stone-600 transition-colors"
                    >
                      33 31 17 51
                    </a>{" "}
                    eller skriv til{" "}
                    <a
                      href="mailto:info@allegade10.dk"
                      className="font-medium text-amber-700 hover:text-amber-800 transition-colors"
                    >
                      info@allegade10.dk
                    </a>
                    , så hjælper vi gerne med at finde den løsning der passer
                    bedst til jeres selskab.
                  </p>
                </>
              )}
            </div>

            <div className="w-12 h-px bg-stone-200 mx-auto"></div>

            {/* UK Section */}
            <div>
              <h3 className="text-sm font-medium tracking-widest text-stone-400 uppercase mb-4">
                UK
              </h3>
              {page?.contentUK ? (
                <div className="prose prose-stone max-w-none">
                  <PortableText value={page.contentUK} />
                </div>
              ) : (
                <>
                  <p className="mb-4">
                    If you have any questions about our group menus or would
                    like to learn more about hosting an event with us, please
                    feel free to contact us.
                  </p>
                  <p>
                    You are welcome to call us at{" "}
                    <a
                      href="tel:+4533311751"
                      className="font-medium text-stone-900 hover:text-stone-600 transition-colors"
                    >
                      +45 33 31 17 51
                    </a>{" "}
                    or email{" "}
                    <a
                      href="mailto:info@allegade10.dk"
                      className="font-medium text-amber-700 hover:text-amber-800 transition-colors"
                    >
                      info@allegade10.dk
                    </a>
                    , and we will be happy to help you plan the right
                    arrangement for your party.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Venues Gallery Section */}
      <section className="w-full bg-white py-24 px-6 border-t border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-tight uppercase">
              {page?.galleryHeading ?? "Se Vores Lokaler!"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {page?.galleryImages?.length > 0
              ? page.galleryImages.map(
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
                )
              : [1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100 cursor-pointer"
                  >
                    <Image
                      src={`https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop&sig=${i}`}
                      alt={`Selskabslokale preview ${i}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                ))}
          </div>
        </div>
      </section>
    </main>
  );
}
