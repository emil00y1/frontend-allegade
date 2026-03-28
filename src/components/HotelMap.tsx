"use client";

import { useRef, useCallback } from "react";
import { LocateFixed } from "lucide-react";

interface HotelMapProps {
  src: string;
}

export default function HotelMap({ src }: HotelMapProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const recenter = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    // Reload the iframe to reset to original position
    iframe.src = src;
  }, [src]);

  return (
    <div className="relative overflow-hidden min-h-[350px]">
      <iframe
        ref={iframeRef}
        src={src}
        width="100%"
        height="100%"
        className="absolute inset-0 w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Kort over Allégade 10"
      />
      <button
        onClick={recenter}
        className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 hover:bg-white text-dark-stone px-3 py-2 rounded shadow-sm text-[10px] tracking-[1px] uppercase font-medium transition-colors duration-200"
        aria-label="Centrér kort"
      >
        <LocateFixed className="w-3.5 h-3.5" strokeWidth={1.5} />
        Centrér
      </button>
    </div>
  );
}
