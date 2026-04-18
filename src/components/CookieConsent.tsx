"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { X } from "lucide-react";

// Cookie consent following Danish cookiebekendtgørelsen:
// users must be able to accept, decline, or choose per-category before any
// non-essential cookies are set. Stored as a JSON object so future categories
// (marketing, functional) slot in without breaking older clients.

const COOKIE_KEY = "cookie-consent";
const CONSENT_VERSION = 2;

type Consent = {
  v: number;
  essential: true;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const getSnapshot = () => localStorage.getItem(COOKIE_KEY);
const getServerSnapshot = () => "ssr";

function persist(consent: Consent) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
  listeners.forEach((l) => l());
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });
  }
}

function parseConsent(raw: string | null): Consent | null {
  if (!raw) return null;
  // Handle legacy "accepted" / "declined" values from v1.
  if (raw === "accepted")
    return { v: 1, essential: true, analytics: true, marketing: false, ts: 0 };
  if (raw === "declined")
    return { v: 1, essential: true, analytics: false, marketing: false, ts: 0 };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "analytics" in parsed)
      return parsed as Consent;
  } catch {}
  return null;
}

export default function CookieConsent() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const consent = stored === "ssr" ? null : parseConsent(stored);
  // Re-prompt users on a newer consent version to gather fresh consent.
  if (consent && consent.v >= CONSENT_VERSION) return null;

  function acceptAll() {
    persist({ v: CONSENT_VERSION, essential: true, analytics: true, marketing: true, ts: Date.now() });
  }
  function rejectAll() {
    persist({ v: CONSENT_VERSION, essential: true, analytics: false, marketing: false, ts: Date.now() });
  }
  function saveSelection() {
    persist({ v: CONSENT_VERSION, essential: true, analytics, marketing, ts: Date.now() });
  }

  if (showPrefs) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-prefs-title"
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      >
        <div className="w-full max-w-lg rounded-lg border border-border-warm/40 bg-warm-white p-6 shadow-2xl">
          <div className="flex items-start justify-between mb-4">
            <h2
              id="cookie-prefs-title"
              className="font-newsreader font-extralight text-xl text-dark-stone"
            >
              Cookie-indstillinger
            </h2>
            <button
              onClick={() => setShowPrefs(false)}
              className="text-warm-brown/60 hover:text-warm-brown p-1"
              aria-label="Luk"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm font-light leading-relaxed text-warm-brown mb-5">
            Vælg hvilke cookies du vil tillade. Du kan til enhver tid ændre
            dit valg via linket i bunden af siden.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <label className="flex items-start gap-3 p-3 border border-border-warm/40 rounded">
              <input type="checkbox" checked disabled className="mt-1 accent-brand" />
              <div>
                <p className="text-sm text-dark-stone font-light">Nødvendige</p>
                <p className="text-xs text-warm-brown/70 font-light mt-1">
                  Påkrævet for at sitet fungerer. Kan ikke fravælges.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border border-border-warm/40 rounded cursor-pointer hover:border-brand/40 transition-colors">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 accent-brand"
              />
              <div>
                <p className="text-sm text-dark-stone font-light">Statistik</p>
                <p className="text-xs text-warm-brown/70 font-light mt-1">
                  Anonym trafikmåling via Google Analytics.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border border-border-warm/40 rounded cursor-pointer hover:border-brand/40 transition-colors">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1 accent-brand"
              />
              <div>
                <p className="text-sm text-dark-stone font-light">Markedsføring</p>
                <p className="text-xs text-warm-brown/70 font-light mt-1">
                  Bruges til at vise relevant indhold og annoncer.
                </p>
              </div>
            </label>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              onClick={rejectAll}
              className="rounded-md px-4 py-2 text-xs font-medium text-warm-brown/70 hover:text-warm-brown transition-colors cursor-pointer"
            >
              Afvis alle
            </button>
            <button
              onClick={saveSelection}
              className="rounded-md border border-border-warm px-4 py-2 text-xs font-medium text-dark-stone hover:border-brand transition-colors cursor-pointer"
            >
              Gem valg
            </button>
            <button
              onClick={acceptAll}
              className="rounded-md bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand-mid transition-colors cursor-pointer"
            >
              Acceptér alle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Cookie-samtykke"
      className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-border-warm/40 bg-warm-white/95 p-5 shadow-lg backdrop-blur-sm"
    >
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
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={acceptAll}
          className="rounded-md bg-brand px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-mid cursor-pointer"
        >
          Acceptér alle
        </button>
        <button
          onClick={rejectAll}
          className="rounded-md border border-border-warm px-4 py-1.5 text-xs font-medium text-dark-stone hover:border-brand transition-colors cursor-pointer"
        >
          Afvis alle
        </button>
        <button
          onClick={() => setShowPrefs(true)}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-warm-brown/70 transition-colors hover:text-warm-brown cursor-pointer"
        >
          Tilpas
        </button>
      </div>
    </div>
  );
}
