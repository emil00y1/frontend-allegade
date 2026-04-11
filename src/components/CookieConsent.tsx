"use client";

import { useState } from "react";
import Link from "next/link";

const COOKIE_KEY = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && !localStorage.getItem(COOKIE_KEY),
  );

  function respond(choice: "accepted" | "declined") {
    localStorage.setItem(COOKIE_KEY, choice);
    setVisible(false);

    if (choice === "accepted" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-border-warm/40 bg-warm-white/95 p-5 shadow-lg backdrop-blur-sm">
      <p className="text-sm leading-relaxed text-warm-brown">
        Vi bruger cookies for at sikre den bedste oplevelse på vores hjemmeside
        og til at analysere trafikken anonymt.{" "}
        <Link
          href="/cookiepolitik"
          className="underline underline-offset-2 hover:text-brand transition-colors"
        >
          Læs mere
        </Link>
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => respond("accepted")}
          className="rounded-md bg-brand px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-mid cursor-pointer"
        >
          Acceptér
        </button>
        <button
          onClick={() => respond("declined")}
          className="rounded-md px-4 py-1.5 text-xs font-medium text-warm-brown/70 transition-colors hover:text-warm-brown cursor-pointer"
        >
          Afvis
        </button>
      </div>
    </div>
  );
}
