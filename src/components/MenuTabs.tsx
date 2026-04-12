"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { type SanityImage } from "@/types/sanity";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  _key: string;
  name?: string;
  description?: string;
  price?: number;
  priceString?: string;
  note?: string;
  badge?: string;
}

export interface MenuSection {
  _key: string;
  sectionTitle?: string;
  sectionNote?: string;
  displayStyle?: "list" | "wine" | "featured";
  items?: MenuItem[];
}

export interface MenuCard {
  _id: string;
  title: string;
  menuType: string;
  order?: number;
  intro?: string;
  featuredImage?: SanityImage;
  price?: number;
  priceString?: string;
  priceLabel?: string;
  menuNote?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  sections?: MenuSection[];
}

export interface TabConfig {
  _key?: string;
  label: string;
  menuType: string;
  servingTime?: string;
}

interface MenuTabsProps {
  tabs: TabConfig[];
  menus: MenuCard[];
  bookTableUrl?: string;
}

// ─── Time-based default tab ────────────────────────────────────────────────
// Auto-selects the tab most relevant to the current time of day.
// Brunch: Saturday & Sunday 10:00–13:00
// Aften: Daily from 17:00
// Frokost: 11:30–16:00 (or as fallback during the day)
function getDefaultMenuType(tabs: TabConfig[]): string {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const timeAsNumber = hour + minutes / 60;

  const hasType = (t: string) => tabs.some((tab) => tab.menuType === t);

  if (
    (day === 0 || day === 6) &&
    timeAsNumber >= 10 &&
    timeAsNumber < 13 &&
    hasType("brunch")
  ) {
    return "brunch";
  }
  if (timeAsNumber >= 17 && hasType("dinner")) {
    return "dinner";
  }
  if (timeAsNumber >= 11.5 && timeAsNumber < 17 && hasType("lunch")) {
    return "lunch";
  }
  // Fallback: first tab
  return tabs[0]?.menuType ?? "lunch";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(item: MenuItem): string | null {
  if (item.priceString) return item.priceString;
  if (item.price != null) return `${item.price},-`;
  return null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, note }: { title?: string; note?: string }) {
  if (!title) return null;
  return (
    <div>
      <div className="flex items-center gap-4 mb-1">
        <h3 className="text-[11px] tracking-[2.5px] uppercase font-light text-dark-stone shrink-0">
          {title}
        </h3>
        <div className="flex-1 h-px bg-brand/30" />
      </div>
      {note && (
        <p className="text-[10px] tracking-[0.5px] uppercase text-warm-brown/60 font-light mt-1">
          {note}
        </p>
      )}
    </div>
  );
}

function MenuItemRow({ item }: { item: MenuItem }) {
  const price = formatPrice(item);
  return (
    <div className="py-3.5 border-b border-border-warm/30 last:border-0">
      <div className="flex items-baseline gap-2">
        <span className="font-newsreader font-light text-[1.05rem] text-dark-stone leading-snug">
          {item.name}
        </span>
        {item.badge && (
          <span className="text-[9px] tracking-[0.5px] uppercase font-light text-brand border border-brand/40 px-1.5 py-0.5 shrink-0">
            {item.badge}
          </span>
        )}
        <span className="flex-1" />
        {price && (
          <span className="font-sans font-light text-sm text-dark-stone shrink-0 tabular-nums">
            {price}
          </span>
        )}
      </div>
      {item.description && (
        <p className="text-sm italic text-warm-brown/70 font-light mt-0.5 leading-snug">
          {item.description}
        </p>
      )}
      {item.note && (
        <p className="text-[11px] text-warm-brown/50 font-light mt-0.5">
          {item.note}
        </p>
      )}
    </div>
  );
}

function WineItemRow({ item }: { item: MenuItem }) {
  const price = formatPrice(item);
  return (
    <div className="py-4 border-b border-border-warm/30 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-newsreader font-extralight text-lg text-dark-stone leading-snug">
            {item.name}
          </p>
          {item.description && (
            <p className="text-sm italic text-warm-brown/60 font-light mt-1 leading-snug">
              {item.description}
            </p>
          )}
        </div>
        {price && (
          <span className="font-sans font-light text-sm text-dark-stone shrink-0 tabular-nums text-right">
            {price}
          </span>
        )}
      </div>
    </div>
  );
}

