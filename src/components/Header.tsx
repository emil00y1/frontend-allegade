"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  name: string;
  href: string;
}

interface HeaderProps {
  navLinks?: NavLink[];
  ctaBookTableLabel?: string;
  ctaBookTableUrl?: string;
  ctaBookStayLabel?: string;
  ctaBookStayUrl?: string;
}

function isExternal(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
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
  ctaBookTableUrl = "/book-bord",
  ctaBookStayLabel = "Book ophold",
  ctaBookStayUrl = "/book-ophold",
}: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const resolvedNavLinks = navLinks && navLinks.length > 0 ? navLinks : DEFAULT_NAV_LINKS;
  const resolvedTableUrl = ctaBookTableUrl ?? "/book-bord";
  const resolvedStayUrl = ctaBookStayUrl ?? "/book-ophold";

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
          isHome ? "fixed" : "sticky bg-warm-white border-border-warm shadow-sm",
          isHome && (scrolled
            ? "bg-warm-white border-border-warm shadow-sm"
            : "bg-transparent border-transparent")
        )}
      >
        <div className="max-w-[1280px] mx-auto px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-baseline shrink-0">
            <span
              className={cn(
                "text-2xl font-newsreader font-extralight transition-colors duration-300",
                !isHome || scrolled ? "text-dark-stone" : "text-white"
              )}
            >
              Allégade
            </span>
            <span
              className={cn(
                "text-2xl ml-1 font-cormorant font-light italic transition-colors duration-300",
                !isHome || scrolled ? "text-dark-stone" : "text-white"
              )}
            >
              10
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {resolvedNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href ?? "/"}
                className={cn(
                  "text-[11px] tracking-[1.2px] uppercase font-light transition-colors duration-300 hover:opacity-60",
                  !isHome || scrolled ? "text-dark-stone" : "text-white/90"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link
              href={resolvedTableUrl}
              target={isExternal(resolvedTableUrl) ? "_blank" : undefined}
              rel={isExternal(resolvedTableUrl) ? "noopener noreferrer" : undefined}
              className={cn(
                "hidden lg:block text-[11px] tracking-[1.2px] uppercase font-light transition-colors duration-300 hover:opacity-60",
                !isHome || scrolled ? "text-dark-stone" : "text-white/90"
              )}
            >
              {ctaBookTableLabel}
            </Link>
            <Link
              href={resolvedStayUrl}
              target={isExternal(resolvedStayUrl) ? "_blank" : undefined}
              rel={isExternal(resolvedStayUrl) ? "noopener noreferrer" : undefined}
              className="hidden lg:flex items-center text-[11px] tracking-[1.2px] uppercase font-light text-white px-6 py-3 hover:opacity-90 transition-opacity bg-[linear-gradient(165deg,#903f00_0%,#b45309_100%)]"
            >
              {ctaBookStayLabel}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={cn(
                "lg:hidden hover:opacity-70 focus:outline-none transition-opacity",
                !isHome || scrolled ? "text-dark-stone" : "text-white"
              )}
              aria-label="Åbn menu"
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
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          "bg-warm-white",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-8 h-20">
          <Link href="/" className="flex items-baseline">
            <span className="text-xl text-dark-stone font-newsreader font-extralight">
              Allégade
            </span>
            <span className="text-xl ml-1 text-dark-stone font-cormorant font-light italic">
              10
            </span>
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-warm-brown hover:text-dark-stone transition-colors p-1"
            aria-label="Luk menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col px-4 py-2 gap-1 overflow-y-auto">
          {resolvedNavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href ?? "/"}
              onClick={() => setDrawerOpen(false)}
              className="flex items-center px-4 py-3.5 text-[11px] font-light tracking-[1.2px] uppercase text-warm-brown hover:text-dark-stone hover:bg-warm-gray rounded-lg transition-all duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="px-8 flex flex-col gap-3 mt-auto pb-10 pt-6">
          <Link
            href={resolvedTableUrl}
            target={isExternal(resolvedTableUrl) ? "_blank" : undefined}
            rel={isExternal(resolvedTableUrl) ? "noopener noreferrer" : undefined}
            onClick={() => setDrawerOpen(false)}
            className="px-5 py-3 text-center text-[11px] font-light tracking-[1.2px] uppercase text-dark-stone border border-border-warm rounded-full hover:border-brand transition-all duration-300"
          >
            {ctaBookTableLabel}
          </Link>
          <Link
            href={resolvedStayUrl}
            target={isExternal(resolvedStayUrl) ? "_blank" : undefined}
            rel={isExternal(resolvedStayUrl) ? "noopener noreferrer" : undefined}
            onClick={() => setDrawerOpen(false)}
            className="px-5 py-3 text-center text-[11px] font-light tracking-[1.2px] uppercase text-white rounded-full hover:opacity-90 transition-all duration-300 bg-[linear-gradient(165deg,#903f00_0%,#b45309_100%)]"
          >
            {ctaBookStayLabel}
          </Link>
        </div>
      </div>
    </>
  );
}
