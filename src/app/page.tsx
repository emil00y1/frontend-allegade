import { createDataAttribute } from "next-sanity";
import { draftMode } from "next/headers";
import Hero from "@/components/Hero";
import WelcomeSection from "@/components/WelcomeSection";
import EventsSection from "@/components/EventsSection";
import SelskaberSection from "@/components/SelskaberSection";
import { sanityFetch } from "@/sanity/lib/live";

const HOMEPAGE_QUERY = `*[_type == "homepage" && _id == "homepage"][0]{
  _id,
  _type,
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

  const { isEnabled: isDraft } = await draftMode();

  const hero = homepage?.hero;
  const welcome = homepage?.welcomeSection;
  const eventsSection = homepage?.eventsSection;
  const selskaber = homepage?.selskaberTeaser;

  const globalBookTableUrl =
    siteSettings?.ctaBookTableUrl ||
    "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";

  // Creates a data-sanity attribute for visual editing overlays (draft mode only)
  function attr(path: string) {
    if (!isDraft || !homepage?._id) return {};
    return {
      "data-sanity": createDataAttribute({
        id: homepage._id as string,
        type: (homepage._type ?? "homepage") as string,
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
          ctaPrimaryLabel={hero?.ctaPrimaryLabel}
          ctaPrimaryUrl={hero?.ctaPrimaryUrl || globalBookTableUrl}
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
          description={eventsSection?.description}
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

    </main>
  );
}

