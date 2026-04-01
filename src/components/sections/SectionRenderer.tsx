"use client";

import { createDataAttribute, useOptimistic } from "@sanity/visual-editing";
import type { SanityDocument } from "@sanity/client";
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
};

type SectionRendererProps = {
  documentId: string;
  documentType: string;
  sections?: SectionBlock[];
  events?: any[];
  rooms?: any[];
  menus?: any[];
  occasionLabels?: string[];
  upcomingEvents?: any[];
  pastEvents?: any[];
  featuredEvent?: any;
  globalBookTableUrl?: string;
  breadcrumbHomeLabel?: string;
};

const dataAttrConfig = {
  projectId: "b0bkhf04",
  dataset: "production",
  baseUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333",
};

export default function SectionRenderer({
  documentId,
  documentType,
  sections: initialSections,
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
  const sections = useOptimistic<
    SectionBlock[] | undefined,
    SanityDocument<{ sections?: SectionBlock[] }>
  >(initialSections, (currentSections, action) => {
    if (action.id === documentId && action.document.sections) {
      return action.document.sections.map(
        (section) =>
          currentSections?.find((s) => s._key === section?._key) || section,
      );
    }
    return currentSections;
  });

  if (!sections || sections.length === 0) return null;

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
        // Handle reusable block references — render nested content sections
        if (section._type === "reusableBlockReferenceSection") {
          const blockContent = section.block?.content;
          if (!blockContent || !Array.isArray(blockContent)) return null;
          return (
            <div key={section._key}>
              {blockContent.map((nestedSection: SectionBlock) => {
                const NestedComponent = sectionComponents[nestedSection._type];
                if (!NestedComponent) return null;
                return (
                  <div key={nestedSection._key}>
                    <NestedComponent {...nestedSection} />
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

        const extraProps: Record<string, any> = {};
        if (section._type === "eventsTeaserSection") {
          extraProps.events = events;
        }
        if (["homeHeroSection", "restaurantHeroSection", "hotelHeroSection", "selskaberHeroSection", "menuHeroSection"].includes(section._type)) {
          extraProps.ctaPrimaryUrl = section.ctaPrimaryUrl || globalBookTableUrl;
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
