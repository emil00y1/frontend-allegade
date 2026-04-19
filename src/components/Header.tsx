"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavChildLink {
  name: string;
  href: string;
  pageReference?: { _type?: string; slug?: string };
}

interface NavLink {
  name: string;
  href: string;
  pageReference?: { _type?: string; slug?: string };
  children?: NavChildLink[];
}

interface HeaderProps {
  navLinks?: NavLink[];
  ctaBookTableLabel?: string;
  ctaBookTableUrl?: string;
  ctaBookStayLabel?: string;
  ctaBookStayUrl?: string;
  menuOpenLabel?: string;
  menuCloseLabel?: string;
  logoText?: string;
  logoImageUrl?: string;
  logoSvgContent?: string | null;
}

function isExternal(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

const SINGLETON_ROUTES: Record<string, string> = {
  homePage: "/",
  hotelPage: "/hotel",
  restaurantPage: "/restaurant",
  menuPage: "/menukort",
  eventsPage: "/begivenheder",
  selskaberPage: "/selskaber",
};

function resolvePageReferenceHref(
  pageRef: { _type?: string; slug?: string } | undefined,
  fallback: string,
): string {
  if (!pageRef) return fallback;
  if (pageRef._type && SINGLETON_ROUTES[pageRef._type]) return SINGLETON_ROUTES[pageRef._type];
  if (pageRef.slug) return `/${pageRef.slug}`;
  return fallback;
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { name: "Restaurant", href: "/menukort" },
  { name: "Hotel", href: "/hotel" },
  { name: "Menukort", href: "/menukort" },
  { name: "Selskaber", href: "/selskaber" },
  { name: "Events", href: "/events" },
];

export default function Header({
  navLinks,
  ctaBookTableLabel = "Book bord",
  ctaBookTableUrl = "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10",
  ctaBookStayLabel = "Book ophold",
  ctaBookStayUrl = "https://allegade10.suitcasebooking.com/da",
  menuOpenLabel = "Åbn menu",
  menuCloseLabel = "Luk menu",
  logoText,
  logoImageUrl,
  logoSvgContent,
}: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const rawLinks =
    navLinks && navLinks.length > 0
      ? navLinks.map((l) => ({
          ...l,
          href: resolvePageReferenceHref(l.pageReference, l.href),
          children: l.children?.map((c) => ({
            ...c,
            href: resolvePageReferenceHref(c.pageReference, c.href),
          })),
        }))
      : DEFAULT_NAV_LINKS;

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Desktop: filter out empty/home links
  const desktopNavLinks = rawLinks.filter((l) => l.name && l.href !== "/");
  // Mobile: ensure Forside is first, filter out empty-name or duplicate home links
  const mobileNavLinks: NavLink[] = [
    { name: "Forside", href: "/" },
    ...rawLinks.filter((l) => l.name && l.href !== "/"),
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const resolvedTableUrl =
    ctaBookTableUrl ??
    "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";
  const resolvedStayUrl =
    ctaBookStayUrl ?? "https://allegade10.suitcasebooking.com/da";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <>
      <header
        className={cn(
          "top-0 left-0 right-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
          isHome
            ? "fixed"
            : "sticky bg-warm-white border-border-warm shadow-sm",
          isHome &&
            (scrolled
              ? "bg-warm-white border-border-warm shadow-sm"
              : "bg-transparent border-transparent"),
        )}
      >
        <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 shrink-0">
            {logoSvgContent ? (
              <span
                dangerouslySetInnerHTML={{ __html: logoSvgContent }}
                className={cn(
                  "logo-svg h-8 flex items-center transition-colors duration-300 [&_svg]:h-full [&_svg]:w-auto",
                  !isHome || scrolled ? "text-dark-stone" : "text-warm-white",
                )}
              />
            ) : logoImageUrl ? (
              <img
                src={logoImageUrl}
                alt={logoText || "Allégade 10"}
                className="h-8 w-auto object-contain transition-all duration-300"
              />
            ) : null}
            {!logoImageUrl && !logoSvgContent && (
              <div className="flex items-baseline">
                {logoText ? (
                  <span
                    className={cn(
                      "text-2xl font-newsreader font-extralight transition-colors duration-300",
                      !isHome || scrolled ? "text-dark-stone" : "text-white",
                    )}
                  >
                    {logoText}
                  </span>
                ) : (
                  <>
                    <span
                      className={cn(
                        "text-2xl font-newsreader font-extralight transition-colors duration-300",
                        !isHome || scrolled ? "text-dark-stone" : "text-white",
                      )}
                    >
                      Allégade
                    </span>
                    <span
                      className={cn(
                        "text-2xl ml-1 font-cormorant font-light italic transition-colors duration-300",
                        !isHome || scrolled ? "text-dark-stone" : "text-white",
                      )}
                    >
                      10
                    </span>
                  </>
                )}
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {desktopNavLinks.map((link) => {
              const hasChildren = link.children && link.children.length > 0;
              if (!hasChildren) {
                return (
                  <Link
                    key={link.name}
                    href={link.href ?? "/"}
                    className={cn(
                      "text-[11px] tracking-[1.2px] uppercase font-light transition-colors duration-300 hover:opacity-60",
                      !isHome || scrolled ? "text-dark-stone" : "text-white/90",
                    )}
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={cn(
                      "text-[11px] tracking-[1.2px] uppercase font-light transition-colors duration-300 hover:opacity-60 flex items-center gap-1",
                      !isHome || scrolled ? "text-dark-stone" : "text-white/90",
                    )}
                    onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                  >
                    {link.name}
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className="mt-px">
                      <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200",
                      openDropdown === link.name ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1",
                    )}
                  >
                    <div className="bg-warm-white border border-border-warm shadow-lg min-w-[180px] py-2">
                      {link.href && (
                        <Link
                          href={link.href}
                          className="block px-5 py-2.5 text-[11px] tracking-[1px] uppercase font-light text-dark-stone hover:text-brand hover:bg-warm-gray transition-colors duration-200"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {link.name}
                        </Link>
                      )}
                      {link.children!.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href ?? "/"}
                          className="block px-5 py-2.5 text-[11px] tracking-[1px] uppercase font-light text-warm-brown hover:text-dark-stone hover:bg-warm-gray transition-colors duration-200"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link
              href={resolvedTableUrl}
              target={isExternal(resolvedTableUrl) ? "_blank" : undefined}
              rel={
                isExternal(resolvedTableUrl) ? "noopener noreferrer" : undefined
              }
              className={cn(
                "hidden lg:block text-[11px] tracking-[1.2px] uppercase font-light transition-colors duration-300 hover:opacity-60",
                !isHome || scrolled ? "text-dark-stone" : "text-white/90",
              )}
            >
              {ctaBookTableLabel}
            </Link>
            <Link
              href={resolvedStayUrl}
              target={isExternal(resolvedStayUrl) ? "_blank" : undefined}
              rel={
                isExternal(resolvedStayUrl) ? "noopener noreferrer" : undefined
              }
              className="hidden lg:flex items-center text-[11px] tracking-[1.2px] uppercase font-light text-white px-6 py-3 hover:opacity-90 transition-opacity bg-[linear-gradient(165deg,var(--brand)_0%,var(--brand-mid)_100%)]"
            >
              {ctaBookStayLabel}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={cn(
                "lg:hidden hover:opacity-70 focus:outline-none transition-opacity",
                !isHome || scrolled ? "text-dark-stone" : "text-white",
              )}
              aria-label={menuOpenLabel}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          "bg-warm-white",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-8 h-16">
          <Link href="/" className="flex items-center gap-3">
            {logoSvgContent ? (
              <span
                dangerouslySetInnerHTML={{ __html: logoSvgContent }}
                className="logo-svg h-8 flex items-center text-dark-stone [&_svg]:h-full [&_svg]:w-auto"
              />
            ) : logoImageUrl ? (
              <img
                src={logoImageUrl}
                alt={logoText || "Allégade 10"}
                className="h-8 w-auto object-contain"
              />
            ) : null}
            {!logoImageUrl && !logoSvgContent && (
              <div className="flex items-baseline">
                {logoText ? (
                  <span className="text-xl text-dark-stone font-newsreader font-extralight">
                    {logoText}
                  </span>
                ) : (
                  <>
                    <span className="text-xl text-dark-stone font-newsreader font-extralight">
                      Allégade
                    </span>
                    <span className="text-xl ml-1 text-dark-stone font-cormorant font-light italic">
                      10
                    </span>
                  </>
                )}
              </div>
            )}
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-warm-brown hover:text-dark-stone transition-colors p-1"
            aria-label={menuCloseLabel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col px-4 py-2 gap-1 overflow-y-auto">
          {mobileNavLinks.map((link) => {
            const active = isActive(link.href);
            const hasChildren = link.children && link.children.length > 0;
            return (
              <div key={link.name}>
                <Link
                  href={link.href ?? "/"}
                  onClick={() => setDrawerOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3.5 text-[11px] font-light tracking-[1.2px] uppercase hover:text-dark-stone hover:bg-warm-gray rounded-lg transition-all duration-200",
                    active
                      ? "text-dark-stone underline underline-offset-4 decoration-brand/40"
                      : "text-warm-brown",
                  )}
                >
                  {link.name}
                </Link>
                {hasChildren && link.children!.map((child) => (
                  <Link
                    key={child.name}
                    href={child.href ?? "/"}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center pl-8 pr-4 py-2.5 text-[10px] font-light tracking-[1px] uppercase hover:text-dark-stone hover:bg-warm-gray rounded-lg transition-all duration-200",
                      isActive(child.href)
                        ? "text-dark-stone"
                        : "text-warm-brown/70",
                    )}
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="px-8 flex flex-col gap-3 mt-auto pb-10 pt-6">
          <Link
            href={resolvedTableUrl}
            target={isExternal(resolvedTableUrl) ? "_blank" : undefined}
            rel={
              isExternal(resolvedTableUrl) ? "noopener noreferrer" : undefined
            }
            onClick={() => setDrawerOpen(false)}
            className="px-5 py-3 text-center text-[11px] font-light tracking-[1.2px] uppercase text-dark-stone border border-border-warm rounded-full hover:border-brand transition-all duration-300"
          >
            {ctaBookTableLabel}
          </Link>
          <Link
            href={resolvedStayUrl}
            target={isExternal(resolvedStayUrl) ? "_blank" : undefined}
            rel={
              isExternal(resolvedStayUrl) ? "noopener noreferrer" : undefined
            }
            onClick={() => setDrawerOpen(false)}
            className="px-5 py-3 text-center text-[11px] font-light tracking-[1.2px] uppercase text-white rounded-full hover:opacity-90 transition-all duration-300 bg-[linear-gradient(165deg,var(--brand)_0%,var(--brand-mid)_100%)]"
          >
            {ctaBookStayLabel}
          </Link>
        </div>
      </div>
    </>
  );
}
