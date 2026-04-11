import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import MenuHero from "@/components/sections/MenuHero";
import MenuTabsSection from "@/components/sections/MenuTabsSection";
import { SectionRenderer } from "@/components/sections";
import { type SiteSettings, type SanitySeo, type SanityImage, type SanitySection } from "@/types/sanity";
import { type TabConfig, type MenuCard } from "@/components/MenuTabs";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";
import StructuredData from "@/components/StructuredData";

interface MenuPageData {
  _id: string;
  _type: string;
  title?: string;
  seo?: SanitySeo;
  breadcrumbLabel?: string;
  sections?: SanitySection[];
  headerHeading?: string;
  headerDescription?: string;
  headerImage?: SanityImage;
  headerServingTimes?: Array<{ _key?: string; label?: string; time?: string }>;
  bookTableLabel?: string;
  bookTableUrl?: string;
  tabs?: TabConfig[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "page": *[_type == "menuPage"][0]{
    _id,
    _type,
    title,
    seo,
    breadcrumbLabel,
    sections[]{
      ...,
      _type == "menuHeroSection" => { ..., headerImage{ ..., asset-> } },
      ${SECTIONS_QUERY_FRAGMENT}
    },
    // Fallbacks
    headerHeading, headerDescription, headerImage{ ..., asset-> },
    headerServingTimes[]{ _key, label, time },
    bookTableLabel, bookTableUrl,
    tabs[]{ _key, label, menuType, servingTime }
  },
  "menus": *[_type == "menuCard"] | order(order asc){
    _id, title, menuType, order, intro,
    featuredImage{ ..., asset-> },
    price, priceString, priceLabel, menuNote, ctaLabel, ctaUrl,
    sections[]{
      _key, sectionTitle, sectionNote, displayStyle,
      items[]{ _key, name, description, price, priceString, note, badge }
    }
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    address, phone, email, footerDescription, socialLinks,
    restaurantHours, kitchenHours, ctaBookTableUrl,
    breadcrumbHomeLabel
  }
}`;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: MenuPageData | null; siteSettings: SiteSettings | null };
  const page = result?.page;
  const siteSettings = result?.siteSettings;

  const seo = page?.seo;
  const title = seo?.metaTitle || page?.title || "Menukort";
  const description = seo?.metaDescription || page?.headerDescription || siteSettings?.footerDescription;
  const ogImage = seo?.shareImage 
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : page?.headerImage 
      ? urlFor(page.headerImage).width(1200).height(630).url()
      : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: { title, description, images: ogImage ? [{ url: ogImage }] : [] },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MenukortPage() {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: MenuPageData | null; siteSettings: SiteSettings | null; menus: MenuCard[] } | null;
  const page = result?.page;
  const siteSettings = result?.siteSettings;
  const menus = result?.menus ?? [];

  const globalBookTableUrl = siteSettings?.ctaBookTableUrl || "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";

  const menuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: page?.headerHeading || "Menukort",
    description: page?.headerDescription,
    url: "https://allegade10.dk/menukort",
    ...(menus.length > 0 && {
      hasMenuSection: menus.map((menu: any) => ({
        "@type": "MenuSection",
        name: menu.title,
        ...(menu.intro && { description: menu.intro }),
        ...(menu.sections && {
          hasMenuItem: menu.sections.flatMap((section: any) =>
            (section.items || []).map((item: any) => ({
              "@type": "MenuItem",
              name: item.name,
              ...(item.description && { description: item.description }),
              ...(item.price != null && {
                offers: {
                  "@type": "Offer",
                  price: item.price,
                  priceCurrency: "DKK",
                },
              }),
              ...(item.priceString && !item.price && {
                offers: {
                  "@type": "Offer",
                  price: item.priceString,
                  priceCurrency: "DKK",
                },
              }),
            }))
          ),
        }),
      })),
    }),
  };

  const hasSections = page?.sections && page.sections.length > 0;

  if (!hasSections && page) {
    return (
      <main className="bg-warm-white min-h-[calc(100vh-80px)]">
        <StructuredData data={menuSchema} />
        <MenuHero
          breadcrumbLabel={page.breadcrumbLabel}
          headerHeading={page.headerHeading}
          headerDescription={page.headerDescription}
          headerImage={page.headerImage}
          headerServingTimes={page.headerServingTimes}
          bookTableLabel={page.bookTableLabel}
          bookTableUrl={page.bookTableUrl}
          breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
          globalBookTableUrl={globalBookTableUrl}
        />
        <MenuTabsSection
          tabs={page.tabs}
          menus={menus}
          globalBookTableUrl={globalBookTableUrl}
        />
      </main>
    );
  }

  return (
    <main className="bg-warm-white min-h-[calc(100vh-80px)]">
      <StructuredData data={menuSchema} />
      <SectionRenderer
        documentId={page?._id ?? "menuPage"}
        documentType={page?._type ?? "menuPage"}
        sections={page?.sections}
        menus={menus}
        globalBookTableUrl={globalBookTableUrl}
        breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
      />
    </main>
  );
}
