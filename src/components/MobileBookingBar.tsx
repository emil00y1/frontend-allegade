"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, BedDouble } from "lucide-react";

interface MobileBookingBarProps {
  ctaBookTableLabel?: string;
  ctaBookTableUrl?: string;
  ctaBookStayLabel?: string;
  ctaBookStayUrl?: string;
}

function isExternal(url?: string) {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

// A Danish-hospitality convention: keep the two primary conversion actions
// ("book bord" / "book ophold") permanently within thumb reach on mobile.
// Hidden on desktop (lg+) since the header already surfaces them there.
// Hidden on the homepage until the user starts scrolling so it doesn't
// compete with the hero video loader.
export default function MobileBookingBar({
  ctaBookTableLabel = "Book bord",
  ctaBookTableUrl = "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10",
  ctaBookStayLabel = "Book ophold",
  ctaBookStayUrl = "https://allegade10.suitcasebooking.com/da",
}: MobileBookingBarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > 240);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <div
      aria-hidden={!visible}
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border-warm bg-warm-white/95 backdrop-blur-sm shadow-[0_-4px_16px_rgba(0,0,0,0.06)] transition-transform duration-300 pb-[env(safe-area-inset-bottom)] ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="grid grid-cols-2">
        <Link
          href={ctaBookTableUrl}
          target={isExternal(ctaBookTableUrl) ? "_blank" : undefined}
          rel={isExternal(ctaBookTableUrl) ? "noopener noreferrer" : undefined}
          className="flex items-center justify-center gap-2 py-5 text-[11px] tracking-[1.2px] uppercase font-light text-dark-stone border-r border-border-warm hover:bg-warm-gray/60 transition-colors"
        >
          <Calendar className="w-4 h-4 text-brand" strokeWidth={1.5} />
          {ctaBookTableLabel}
        </Link>
        <Link
          href={ctaBookStayUrl}
          target={isExternal(ctaBookStayUrl) ? "_blank" : undefined}
          rel={isExternal(ctaBookStayUrl) ? "noopener noreferrer" : undefined}
          className="flex items-center justify-center gap-2 py-5 text-[11px] tracking-[1.2px] uppercase font-light text-white bg-[linear-gradient(165deg,var(--brand)_0%,var(--brand-mid)_100%)] hover:opacity-95 transition-opacity"
        >
          <BedDouble className="w-4 h-4" strokeWidth={1.5} />
          {ctaBookStayLabel}
        </Link>
      </div>
    </div>
  );
}
