import { type SanityDocument } from "next-sanity";
import Hero from "@/components/Hero";
import WelcomeSection from "@/components/WelcomeSection";
import EventsSection from "@/components/EventsSection";
import SelskaberSection from "@/components/SelskaberSection";
import HotelTeaserSection from "@/components/HotelTeaserSection";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";

const HOMEPAGE_QUERY = `*[_type == "homepage"][0]{
  hero{
    tagline, heading, headingItalic, description,
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
  selskaberTeaser{
    heading, description, ctaLabel, ctaUrl,
    backgroundImage{ ..., asset-> }
  },
  hotelTeaser{
    eyebrow, heading, pricingText, description, ctaLabel, ctaUrl,
    image{ ..., asset-> }
  }
}`;

const EVENTS_QUERY = `*[_type == "event" && defined(slug.current)]
  | order(startDate asc)[0...3]{
    _id, title, slug, startDate, category,
    image{ ..., asset-> }
  }`;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  address, phone, email, footerDescription, socialLinks,
  restaurantHours, kitchenHours
}`;

export default async function IndexPage() {
  const [{ data: homepage }, { data: events }, { data: siteSettings }] =
    await Promise.all([
      sanityFetch<SanityDocument>({ query: HOMEPAGE_QUERY }),
      sanityFetch<SanityDocument[]>({ query: EVENTS_QUERY }),
      sanityFetch<SanityDocument>({ query: SITE_SETTINGS_QUERY }),
    ]);

  const hero = homepage?.hero;
  const welcome = homepage?.welcomeSection;
  const selskaber = homepage?.selskaberTeaser;
  const hotel = homepage?.hotelTeaser;

  return (
    <main>
      <Hero
        tagline={hero?.tagline}
        heading={hero?.heading}
        headingItalic={hero?.headingItalic}
        description={hero?.description}
        ctaPrimaryLabel={hero?.ctaPrimaryLabel}
        ctaPrimaryUrl={hero?.ctaPrimaryUrl}
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

      <EventsSection events={events || []} />

      <SelskaberSection
        heading={selskaber?.heading}
        description={selskaber?.description}
        ctaLabel={selskaber?.ctaLabel}
        ctaUrl={selskaber?.ctaUrl}
        backgroundImage={selskaber?.backgroundImage}
      />

      <HotelTeaserSection
        eyebrow={hotel?.eyebrow}
        heading={hotel?.heading}
        pricingText={hotel?.pricingText}
        description={hotel?.description}
        ctaLabel={hotel?.ctaLabel}
        ctaUrl={hotel?.ctaUrl}
        image={hotel?.image}
      />

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
