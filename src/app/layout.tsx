import React from "react";
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
import { getFontVars } from "@/lib/fonts";

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
  navigation[]{ name, href, pageReference->{ "slug": slug.current } },
  ctaBookTableLabel,
  ctaBookTableUrl,
  ctaBookStayLabel,
  ctaBookStayUrl,
  colorTheme,
  fontPairing,
  headerMenuOpenLabel,
  headerMenuCloseLabel
}`;

const FAVICON_QUERY = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  "faviconUrl": favicon.asset->url
}`;

// ─── Dynamic metadata (favicon from Sanity) ───────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: FAVICON_QUERY });
  const base: Metadata = {
    title: "Allégade 10",
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
  const { data: navSettings } = await sanityFetch({ query: NAV_QUERY });

  const themeVars = getThemeVars(navSettings?.colorTheme);
  const fontVars = getFontVars(navSettings?.fontPairing);

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <Header
          navLinks={navSettings?.navigation}
          ctaBookTableLabel={navSettings?.ctaBookTableLabel}
          ctaBookTableUrl={navSettings?.ctaBookTableUrl}
          ctaBookStayLabel={navSettings?.ctaBookStayLabel}
          ctaBookStayUrl={navSettings?.ctaBookStayUrl}
          menuOpenLabel={navSettings?.headerMenuOpenLabel}
          menuCloseLabel={navSettings?.headerMenuCloseLabel}
        />
        {children}
        <Footer />
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
