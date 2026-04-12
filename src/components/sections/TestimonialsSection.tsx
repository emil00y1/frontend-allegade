import { SanityImage } from "@/components/SanityImage";
import { dataAttr } from "@/sanity/lib/visual-editing";

type Testimonial = {
  _key: string;
  quote?: string;
  name?: string;
  role?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
};

type TestimonialsSectionProps = {
  _key?: string;
  documentId?: string;
  documentType?: string;
  heading?: string;
  testimonials?: Testimonial[];
};

export default function TestimonialsSection({
  _key,
  documentId,
  documentType,
  heading,
  testimonials,
}: TestimonialsSectionProps) {
  if (!testimonials?.length) return null;

  return (
    <section className="bg-[#f5f0e8] py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        {heading && (
          <h2 className="font-serif text-3xl md:text-4xl xl:text-5xl font-light leading-[1.1] text-stone-900 mb-14 text-center">
            {heading}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t._key}
              className="bg-white p-8 flex flex-col"
            >
              <svg
                className="w-8 h-8 text-stone-300 mb-6 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>

              <blockquote className="font-serif text-lg md:text-xl font-light leading-relaxed italic text-stone-700 mb-8 flex-1">
                {t.quote}
              </blockquote>

              <div className="flex items-center gap-4 pt-6 border-t border-stone-200">
                {t.image?.asset && (
                  <div
                    data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].testimonials[_key=="${t._key}"].image`)}
                  >
                    <SanityImage
                      image={t.image}
                      alt={t.name || ""}
                      width={80}
                      height={80}
                      className="rounded-full object-cover w-10 h-10"
                    />
                  </div>
                )}
                <div>
                  {t.name && (
                    <p className="text-sm font-medium text-stone-900">
                      {t.name}
                    </p>
                  )}
                  {t.role && (
                    <p className="text-xs text-stone-500">{t.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