// Featured cards for set menus (side-by-side)
function FeaturedSection({
  section,
  bookTableUrl,
}: {
  section: MenuSection;
  bookTableUrl?: string;
}) {
  if (!section.items?.length) return null;

  // Pairs of items rendered as cards; odd leftovers get full width
  const pairs: MenuItem[][] = [];
  for (let i = 0; i < section.items.length; i += 2) {
    pairs.push(section.items.slice(i, i + 2));
  }

  return (
    <div>
      <SectionHeader title={section.sectionTitle} note={section.sectionNote} />
      <div className="flex flex-col gap-4">
        {pairs.map((pair, pi) => (
          <div
            key={pi}
            className={cn(
              "grid gap-4",
              pair.length === 2 ? "md:grid-cols-2" : "grid-cols-1",
            )}
          >
            {pair.map((item) => {
              const price = formatPrice(item);
              return (
                <div
                  key={item._key}
                  className="bg-brand-light/20 border border-brand/20 p-6 flex flex-col gap-3"
                >
                  <span className="text-[9px] tracking-[2px] uppercase font-light text-brand border border-brand/30 px-2 py-1 self-start">
                    Sæt-menu
                  </span>
                  <h4 className="font-newsreader font-extralight text-xl text-dark-stone leading-snug">
                    {item.name}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-warm-brown font-light leading-snug">
                      {item.description}
                    </p>
                  )}
                  {item.note && (
                    <p className="text-[11px] text-warm-brown/60 font-light italic">
                      {item.note}
                    </p>
                  )}
                  {price && (
                    <p className="font-newsreader font-extralight text-2xl text-brand mt-auto pt-2">
                      {price}
                    </p>
                  )}
                  {bookTableUrl && (
                    <Link
                      href={bookTableUrl}
                      className="text-[10px] tracking-[1.5px] uppercase font-light text-brand border-b border-brand/40 pb-px self-start hover:opacity-70 transition-opacity"
                    >
                      Book bord
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DrinksCrossLink({ onSwitch }: { onSwitch: () => void }) {
  return (
    <div className="mt-10 pt-6 border-t border-border-warm/30">
      <button
        onClick={onSwitch}
        className="text-[11px] tracking-[1px] uppercase font-light text-brand border-b border-brand/40 pb-px hover:opacity-70 transition-opacity"
      >
        Se drikkekort →
      </button>
    </div>
  );
}

// ─── Tab content renderers ────────────────────────────────────────────────────

function BrunchTab({
  menu,
  bookTableUrl,
  onSwitchToDrinks,
}: {
  menu: MenuCard;
  bookTableUrl?: string;
  onSwitchToDrinks: () => void;
}) {
  const items = menu.sections?.[0]?.items ?? [];
  const price =
    menu.priceString ?? (menu.price != null ? `${menu.price},-` : null);

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-warm-white border border-border-warm/40 p-10 lg:p-14 shadow-sm text-center">
          <h2 className="font-newsreader font-extralight text-4xl lg:text-5xl text-dark-stone mb-3 leading-none">
            {menu.title}
          </h2>

          {menu.sections?.[0]?.sectionNote && (
            <p className="text-[10px] tracking-[1.5px] uppercase text-warm-brown/60 font-light mb-8">
              {menu.sections[0].sectionNote}
            </p>
          )}

          {/* Items as a paragraph */}
          {items.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-warm-brown font-light leading-relaxed">
                {items.map((item, i) => (
                  <span key={item._key}>
                    {item.name}
                    {i < items.length - 1 ? " \u2022 " : ""}
                  </span>
                ))}
              </p>
            </div>
          )}

          {menu.menuNote && (
            <p className="text-sm italic text-warm-brown font-light mb-6">
              {menu.menuNote}
            </p>
          )}

          <div className="pt-10 flex flex-col items-center gap-8">
            <div className="flex flex-col items-center">
              <p className="text-[10px] tracking-[1px] uppercase text-dark-stone/50 mb-3">
                Pris per person
              </p>
              {price && (
                <p className="font-newsreader font-extralight text-4xl text-brand leading-none">
                  {price}
                </p>
              )}
            </div>
            <Link
              href={
                menu.ctaUrl ??
                bookTableUrl ??
                "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10"
              }
              className="px-10 py-4 text-[11px] tracking-[2px] uppercase font-light text-white bg-brand hover:opacity-90 transition-opacity w-fit"
            >
              {menu.ctaLabel ?? "Book brunch buffet"}
            </Link>
          </div>
        </div>

        <DrinksCrossLink onSwitch={onSwitchToDrinks} />
      </div>
    </div>
  );
}

function StandardMenuTab({
  menu,
  bookTableUrl,
  onSwitchToDrinks,
}: {
  menu: MenuCard;
  bookTableUrl?: string;
  onSwitchToDrinks: () => void;
}) {
  return (
    <div className="py-12 lg:py-16 max-w-2xl mx-auto">
      {menu.intro && (
        <p className="text-warm-brown font-light leading-7 mb-10 text-base max-w-xl">
          {menu.intro}
        </p>
      )}

      {menu.sections?.map((section) => {
        const style = section.displayStyle ?? "list";

        if (style === "featured") {
          return (
            <FeaturedSection
              key={section._key}
              section={section}
              bookTableUrl={bookTableUrl}
            />
          );
        }

        return (
          <div key={section._key} className="mt-12 mb-6 first:mt-0">
            <SectionHeader
              title={section.sectionTitle}
              note={section.sectionNote}
            />
            {section.items?.map((item) =>
              style === "wine" ? (
                <WineItemRow key={item._key} item={item} />
              ) : (
                <MenuItemRow key={item._key} item={item} />
              ),
            )}
          </div>
        );
      })}

      <DrinksCrossLink onSwitch={onSwitchToDrinks} />
    </div>
  );
}

function BeveragesTab({ menu }: { menu: MenuCard }) {
  return (
    <div className="py-12 lg:py-16 max-w-2xl mx-auto">
      {menu.sections?.map((section) => (
        <div key={section._key} className="mt-12 mb-6 first:mt-0">
          <SectionHeader
            title={section.sectionTitle}
            note={section.sectionNote}
          />
          {section.items?.map((item) =>
            section.displayStyle === "wine" ? (
              <WineItemRow key={item._key} item={item} />
            ) : (
              <MenuItemRow key={item._key} item={item} />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MenuTabs({
  tabs,
  menus,
  bookTableUrl = "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10",
}: MenuTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(() =>
    getDefaultMenuType(tabs),
  );

  const menusByType = Object.fromEntries(menus.map((m) => [m.menuType, m]));
  const activeMenu = menusByType[activeTab];
  const beveragesMenu = menusByType["beverages"];

  const switchToDrinks = () => setActiveTab("beverages");

  return (
    <div>
      {/* ── Sticky tab bar ────────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-warm-white border-b border-border-warm shadow-sm">
        <div className="max-w-6xl mx-auto px-10 lg:px-16">
          {/* Relative wrapper so the fade overlay is contained */}
          <div className="relative">
            {/* overflow-x-auto for mobile horizontal scroll; hide scrollbar */}
            <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.menuType;
                return (
                  <button
                    key={tab.menuType}
                    onClick={() => setActiveTab(tab.menuType)}
                    className={cn(
                      "flex flex-col items-center px-6 py-4 shrink-0 border-b-2 transition-all duration-200 focus:outline-none",
                      isActive
                        ? "border-brand text-dark-stone"
                        : "border-transparent text-warm-brown hover:text-dark-stone",
                    )}
                  >
                    <span className="font-sans font-light text-sm leading-snug">
                      {tab.label}
                    </span>
                    {tab.servingTime && (
                      <span className="text-[10px] text-warm-brown/75 font-light mt-0.5 font-sans">
                        {tab.servingTime}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Fade gradient — hints at horizontal scroll on mobile, hidden on lg */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-warm-white to-transparent lg:hidden" />
          </div>
        </div>
      </div>

      {/* ── Tab content ───────────────────────────────────────────────── */}
      <div className="bg-warm-white px-10 lg:px-16 min-h-[60vh]">
        {!activeMenu ? (
          <div className="py-24 text-center text-warm-brown/50 font-light text-sm">
            Indholdet er ikke klar endnu — tilføj et menukort i Sanity Studio.
          </div>
        ) : activeTab === "brunch" ? (
          <BrunchTab
            menu={activeMenu}
            bookTableUrl={bookTableUrl}
            onSwitchToDrinks={switchToDrinks}
          />
        ) : activeTab === "beverages" ? (
          <BeveragesTab menu={activeMenu} />
        ) : (
          <StandardMenuTab
            menu={activeMenu}
            bookTableUrl={bookTableUrl}
            onSwitchToDrinks={beveragesMenu ? switchToDrinks : () => {}}
          />
        )}
      </div>
    </div>
  );
}
