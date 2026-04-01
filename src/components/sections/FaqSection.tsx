"use client";

import { useState } from "react";
import { PortableText } from "next-sanity";
import type { TypedObject } from "sanity";
import { cn } from "@/lib/utils";

type FaqItem = {
  _key: string;
  question?: string;
  answer?: TypedObject[];
};

type FaqSectionProps = {
  heading?: string;
  description?: string;
  items?: FaqItem[];
};

export default function FaqSection({
  heading,
  description,
  items,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items?.length) return null;

  return (
    <section className="bg-white py-14 md:py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-16">
        {heading && (
          <h2 className="font-serif text-3xl md:text-4xl xl:text-5xl font-light leading-[1.1] text-stone-900 mb-5 text-center">
            {heading}
          </h2>
        )}

        {description && (
          <p className="text-stone-600 text-base md:text-lg font-light leading-relaxed text-center max-w-2xl mx-auto mb-12">
            {description}
          </p>
        )}

        <div className="border-t border-b border-[rgba(221,193,179,0.3)]">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item._key}
                className="border-b border-[rgba(221,193,179,0.3)] last:border-b-0"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-8 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="text-[14px] tracking-[2.8px] uppercase font-semibold text-stone-900">
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      "ml-6 shrink-0 text-stone-400 transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  >
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="prose prose-base prose-stone max-w-none font-light leading-relaxed prose-p:text-stone-600 pr-12 pb-8">
                      {item.answer && <PortableText value={item.answer} />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
