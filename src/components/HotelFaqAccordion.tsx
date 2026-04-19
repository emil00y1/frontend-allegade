"use client";

import { useState } from "react";
import { PortableText } from "next-sanity";
import type { TypedObject } from "sanity";
import { cn } from "@/lib/utils";

interface FaqItem {
  _key: string;
  question?: string;
  answer?: TypedObject[] | string;
}

interface HotelFaqAccordionProps {
  items: FaqItem[];
}

export function HotelFaqAccordion({ items }: HotelFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items?.length) return null;

  return (
    <div className="border-t border-b border-[rgba(221,193,179,0.3)]">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item._key}
            className={cn("border-b border-[rgba(221,193,179,0.3)] last:border-b-0")}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-8 text-left group"
              aria-expanded={isOpen}
            >
              <span className="text-[14px] tracking-[2.8px] uppercase font-semibold text-dark-stone">
                {item.question}
              </span>
              <span
                className={cn(
                  "ml-6 shrink-0 text-warm-brown transition-transform duration-300",
                  isOpen && "rotate-180"
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
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="prose prose-base max-w-none font-light leading-relaxed prose-p:text-warm-brown [&_p]:text-warm-brown pr-12 pb-8">
                  {Array.isArray(item.answer) ? (
                    <PortableText value={item.answer} />
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
