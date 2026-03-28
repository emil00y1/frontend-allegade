import { draftMode } from "next/headers";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import WelcomeSection from "@/components/WelcomeSection";
import EventsSection from "@/components/EventsSection";
import SelskaberSection from "@/components/SelskaberSection";
import { SectionRenderer } from "@/components/sections";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";

const HOMEPAGE_QUERY = `*[_type == "homepage" && _id == "homepage"][0]{
  _id,
  _type,
  seo,
  sections[]{
    ...,
    _type == "homeHeroSection" => {
      ...,
      backgroundVideo{ asset->{ url } },
      backgroundImage{ ..., asset-> }
    },
    _type == "welcomeSection" => {
      ...,
      image{ ..., asset-> }
    },
    _type == "selskaberTeaserSection" => {
      ...,
      backgroundImage{ ..., asset-> }
    },
    _type == "textImageSection" => {
      ...,
      image{ ..., asset-> }
    },
    _type == "bannerSection" => {
      ...,
      backgroundImage{ ..., asset-> }
    },
    _type == "gallerySection" => {
      ...,
      images[]{ ..., asset-> }
    }
  },
  // Fallbacks for existing data (just in case)
  hero{
    tagline, heading, headingItalic,
    ctaPrimaryLabel, ctaPrimaryUrl,
    ctaSecondaryLabel, ctaSecondaryUrl,
    sideText,
    backgroundVideo{ asset->{ url } },
    backgroundImage{ ..., asset-> }
  },
  welcomeSection{
    eyebrow, heading, paragraph1, paragraph2, linkLabel, linkUrl,
    image{ ..., asset-> }
  },
  eventsSection{
    eyebrow, heading, description, allEventsLabel, allEventsUrl, eventCtaLabel
  },
  selskaberTeaser{
    heading, description, ctaLabel, ctaUrl,
    backgroundImage{ ..., asset-> }
  }
}`;

const EVENTS_QUERY = `*[_type == "event" && defined(slug.current)]
  | order(startDate asc)[0...4]{
    _id, title, slug, startDate, category,
    image{ ..., asset-> }
  }`;
const SITE_SETTINGS_QUERY = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  address, phone, email, footerDescription, socialLinks,
  restaurantHours, kitchenHours, ctaBookTableUrl,
  newsletterLabel, newsletterSubtext, newsletterButtonLabel
}`;

export async function generateMetadata(): Promise<Metadata> {
  const { data: homepage } = await sanityFetch<any>({ query: HOMEPAGE_QUERY });
  const { data: siteSettings } = await sanityFetch<any>({ query: SITE_SETTINGS_QUERY });

  const seo = homepage?.seo;
  const hero = homepage?.sections?.find((s: any) => s._type === "homeHeroSection") || homepage?.hero;

  const title = seo?.metaTitle || homepage?.title || "Forside";
  const description = seo?.metaDescription || hero?.tagline || siteSettings?.footerDescription;
  
  const ogImage = seo?.shareImage 
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : hero?.backgroundImage 
      ? urlFor(hero.backgroundImage).width(1200).height(630).url()
      : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function IndexPage() {
  const [{ data: homepage }, { data: events }, { data: siteSettings }] =
    await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sanityFetch<any>({ query: HOMEPAGE_QUERY }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sanityFetch<any>({ query: EVENTS_QUERY }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sanityFetch<any>({ query: SITE_SETTINGS_QUERY }),
    ]);

  const globalBookTableUrl =
    siteSettings?.ctaBookTableUrl ||
    "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";

  // If no sections are defined in the new Page Builder, use the old fixed layout as fallback
  const hasSections = homepage?.sections && homepage.sections.length > 0;

  if (!hasSections) {
    const hero = homepage?.hero;
    const welcome = homepage?.welcomeSection;
    const eventsSection = homepage?.eventsSection;
    const selskaber = homepage?.selskaberTeaser;

    return (
      <main>
        <Hero
          tagline={hero?.tagline}
          heading={hero?.heading}
          headingItalic={hero?.headingItalic}
          ctaPrimaryLabel={hero?.ctaPrimaryLabel}
          ctaPrimaryUrl={hero?.ctaPrimaryUrl || globalBookTableUrl}
          ctaSecondaryLabel={hero?.ctaSecondaryLabel}
          ctaSecondaryUrl={hero?.ctaSecondaryUrl}
          sideText={hero?.sideText}
          backgroundVideoUrl={hero?.backgroundVideo?.asset?.url}
          backgroundImage={hero?.backgroundImage}
        />
        <WelcomeSection
          eyebrow={welcome?.eyebrow}
          heading={welcome?.heading}
          paragraph1={welcome?.paragraph1}
          paragraph2={welcome?.paragraph2}
          linkLabel={welcome?.linkLabel}
          linkUrl={welcome?.linkUrl}
          image={welcome?.image}
        />
        <EventsSection
          events={events || []}
          eyebrow={eventsSection?.eyebrow}
          heading={eventsSection?.heading}
          description={eventsSection?.description}
          allEventsLabel={eventsSection?.allEventsLabel}
          allEventsUrl={eventsSection?.allEventsUrl}
          eventCtaLabel={eventsSection?.eventCtaLabel}
        />
        <SelskaberSection
          heading={selskaber?.heading}
          description={selskaber?.description}
          ctaLabel={selskaber?.ctaLabel}
          ctaUrl={selskaber?.ctaUrl}
          backgroundImage={selskaber?.backgroundImage}
        />
      </main>
    );
  }

  return (
    <main>
      <SectionRenderer
        documentId={homepage?._id ?? "homepage"}
        documentType={homepage?._type ?? "homepage"}
        sections={homepage?.sections}
        events={events || []}
        globalBookTableUrl={globalBookTableUrl}
      />
    </main>
  );
}
