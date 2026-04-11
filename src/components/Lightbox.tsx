"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxImage {
  src: string;
  alt?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [isVisible, setIsVisible] = useState(false);

  const count = images.length;
  const current = images[index];

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
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

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-stone/95"
        onClick={close}
      />

      {/* Close button */}
      <button
        onClick={close}
        className="absolute top-5 right-5 z-10 p-2 text-warm-white/70 hover:text-warm-white transition-colors"
        aria-label="Close lightbox"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-[11px] tracking-[1.4px] uppercase font-light text-warm-white/60">
        {index + 1} / {count}
      </div>

      {/* Previous */}
      {count > 1 && (
        <button
          onClick={prev}
          className="absolute left-3 md:left-6 z-10 p-2 text-warm-white/50 hover:text-warm-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft size={32} strokeWidth={1.2} />
        </button>
      )}

      {/* Next */}
      {count > 1 && (
        <button
          onClick={next}
          className="absolute right-3 md:right-6 z-10 p-2 text-warm-white/50 hover:text-warm-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight size={32} strokeWidth={1.2} />
        </button>
      )}

      {/* Image */}
      <div className="relative z-[1] w-[90vw] h-[80vh] max-w-6xl">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt ?? ""}
          fill
          sizes="90vw"
          className="object-contain transition-opacity duration-300"
          priority
        />
      </div>
    </div>
  );
}
