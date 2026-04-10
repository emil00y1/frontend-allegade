"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-white flex items-center">
      <div className="max-w-4xl mx-auto px-6 lg:px-16 py-24 text-center">
        <span className="block text-xs tracking-[0.25em] uppercase font-medium text-stone-400 mb-6">
          Fejl
        </span>
        <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl font-light leading-[1.1] text-stone-900 mb-5">
          Noget gik galt
        </h1>
        <div className="w-10 h-px bg-stone-300 mx-auto mb-8" />
        <p className="text-stone-500 text-lg font-light mb-12">
          Vi beklager ulejligheden. Prøv venligst igen, eller vend tilbage til
          forsiden.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-3 border border-stone-900 text-stone-900 px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:bg-stone-900 hover:text-white"
          >
            Prøv igen
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-3 border border-stone-900 text-stone-900 px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:bg-stone-900 hover:text-white group"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1.5">
              &larr;
            </span>
            Gå til forsiden
          </a>
        </div>
      </div>
    </main>
  );
}
