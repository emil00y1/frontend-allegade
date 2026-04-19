import { createDataAttribute } from "@sanity/visual-editing";
import TextImageSection from "@/components/TextImageSection";
import BannerSection from "./BannerSection";
import RichTextSection from "./RichTextSection";
import GallerySection from "./GallerySection";
import QuoteSection from "./QuoteSection";
import CtaBannerSection from "./CtaBannerSection";
import Hero from "@/components/Hero";
import WelcomeSection from "@/components/WelcomeSection";
import EventsSection from "@/components/EventsSection";
import SelskaberSection from "@/components/SelskaberSection";
import RestaurantHero from "./RestaurantHero";
import RestaurantStory from "./RestaurantStory";
import RestaurantMenuTeaser from "./RestaurantMenuTeaser";
import RestaurantPhilosophy from "./RestaurantPhilosophy";
import RestaurantGallery from "./RestaurantGallery";
import HotelHero from "./HotelHero";
import HotelFacilities from "./HotelFacilities";
import HotelRoomShowcase from "./HotelRoomShowcase";
import HotelPracticalInfo from "./HotelPracticalInfo";
import HotelNeighborhood from "./HotelNeighborhood";
import HotelRestaurantTeaser from "./HotelRestaurantTeaser";
import HotelStory from "./HotelStory";
import HotelArrival from "./HotelArrival";
import SelskaberHero from "./SelskaberHero";
import SelskaberOccasions from "./SelskaberOccasions";
import SelskaberVenues from "./SelskaberVenues";
import SelskaberMenu from "./SelskaberMenu";
import SelskaberCtaBanner from "./SelskaberCtaBanner";
import SelskaberForm from "./SelskaberForm";
import MenuHero from "./MenuHero";
import MenuTabsSection from "./MenuTabsSection";
import EventsHero from "./EventsHero";
import EventsList from "./EventsList";
import EventsArchive from "./EventsArchive";
import FaqSection from "./FaqSection";
import TestimonialsSection from "./TestimonialsSection";
import TeamSection from "./TeamSection";
import OffersSection from "./OffersSection";
import JobListingSection from "./JobListingSection";
import ContactSection from "./ContactSection";

// NOTE: This is intentionally a server component.
// Previously it was "use client" to host useOptimistic for visual editing
// latency; that made every imported section a client module and inflated the
// production bundle. Live updates from Sanity Studio now flow through
// <SanityLive /> via defineLive's revalidation channel, so the optimistic
// indirection was redundant here.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SectionBlock = { _key: string; _type: string; [key: string]: any };

const sectionComponents: Record<string, React.ComponentType<Record<string, unknown>>> = {
  homeHeroSection: Hero as React.ComponentType<Record<string, unknown>>,
  welcomeSection: WelcomeSection as React.ComponentType<Record<string, unknown>>,
  eventsTeaserSection: EventsSection as React.ComponentType<Record<string, unknown>>,
  selskaberTeaserSection: SelskaberSection as React.ComponentType<Record<string, unknown>>,
  restaurantHeroSection: RestaurantHero as React.ComponentType<Record<string, unknown>>,
  restaurantStorySection: RestaurantStory as React.ComponentType<Record<string, unknown>>,
  restaurantMenuTeaserSection: RestaurantMenuTeaser as React.ComponentType<Record<string, unknown>>,
  restaurantPhilosophySection: RestaurantPhilosophy as React.ComponentType<Record<string, unknown>>,
  restaurantGallerySection: RestaurantGallery as React.ComponentType<Record<string, unknown>>,
  hotelHeroSection: HotelHero as React.ComponentType<Record<string, unknown>>,
  hotelFacilitiesSection: HotelFacilities as React.ComponentType<Record<string, unknown>>,
  hotelRoomShowcaseSection: HotelRoomShowcase as React.ComponentType<Record<string, unknown>>,
  hotelPracticalInfoSection: HotelPracticalInfo as React.ComponentType<Record<string, unknown>>,
  hotelNeighborhoodSection: HotelNeighborhood as React.ComponentType<Record<string, unknown>>,
  hotelRestaurantTeaserSection: HotelRestaurantTeaser as React.ComponentType<Record<string, unknown>>,
  hotelStorySection: HotelStory as React.ComponentType<Record<string, unknown>>,
  hotelArrivalSection: HotelArrival as React.ComponentType<Record<string, unknown>>,
  selskaberHeroSection: SelskaberHero as React.ComponentType<Record<string, unknown>>,
  selskaberOccasionsSection: SelskaberOccasions as React.ComponentType<Record<string, unknown>>,
  selskaberVenuesSection: SelskaberVenues as React.ComponentType<Record<string, unknown>>,
  selskaberMenuSection: SelskaberMenu as React.ComponentType<Record<string, unknown>>,
  selskaberCtaBannerSection: SelskaberCtaBanner as React.ComponentType<Record<string, unknown>>,
  selskaberFormSection: SelskaberForm as React.ComponentType<Record<string, unknown>>,
  menuHeroSection: MenuHero as React.ComponentType<Record<string, unknown>>,
  menuTabsSection: MenuTabsSection as React.ComponentType<Record<string, unknown>>,
  eventsHeroSection: EventsHero as React.ComponentType<Record<string, unknown>>,
  eventsListSection: EventsList as React.ComponentType<Record<string, unknown>>,
  eventsArchiveSection: EventsArchive as React.ComponentType<Record<string, unknown>>,
  textImageSection: TextImageSection as React.ComponentType<Record<string, unknown>>,
  bannerSection: BannerSection as React.ComponentType<Record<string, unknown>>,
  richTextSection: RichTextSection as React.ComponentType<Record<string, unknown>>,
  gallerySection: GallerySection as React.ComponentType<Record<string, unknown>>,
  quoteSection: QuoteSection as React.ComponentType<Record<string, unknown>>,
  ctaBannerSection: CtaBannerSection as React.ComponentType<Record<string, unknown>>,
  faqSection: FaqSection as React.ComponentType<Record<string, unknown>>,
  testimonialsSection: TestimonialsSection as React.ComponentType<Record<string, unknown>>,
  teamSection: TeamSection as React.ComponentType<Record<string, unknown>>,
  offersSection: OffersSection as React.ComponentType<Record<string, unknown>>,
  jobListingSection: JobListingSection as React.ComponentType<Record<string, unknown>>,
  contactSection: ContactSection as React.ComponentType<Record<string, unknown>>,
};

