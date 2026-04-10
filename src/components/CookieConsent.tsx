"use client";

import { useState, useEffect } from "react";

const COOKIE_KEY = "cookie-consent";

type Consent = "accepted" | "declined" | null;

function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(COOKIE_KEY) as Consent;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

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
        Vi bruger cookies til at forbedre din oplevelse og til anonym
        trafikanalyse via Google Analytics.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => respond("accepted")}
          className="rounded-md bg-brand px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-mid"
        >
          Acceptér
        </button>
        <button
          onClick={() => respond("declined")}
          className="rounded-md px-4 py-1.5 text-xs font-medium text-warm-brown/70 transition-colors hover:text-warm-brown"
        >
          Afvis
        </button>
      </div>
    </div>
  );
}
