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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SectionBlock = { _key: string; _type: string; [key: string]: any };

const sectionComponents: Record<string, React.ComponentType<Record<string, unknown>>> = {
  homeHeroSection: Hero as React.ComponentType<Record<string, unknown>>,
  welcomeSection: WelcomeSection as React.ComponentType<Record<string, unknown>>,
  eventsTeaserSection: EventsSection as React.ComponentType<Record<string, unknown>>,
  selskaberTeaserSection: SelskaberSection as React.ComponentType<Record<string, unknown>>,
  textImageSection: TextImageSection as React.ComponentType<Record<string, unknown>>,
  bannerSection: BannerSection as React.ComponentType<Record<string, unknown>>,
  richTextSection: RichTextSection as React.ComponentType<Record<string, unknown>>,
  gallerySection: GallerySection as React.ComponentType<Record<string, unknown>>,
  quoteSection: QuoteSection as React.ComponentType<Record<string, unknown>>,
  ctaBannerSection: CtaBannerSection as React.ComponentType<Record<string, unknown>>,
};

type SectionRendererProps = {
  documentId: string;
  documentType: string;
  sections?: SectionBlock[];
  events?: any[];
  globalBookTableUrl?: string;
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
  globalBookTableUrl,
}: SectionRendererProps) {
  // useOptimistic provides instant UI updates when sections are reordered
  // via drag-and-drop in the Presentation tool
  const sections = useOptimistic<
    SectionBlock[] | undefined,
    SanityDocument<{ sections?: SectionBlock[] }>
  >(initialSections, (currentSections, action) => {
    if (action.id === documentId && action.document.sections) {
      // Preserve full resolved data for sections that already exist locally,
      // use the new order from the mutation
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
        const Component = sectionComponents[section._type];
        if (!Component) {
          console.warn(`Unknown section type: ${section._type}`);
          return null;
        }

        // Handle specific props for certain sections
        const extraProps: Record<string, any> = {};
        if (section._type === "eventsTeaserSection") {
          extraProps.events = events;
        }
        if (section._type === "homeHeroSection") {
          extraProps.ctaPrimaryUrl = section.ctaPrimaryUrl || globalBookTableUrl;
          extraProps.backgroundVideoUrl = section.backgroundVideo?.asset?.url;
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
