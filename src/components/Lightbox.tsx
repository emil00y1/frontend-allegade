"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [isVisible, setIsVisible] = useState(false);
  // Crossfade: track which src is "active" so the outgoing image stays mounted
  // briefly while the incoming one fades in.
  const [fadingIn, setFadingIn] = useState(true);

  const count = images.length;
  const current = images[index];

  // Touch swipe state
  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50; // px

  const goTo = useCallback(
    (next: number) => {
      setFadingIn(false);
      // Brief delay lets the fade-out start before swapping the src
      setTimeout(() => {
        setIndex(next);
        setFadingIn(true);
      }, 200);
    },
    [],
  );

  const prev = useCallback(() => goTo((index - 1 + count) % count), [goTo, index, count]);
  const next = useCallback(() => goTo((index + 1) % count), [goTo, index, count]);

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  // Fade in on mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Lock body scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [close, prev, next]);

  // Touch swipe handlers
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    delta < 0 ? next() : prev();
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-stone/96" onClick={close} />

      {/* Close */}
      <button
        onClick={close}
        className="absolute top-5 right-5 z-10 p-2 text-warm-white/60 hover:text-warm-white transition-colors"
        aria-label="Close lightbox"
      >
        <X size={22} strokeWidth={1.5} />
      </button>

      {/* Counter */}
      {count > 1 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-[10px] tracking-[1.6px] uppercase text-warm-white/40 select-none">
          {index + 1} / {count}
        </div>
      )}

      {/* Prev */}
      {count > 1 && (
        <button
          onClick={prev}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-3 text-warm-white/40 hover:text-warm-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft size={28} strokeWidth={1.2} />
        </button>
      )}

      {/* Next */}
      {count > 1 && (
        <button
          onClick={next}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-3 text-warm-white/40 hover:text-warm-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight size={28} strokeWidth={1.2} />
        </button>
      )}

      {/* Image + caption */}
      <div className="relative z-[1] flex flex-col items-center gap-4 w-full px-14 md:px-20">
        <div
          className="relative w-full max-w-5xl"
          style={{ height: "clamp(240px, 72vh, 820px)" }}
        >
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt ?? ""}
            fill
            sizes="(max-width: 768px) 90vw, 80vw"
            className={`object-contain transition-opacity duration-200 ${fadingIn ? "opacity-100" : "opacity-0"}`}
            priority
          />
        </div>

        {current.caption && (
          <p
            className={`text-warm-white/60 text-[11px] tracking-[1.2px] uppercase text-center max-w-lg transition-opacity duration-200 ${
              fadingIn ? "opacity-100" : "opacity-0"
            }`}
          >
            {current.caption}
          </p>
        )}
      </div>
    </div>
  );
}
