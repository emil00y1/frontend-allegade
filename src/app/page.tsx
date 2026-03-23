import { type SanityDocument, createDataAttribute } from "next-sanity";
import { draftMode } from "next/headers";
import Hero from "@/components/Hero";
import WelcomeSection from "@/components/WelcomeSection";
import EventsSection from "@/components/EventsSection";
import SelskaberSection from "@/components/SelskaberSection";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";

const HOMEPAGE_QUERY = `*[_type == "homepage" && _id == "homepage"][0]{
  _id,
  _type,
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
  eventsSection{
    eyebrow, heading, allEventsLabel, allEventsUrl, eventCtaLabel
  },
  selskaberTeaser{
    heading, description, ctaLabel, ctaUrl,
    backgroundImage{ ..., asset-> }
  }
}`;

const EVENTS_QUERY = `*[_type == "event" && defined(slug.current)]
  | order(startDate asc)[0...3]{
    _id, title, slug, startDate, category,
    image{ ..., asset-> }
  }`;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
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

  const { isEnabled: isDraft } = await draftMode();

  const hero = homepage?.hero;
  const welcome = homepage?.welcomeSection;
  const eventsSection = homepage?.eventsSection;
  const selskaber = homepage?.selskaberTeaser;

  // Creates a data-sanity attribute for visual editing overlays (draft mode only)
  function attr(path: string) {
    if (!isDraft || !homepage?._id) return {};
    return {
      "data-sanity": createDataAttribute({
        id: homepage._id,
        type: homepage._type ?? "homepage",
        path,
      })(),
    };
  }

  return (
    <main>
      <div {...attr("hero")}>
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
      </div>

      <div {...attr("welcomeSection")}>
        <WelcomeSection
          eyebrow={welcome?.eyebrow}
          heading={welcome?.heading}
          paragraph1={welcome?.paragraph1}
          paragraph2={welcome?.paragraph2}
          linkLabel={welcome?.linkLabel}
          linkUrl={welcome?.linkUrl}
          image={welcome?.image}
        />
      </div>

      <div {...attr("eventsSection")}>
        <EventsSection
          events={events || []}
          eyebrow={eventsSection?.eyebrow}
          heading={eventsSection?.heading}
          allEventsLabel={eventsSection?.allEventsLabel}
          allEventsUrl={eventsSection?.allEventsUrl}
          eventCtaLabel={eventsSection?.eventCtaLabel}
        />
      </div>

      <div {...attr("selskaberTeaser")}>
        <SelskaberSection
          heading={selskaber?.heading}
          description={selskaber?.description}
          ctaLabel={selskaber?.ctaLabel}
          ctaUrl={selskaber?.ctaUrl}
          backgroundImage={selskaber?.backgroundImage}
        />
      </div>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
