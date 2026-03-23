import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import Footer from "@/components/Footer";
import MenuTabs, { type MenuCard, type TabConfig } from "@/components/MenuTabs";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServingTime {
  _key?: string;
  label?: string;
  time?: string;
}

interface MenuPageData {
  headerHeading?: string;
  headerDescription?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headerImage?: any;
  headerServingTimes?: ServingTime[];
  bookTableLabel?: string;
  bookTableUrl?: string;
  tabs?: TabConfig[];
  ctaHeading?: string;
  ctaButtonLabel?: string;
  ctaButtonUrl?: string;
  ctaPhone?: string;
  allergenNote?: string;
}

interface SiteSettingsData {
  address?: string;
  phone?: string;
  email?: string;
  footerDescription?: string;
  restaurantHours?: { days?: string; hours: string }[];
  kitchenHours?: { label?: string; hours: string }[];
  socialLinks?: { platform: string; url: string }[];
  ctaBookTableUrl?: string;
}

// ─── Query ────────────────────────────────────────────────────────────────────

const MENUKORT_QUERY = `{
  "menuPage": *[_type == "menuPage"][0]{
    headerHeading,
    headerDescription,
    headerImage{ ..., asset-> },
    headerServingTimes[]{ _key, label, time },
    bookTableLabel,
    bookTableUrl,
    tabs[]{ _key, label, menuType, servingTime },
    ctaHeading,
    ctaButtonLabel,
    ctaButtonUrl,
    ctaPhone,
    allergenNote
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
    restaurantHours, kitchenHours, ctaBookTableUrl
  }
}`;

// ─── Default tabs (shown if none configured in Sanity) ───────────────────────

const DEFAULT_TABS: TabConfig[] = [
  { label: "Brunch", menuType: "brunch", servingTime: "Lør–Søn 10–13" },
  { label: "Frokost", menuType: "lunch", servingTime: "11:30–16:00" },
  { label: "Aften", menuType: "dinner", servingTime: "Fra 17:00" },
  { label: "Drikkevarer", menuType: "beverages" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MenukortPage() {
  const { data } = await sanityFetch({ query: MENUKORT_QUERY });
  const menuPage = data?.menuPage as MenuPageData | null;
  const menus = (data?.menus ?? []) as MenuCard[];
  const siteSettings = data?.siteSettings as SiteSettingsData | null;

  const heading = menuPage?.headerHeading ?? "Vores Menukort";
  const description =
    menuPage?.headerDescription ??
    "Fra klassisk dansk smørrebrød til aftenmenu med sæsonens bedste råvarer — her finder du alle vores menukort.";
  const defaultBookingUrl = "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";
  const bookTableLabel = menuPage?.bookTableLabel ?? "Book bord";
  const bookTableUrl = menuPage?.bookTableUrl || siteSettings?.ctaBookTableUrl || defaultBookingUrl;
  const servingTimes = menuPage?.headerServingTimes ?? [
    { label: "Brunch", time: "Lør–Søn 10–13" },
    { label: "Frokost", time: "Man–Fre 11:30–16 / Lør–Søn 13–16" },
    { label: "Aften", time: "Dagligt fra 17:00" },
  ];
  const tabs =
    menuPage?.tabs && menuPage.tabs.length > 0 ? menuPage.tabs : DEFAULT_TABS;

  const headerImageUrl = menuPage?.headerImage
    ? urlFor(menuPage.headerImage).width(900).height(600).auto("format").url()
    : null;

  return (
    <main className="bg-warm-white min-h-[calc(100vh-80px)]">
      {/* ── Compact Page Header ─────────────────────────────────────── */}
      <section className="grid lg:grid-cols-[3fr_2fr] min-h-[30vh] bg-warm-white border-b border-border-warm/30">
        {/* Left: text */}
        <div className="flex flex-col justify-center px-10 lg:px-16 pt-32 pb-10 lg:pt-36 lg:pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-[10px] tracking-[1px] uppercase text-warm-brown/60">
            <Link href="/" className="hover:text-brand transition-colors">
              Forside
            </Link>
            <span className="text-warm-brown/40">›</span>
            <span className="text-brand">Menukort</span>
          </nav>

          <h1 className="font-newsreader font-extralight text-[clamp(2rem,4vw,3.25rem)] text-dark-stone leading-none mb-4">
            {heading}
          </h1>

          <p className="text-warm-brown font-light leading-6 max-w-lg mb-8 text-base">
            {description}
          </p>

          {/* Serving times strip */}
          {servingTimes.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
              {servingTimes.map((st, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-brand shrink-0" />
                  <span className="text-[11px] font-light text-dark-stone">
                    <span className="font-light text-warm-brown/80 uppercase tracking-[0.5px] text-[10px] mr-1">
                      {st.label}:
                    </span>
                    {st.time}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Link
            href={bookTableUrl}
            className="self-start px-8 py-3.5 text-[11px] tracking-[2px] uppercase font-light text-white bg-brand hover:opacity-90 transition-opacity"
          >
            {bookTableLabel}
          </Link>
        </div>

        {/* Right: image */}
        <div className="relative hidden lg:block overflow-hidden bg-warm-gray">
          {headerImageUrl ? (
            <Image
              src={headerImageUrl}
              alt={heading}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-warm-gray" />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-warm-white/10 pointer-events-none" />
        </div>
      </section>

      {/* ── Tabs (sticky) + content ─────────────────────────────────── */}
      <MenuTabs
        tabs={tabs}
        menus={menus}
        bookTableUrl={bookTableUrl}
      />

      {/* ── Bottom CTA Section ──────────────────────────────────────── */}
      {(menuPage?.ctaHeading || menuPage?.ctaButtonLabel) && (
        <section className="bg-dark-stone px-10 lg:px-16 min-h-[calc(100vh-80px)] flex items-center border-t-4 border-brand py-0">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 w-full">
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] text-white font-newsreader font-extralight leading-tight">
              {menuPage.ctaHeading ?? "Har du fundet noget?"}
            </h2>
            
            <div className="flex flex-col items-center gap-6">
              <Link
                href={menuPage.ctaButtonUrl || siteSettings?.ctaBookTableUrl || defaultBookingUrl}
                target={(menuPage.ctaButtonUrl || siteSettings?.ctaBookTableUrl || defaultBookingUrl).startsWith("http") ? "_blank" : undefined}
                rel={(menuPage.ctaButtonUrl || siteSettings?.ctaBookTableUrl || defaultBookingUrl).startsWith("http") ? "noopener noreferrer" : undefined}
                className="px-12 py-5 text-[12px] tracking-[2.4px] uppercase font-bold text-white bg-brand hover:brightness-110 transition-all duration-300"
              >
                {menuPage.ctaButtonLabel ?? "Book bord"}
              </Link>
              
              {menuPage.ctaPhone && (
                <p className="text-white/60 font-light tracking-[1px] uppercase text-[11px]">
                  {menuPage.ctaPhone}
                </p>
              )}
            </div>

            {menuPage.allergenNote && (
              <p className="text-white/40 text-sm italic font-light max-w-lg mt-4">
                {menuPage.allergenNote}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <Footer siteSettings={siteSettings} />
    </main>
  );
}
