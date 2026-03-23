import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Newsreader, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { draftMode } from "next/headers";
import Header from "@/components/Header";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { cn } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/live";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["200", "300"],
  style: ["normal", "italic"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Allégade 10",
  description: "Hotel, restaurant og selskabslokaler på Frederiksberg",
};

const NAV_QUERY = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  navigation[]{ name, href },
  ctaBookTableLabel,
  ctaBookTableUrl,
  ctaBookStayLabel,
  ctaBookStayUrl
}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: navSettings } = await sanityFetch({ query: NAV_QUERY });

  return (
    <html lang="da" className={cn("font-sans", inter.variable, newsreader.variable, cormorantGaramond.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Header
          navLinks={navSettings?.navigation}
          ctaBookTableLabel={navSettings?.ctaBookTableLabel}
          ctaBookTableUrl={navSettings?.ctaBookTableUrl}
          ctaBookStayLabel={navSettings?.ctaBookStayLabel}
          ctaBookStayUrl={navSettings?.ctaBookStayUrl}
        />
        {children}
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