type SectionRendererProps = {
  documentId: string;
  documentType: string;
  sections?: SectionBlock[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rooms?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menus?: any[];
  occasionLabels?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upcomingEvents?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pastEvents?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  featuredEvent?: any;
  globalBookTableUrl?: string;
  breadcrumbHomeLabel?: string;
};

const dataAttrConfig = {
  projectId: "b0bkhf04",
  dataset: "production",
  baseUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333",
};

function buildExtraProps(
  section: SectionBlock,
  ctx: Omit<SectionRendererProps, "sections">,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  const {
    documentId,
    documentType,
    events,
    rooms,
    menus,
    occasionLabels,
    upcomingEvents,
    pastEvents,
    featuredEvent,
    globalBookTableUrl,
    breadcrumbHomeLabel,
  } = ctx;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraProps: Record<string, any> = { documentId, documentType };

  if (section._type === "eventsTeaserSection") {
    extraProps.events = events;
  }
  if (
    [
      "homeHeroSection",
      "restaurantHeroSection",
      "hotelHeroSection",
      "selskaberHeroSection",
      "menuHeroSection",
    ].includes(section._type)
  ) {
    if (section._type === "homeHeroSection") {
      extraProps.cta = {
        label: section.cta?.label,
        url: section.cta?.url || globalBookTableUrl,
      };
      extraProps.ctaSecondary = section.ctaSecondary;
    }
    extraProps.backgroundVideoUrl = section.backgroundVideo?.asset?.url;
    extraProps.breadcrumbHomeLabel = breadcrumbHomeLabel;
    extraProps.globalBookTableUrl = globalBookTableUrl;
    extraProps.bookingCtaUrl = section.bookingCtaUrl || globalBookTableUrl;
  }
  if (section._type === "hotelRoomShowcaseSection") {
    extraProps.rooms = rooms;
    extraProps.bookingCtaUrl = globalBookTableUrl;
  }
  if (section._type === "selskaberFormSection") {
    extraProps.occasionLabels = occasionLabels;
  }
  if (section._type === "menuTabsSection") {
    extraProps.menus = menus;
    extraProps.globalBookTableUrl = globalBookTableUrl;
  }
  if (section._type === "eventsHeroSection") {
    extraProps.featuredEvent = featuredEvent;
    extraProps.breadcrumbHomeLabel = breadcrumbHomeLabel;
  }
  if (section._type === "eventsListSection") {
    extraProps.upcomingEvents = upcomingEvents;
  }
  if (section._type === "eventsArchiveSection") {
    extraProps.pastEvents = pastEvents;
  }
  return extraProps;
}

export default function SectionRenderer({
  documentId,
  documentType,
  sections,
  events,
  rooms,
  menus,
  occasionLabels,
  upcomingEvents,
  pastEvents,
  featuredEvent,
  globalBookTableUrl,
  breadcrumbHomeLabel,
}: SectionRendererProps) {
  if (!sections || sections.length === 0) return null;

  const ctx = {
    documentId,
    documentType,
    events,
    rooms,
    menus,
    occasionLabels,
    upcomingEvents,
    pastEvents,
    featuredEvent,
    globalBookTableUrl,
    breadcrumbHomeLabel,
  };

  return (
    <div
      data-sanity={createDataAttribute({
        ...dataAttrConfig,
        id: documentId,
        type: documentType,
        path: "sections",
      }).toString()}
    >
      {sections.map((section) => {
        // Reusable block references — render nested sections inline.
        if (section._type === "reusableBlockReferenceSection") {
          const blockContent = section.block?.content;
          if (!blockContent || !Array.isArray(blockContent)) return null;
          return (
            <div key={section._key}>
              {blockContent.map((nestedSection: SectionBlock) => {
                const NestedComponent = sectionComponents[nestedSection._type];
                if (!NestedComponent) return null;
                const nestedExtra = buildExtraProps(nestedSection, ctx);
                return (
                  <div
                    key={nestedSection._key}
                    data-sanity={createDataAttribute({
                      ...dataAttrConfig,
                      id: documentId,
                      type: documentType,
                      path: `sections[_key=="${section._key}"].block->content[_key=="${nestedSection._key}"]`,
                    }).toString()}
                  >
                    <NestedComponent {...nestedSection} {...nestedExtra} />
                  </div>
                );
              })}
            </div>
          );
        }

        const Component = sectionComponents[section._type];
        if (!Component) {
          console.warn(`Unknown section type: ${section._type}`);
          return null;
        }

        const extraProps = buildExtraProps(section, ctx);

        return (
          <div
            key={section._key}
            data-sanity={createDataAttribute({
              ...dataAttrConfig,
              id: documentId,
              type: documentType,
              path: `sections[_key=="${section._key}"]`,
            }).toString()}
          >
            <Component {...section} {...extraProps} />
          </div>
        );
      })}
    </div>
  );
}
