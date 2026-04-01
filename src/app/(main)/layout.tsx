import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";

const NAV_QUERY = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  navigation[]{ name, href },
  ctaBookTableLabel,
  ctaBookTableUrl,
  ctaBookStayLabel,
  ctaBookStayUrl,
  headerMenuOpenLabel,
  headerMenuCloseLabel
}`;

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: navSettings } = await sanityFetch({ query: NAV_QUERY });

  return (
    <>
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
    </>
  );
}
