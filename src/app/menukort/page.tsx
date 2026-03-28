import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { createDataAttribute } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import dynamic from "next/dynamic";
import Breadcrumb from "@/components/Breadcrumb";
import { type MenuCard, type TabConfig } from "@/components/MenuTabs";
import { buttonVariants } from "@/lib/button-variants";
import { type SanityImage, type SiteSettings } from "@/types/sanity";

const MenuTabs = dynamic(() => import("@/components/MenuTabs"));

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServingTime {
  _key?: string;
  label?: string;
  time?: string;
}

interface MenuPageData {
  _id: string;
  _type: string;
  breadcrumbLabel?: string;
  headerHeading?: string;
  headerDescription?: string;
  headerImage?: SanityImage;
  headerServingTimes?: ServingTime[];
  bookTableLabel?: string;
  bookTableUrl?: string;
  tabs?: TabConfig[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const MENUKORT_QUERY = `{
  "menuPage": *[_type == "menuPage"][0]{
    _id,
    _type,
    breadcrumbLabel,
    headerHeading,
    headerDescription,
    headerImage{ ..., asset-> },
    headerServingTimes[]{ _key, label, time },
    bookTableLabel,
    bookTableUrl,
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
    newsletterLabel, newsletterSubtext, newsletterButtonLabel,
    breadcrumbHomeLabel
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
  const isDraftMode = (await draftMode()).isEnabled;
  const menuPage = data?.menuPage as MenuPageData | null;
  const menus = (data?.menus ?? []) as MenuCard[];
  const siteSettings = data?.siteSettings as SiteSettings | null;

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
          <Breadcrumb current={menuPage?.breadcrumbLabel ?? "Menukort"} className="mb-6" homeLabel={siteSettings?.breadcrumbHomeLabel} />

          <h1 className="font-newsreader font-extralight text-[clamp(2rem,4vw,3.25rem)] text-dark-stone leading-none mb-4">
            {heading}
          </h1>

          <p className="text-warm-brown font-light leading-6 max-w-lg mb-8 text-base">
            {description}
          </p>

          {/* Serving times strip */}
          {servingTimes.length > 0 && (
            <div
              className="flex flex-wrap gap-x-6 gap-y-2 mb-8"
              {...(isDraftMode && menuPage?._id
                ? {
                    "data-sanity": createDataAttribute({
                      id: menuPage._id,
                      type: menuPage._type,
                      path: "headerServingTimes",
                    }).toString(),
                  }
                : {})}
            >
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
            className={buttonVariants({ variant: "primary", size: "sm" })}
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
              sizes="40vw"
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
      <div
        {...(isDraftMode && menuPage?._id
          ? {
              "data-sanity": createDataAttribute({
                id: menuPage._id,
                type: menuPage._type,
                path: "tabs",
              }).toString(),
            }
          : {})}
      >
        <MenuTabs
          tabs={tabs}
          menus={menus}
          bookTableUrl={bookTableUrl}
        />
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
    </main>
  );
}
