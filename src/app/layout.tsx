import React from "react";
import Script from "next/script";
import type { Metadata } from "next";
import {
  Geist, Geist_Mono, Inter, Newsreader, Cormorant_Garamond,
  DM_Sans, Playfair_Display, EB_Garamond,
  Work_Sans, Libre_Baskerville,
  Jost, Fraunces,
} from "next/font/google";
import "./globals.css";
import { draftMode } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { cn } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { getThemeVars } from "@/lib/themes";
import { getFontVars, generateFontFaceCSS } from "@/lib/fonts";
import CookieConsent from "@/components/CookieConsent";
import MobileBookingBar from "@/components/MobileBookingBar";
import StructuredData from "@/components/StructuredData";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Classic pairing (current defaults)
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], weight: ["200", "300"], style: ["normal", "italic"] });
const cormorantGaramond = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300"], style: ["normal", "italic"] });

// Elegant pairing
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["300", "400"] });
const playfairDisplay = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["400"], style: ["normal", "italic"] });
const ebGaramond = EB_Garamond({ variable: "--font-eb-garamond", subsets: ["latin"], weight: ["400"], style: ["normal", "italic"] });

// Nordic pairing
const workSans = Work_Sans({ variable: "--font-work-sans", subsets: ["latin"], weight: ["300", "400"] });
const libreBaskerville = Libre_Baskerville({ variable: "--font-libre-baskerville", subsets: ["latin"], weight: ["400"], style: ["normal", "italic"] });

// Dramatic pairing
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["300", "400"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["300"], style: ["normal", "italic"] });

// ─── Queries ──────────────────────────────────────────────────────────────────
const NAV_QUERY = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  navigation[]{ name, href, pageReference->{ _type, "slug": slug.current }, children[]{ name, href, pageReference->{ _type, "slug": slug.current } } },
  ctaBookTableLabel,
  ctaBookTableUrl,
  ctaBookStayLabel,
  ctaBookStayUrl,
  colorTheme,
  fontPairing,
  customFontPairings[]{ _key, label, headingFontUrl, headingFontFamily, bodyFontUrl, bodyFontFamily, accentFontUrl, accentFontFamily },
  headerMenuOpenLabel,
  headerMenuCloseLabel,
  logoText,
  "logoImageUrl": logoImage.asset->url
}`;

const FAVICON_QUERY = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  title,
  logoText,
  "faviconUrl": favicon.asset->url,
  address,
  phone,
  email,
  footerDescription,
  "logoImageUrl": logoImage.asset->url,
  socialLinks,
  googleAnalyticsId
}`;

// ─── Dynamic metadata (favicon and title from Sanity) ─────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: FAVICON_QUERY });
  const siteTitle = data?.title || data?.logoText || "Allégade 10";
  const base: Metadata = {
    title: siteTitle,
    description: "Hotel, restaurant og selskabslokaler på Frederiksberg",
  };
  if (data?.faviconUrl) {
    base.icons = { icon: `${data.faviconUrl}?w=64&h=64&fit=crop&auto=format` };
  }
  return base;
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [{ data: navSettings }, { data: siteInfo }] = await Promise.all([
    sanityFetch({ query: NAV_QUERY }),
    sanityFetch({ query: FAVICON_QUERY }),
  ]);

  let logoSvgContent: string | null = null;
  if (navSettings?.logoImageUrl) {
    try {
      const res = await fetch(navSettings.logoImageUrl);
      if (res.ok) logoSvgContent = await res.text();
    } catch {}
  }

  const themeVars = getThemeVars(navSettings?.colorTheme);
  const fontVars = getFontVars(navSettings?.fontPairing, navSettings?.customFontPairings);
  const fontFaceCSS = generateFontFaceCSS(navSettings?.fontPairing, navSettings?.customFontPairings);

  const allFontVariables = cn(
    inter.variable, newsreader.variable, cormorantGaramond.variable,
    dmSans.variable, playfairDisplay.variable, ebGaramond.variable,
    workSans.variable, libreBaskerville.variable,
    jost.variable, fraunces.variable,
  );

  return (
    <html
      lang="da"
      className={cn("font-sans", allFontVariables)}
      style={{ ...themeVars, ...fontVars } as React.CSSProperties}
    >
      {fontFaceCSS && <style dangerouslySetInnerHTML={{ __html: fontFaceCSS }} />}
      {siteInfo?.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${siteInfo.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});gtag('js',new Date());gtag('config','${siteInfo.googleAnalyticsId}');`}
          </Script>
        </>
      )}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden pb-mobile-bar lg:pb-0`}>
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteInfo?.logoText || "Allégade 10",
          url: "https://allegade10.dk",
          ...(siteInfo?.logoImageUrl && { logo: siteInfo.logoImageUrl }),
          ...(siteInfo?.footerDescription && { description: siteInfo.footerDescription }),
          address: {
            "@type": "PostalAddress",
            streetAddress: "Allégade 10",
            addressLocality: "Frederiksberg",
            postalCode: "2000",
            addressCountry: "DK",
          },
          ...(siteInfo?.phone && { telephone: siteInfo.phone }),
          ...(siteInfo?.email && { email: siteInfo.email }),
          ...(siteInfo?.socialLinks?.length && {
            sameAs: siteInfo.socialLinks.map((l: any) => l.url).filter(Boolean),
          }),
        }} />
        <Header
          navLinks={navSettings?.navigation}
          ctaBookTableLabel={navSettings?.ctaBookTableLabel}
          ctaBookTableUrl={navSettings?.ctaBookTableUrl}
          ctaBookStayLabel={navSettings?.ctaBookStayLabel}
          ctaBookStayUrl={navSettings?.ctaBookStayUrl}
          menuOpenLabel={navSettings?.headerMenuOpenLabel}
          menuCloseLabel={navSettings?.headerMenuCloseLabel}
          logoText={navSettings?.logoText}
          logoImageUrl={navSettings?.logoImageUrl}
          logoSvgContent={logoSvgContent}
        />
        {children}
        <Footer />
        <MobileBookingBar
          ctaBookTableLabel={navSettings?.ctaBookTableLabel}
          ctaBookTableUrl={navSettings?.ctaBookTableUrl}
          ctaBookStayLabel={navSettings?.ctaBookStayLabel}
          ctaBookStayUrl={navSettings?.ctaBookStayUrl}
        />
        <CookieConsent />
        <SanityLive />
        {(await draftMode()).isEnabled && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  );
}
