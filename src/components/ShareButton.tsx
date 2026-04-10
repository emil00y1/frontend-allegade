"use client";

import { useState, useRef, useEffect } from "react";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  url: string;
  title: string;
}

const socials = [
  {
    name: "Facebook",
    href: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    href: (url: string, title: string) =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "LinkedIn",
    href: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

export default function ShareButton({ url, title }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  async function copyLink() {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-1.5 rounded-full hover:bg-warm-gray/60 transition-colors text-warm-brown hover:text-brand"
        aria-label="Del begivenhed"
      >
        <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-warm-white border border-border-warm/30 shadow-md min-w-[140px] py-1">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href(fullUrl, title)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block px-4 py-2 text-xs font-light text-dark-stone hover:bg-warm-gray/40 hover:text-brand transition-colors"
            >
              {s.name}
            </a>
          ))}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              copyLink();
            }}
            className="w-full text-left px-4 py-2 text-xs font-light text-dark-stone hover:bg-warm-gray/40 hover:text-brand transition-colors"
          >
            {copied ? "Kopieret!" : "Kopiér link"}
          </button>
        </div>
      )}
    </div>
  );
}
