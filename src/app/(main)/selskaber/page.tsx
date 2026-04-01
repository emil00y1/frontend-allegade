import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import SelskaberHero from "@/components/sections/SelskaberHero";
import SelskaberOccasions from "@/components/sections/SelskaberOccasions";
import SelskaberVenues from "@/components/sections/SelskaberVenues";
import SelskaberMenu from "@/components/sections/SelskaberMenu";
import SelskaberCtaBanner from "@/components/sections/SelskaberCtaBanner";
import SelskaberForm from "@/components/sections/SelskaberForm";
import { SectionRenderer } from "@/components/sections";
import { type SiteSettings } from "@/types/sanity";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "page": *[_type == "selskaberPage"][0]{
    _id,
    _type,
    title,
    seo,
    breadcrumbLabel,
    sections[]{
      ...,
      _type == "selskaberHeroSection" => { ..., heroImage{ ..., asset-> } },
      _type == "selskaberOccasionsSection" => { ..., occasions[]{ ..., image{ ..., asset-> } } },
      _type == "selskaberVenuesSection" => { ..., venues[]{ ..., image{ ..., asset-> } } },
      _type == "selskaberCtaBannerSection" => { ..., ctaBannerImage{ ..., asset-> } },
      ${SECTIONS_QUERY_FRAGMENT}
    },
    // Fallbacks
    heroImage{ ..., asset-> },
    heroHeading, heroHeadingItalic, heroDescription, heroCtaLabel, heroMenuCtaLabel, heroMenuCtaUrl,
    occasions[]{ _key, label, heading, description, capacity, facilities, image{ ..., asset-> } },
    venueEyebrow, venueHeading, venueCtaLabel,
    venues[]{ _key, name, capacity, description, image{ ..., asset-> } },
    menuEyebrow, menuHeading, menuDescription, menuPdfUrl, menuPdfFallbackLabel, menuCardFallbackLabel,
    ctaBannerImage{ ..., asset-> }, ctaBannerHeading, ctaBannerButtonLabel,
    formHeading, formDescription, formPhone, formEmail
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    address, phone, email, footerDescription, socialLinks,
    restaurantHours, kitchenClosingNote, ctaBookTableUrl,
    newsletterLabel, newsletterSubtext, newsletterButtonLabel,
    breadcrumbHomeLabel
  }
}`;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: any; siteSettings: SiteSettings };
  const page = result?.page;
  const siteSettings = result?.siteSettings;

  const seo = page?.seo;
  const title = seo?.metaTitle || page?.title || "Selskaber";
  const description = seo?.metaDescription || page?.heroDescription || siteSettings?.footerDescription;
  const ogImage = seo?.shareImage 
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : page?.heroImage 
      ? urlFor(page.heroImage).width(1200).height(630).url()
      : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: { title, description, images: ogImage ? [{ url: ogImage }] : [] },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SelskaberPage() {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: any; siteSettings: SiteSettings } | null;
  const page = result?.page;
  const siteSettings = result?.siteSettings;

  const globalBookTableUrl = siteSettings?.ctaBookTableUrl || "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";
  const hasSections = page?.sections && page.sections.length > 0;

  const occasionLabels = page?.occasions?.map((o: any) => o.label).filter(Boolean) || [];

  if (!hasSections && page) {
    return (
      <main className="bg-warm-white min-h-[calc(100vh-80px)]">
        <SelskaberHero
          breadcrumbLabel={page.breadcrumbLabel}
          heroImage={page.heroImage}
          heroHeading={page.heroHeading}
          heroHeadingItalic={page.heroHeadingItalic}
          heroDescription={page.heroDescription}
          heroCtaLabel={page.heroCtaLabel}
          heroMenuCtaLabel={page.heroMenuCtaLabel}
          heroMenuCtaUrl={page.heroMenuCtaUrl}
          breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
        />
        <SelskaberOccasions occasions={page.occasions} />
        <SelskaberVenues
          venueEyebrow={page.venueEyebrow}
          venueHeading={page.venueHeading}
          venueCtaLabel={page.venueCtaLabel}
          venues={page.venues}
        />
        <SelskaberMenu
          menuEyebrow={page.menuEyebrow}
          menuHeading={page.menuHeading}
          menuDescription={page.menuDescription}
          menuPdfUrl={page.menuPdfUrl}
          menuPdfFallbackLabel={page.menuPdfFallbackLabel}
          menuCardFallbackLabel={page.menuCardFallbackLabel}
        />
        <SelskaberForm
          formHeading={page.formHeading}
          formDescription={page.formDescription}
          formPhone={page.formPhone || siteSettings?.phone}
          formEmail={page.formEmail || siteSettings?.email}
          occasionLabels={occasionLabels}
        />
      </main>
    );
  }

  return (
    <main className="bg-warm-white min-h-[calc(100vh-80px)]">
      <SectionRenderer
        documentId={page?._id ?? "selskaberPage"}
        documentType={page?._type ?? "selskaberPage"}
        sections={page?.sections}
        occasionLabels={occasionLabels}
        globalBookTableUrl={globalBookTableUrl}
        breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
      />
    </main>
  );
}
