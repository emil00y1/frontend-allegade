"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SanityImage } from "@/components/SanityImage";
import { urlFor } from "@/sanity/lib/image";
import { dataAttr } from "@/sanity/lib/visual-editing";

interface HeroProps {
  _key?: string;
  documentId?: string;
  documentType?: string;
  tagline?: string;
  heading?: string;
  headingItalic?: string;
  cta?: { label?: string; url?: string };
  ctaSecondary?: { label?: string; url?: string };
  sideText?: string;
  backgroundVideoUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backgroundImage?: any;
}

export default function Hero({
  _key,
  documentId,
  documentType,
  tagline = "Kulturel perle i Frederiksbergs centrum",
  heading = "Velkommen til",
  headingItalic = "Allégade 10",
  cta,
  ctaSecondary,
  sideText = "Siden 1780 — Frederiksberg",
  backgroundVideoUrl = "https://cdn.sanity.io/files/b0bkhf04/production/bf5322023ca71a37f92e42f0607cfba31b760e04.mp4",
  backgroundImage,
}: HeroProps) {
  const ctaPrimaryLabel = cta?.label ?? "Find dit bord";
  const ctaPrimaryUrl = cta?.url ?? "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";
  const ctaSecondaryLabel = ctaSecondary?.label ?? "Se vores værelser";
  const ctaSecondaryUrl = ctaSecondary?.url ?? "/hotel";
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [videoReady, setVideoReady] = useState(false);
  const [canFinish, setCanFinish] = useState(false);
  const [progressDone, setProgressDone] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);
  const [progress, setProgress] = useState(0);

  // Minimum duration (ms) the loader is shown so the 0→100 fill is visible.
  const MIN_LOADER_MS = 1000;

  useEffect(() => {
    if (!backgroundVideoUrl) {
      setVideoReady(true);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => setVideoReady(true);
    if (v.readyState >= 3) {
      onReady();
      return;
    }
    v.addEventListener("canplaythrough", onReady);
    v.addEventListener("loadeddata", onReady);
    // Safety fallback so the loader can't hang forever
    const timeout = window.setTimeout(onReady, 8000);
    return () => {
      v.removeEventListener("canplaythrough", onReady);
      v.removeEventListener("loadeddata", onReady);
      window.clearTimeout(timeout);
    };
  }, [backgroundVideoUrl]);

  // Enforce the minimum display window before the loader is allowed to finish.
  useEffect(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, MIN_LOADER_MS - elapsed);
    const t = window.setTimeout(() => setCanFinish(true), remaining);
    return () => window.clearTimeout(t);
  }, []);

  // Drive the progress bar. Tie the fill to elapsed time so it visibly
  // animates 0→~90% over MIN_LOADER_MS, then jumps to 100% when ready.
  useEffect(() => {
    const done = videoReady && canFinish;
    if (done) {
      setProgress(100);
      return;
    }
    let raf = 0;
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const timeTarget = Math.min(90, (elapsed / MIN_LOADER_MS) * 90);
      const v = videoRef.current;
      let real = 0;
      if (v && v.duration && v.buffered.length) {
        real = (v.buffered.end(v.buffered.length - 1) / v.duration) * 90;
      }
      const target = Math.max(timeTarget, real);
      setProgress((p) => (p < target ? p + (target - p) * 0.12 : p));
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [videoReady, canFinish]);

  // When the bar reaches 100%, wait for the width transition to visibly
  // finish, then start the overlay fade-out and finally unmount.
  const FILL_TRANSITION_MS = 500;
  const FADE_OUT_MS = 600;
  useEffect(() => {
    if (!(videoReady && canFinish)) return;
    const t = window.setTimeout(() => setProgressDone(true), FILL_TRANSITION_MS);
    return () => window.clearTimeout(t);
  }, [videoReady, canFinish]);

  useEffect(() => {
    if (!progressDone) return;
    const t = window.setTimeout(() => setHideLoader(true), FADE_OUT_MS);
    return () => window.clearTimeout(t);
  }, [progressDone]);

  return (
    <section className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        poster={
          backgroundImage
            ? urlFor(backgroundImage).width(1600).url()
            : undefined
        }
      >
        <source src={backgroundVideoUrl} type="video/mp4" />
      </video>

      {/* Fallback image if no video */}
      {!backgroundVideoUrl && backgroundImage && (
        <div
          className="absolute inset-0"
          data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].backgroundImage`)}
        >
          <SanityImage
            image={backgroundImage}
            alt="Allégade 10"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.65)_100%)]" />

      {/* Vertical side text */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 hidden md:block">
        <span className="text-white/30 text-[10px] tracking-[5px] uppercase font-light block [writing-mode:vertical-rl] rotate-180">
          {sideText}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto flex flex-col items-center my-16">
        {/* Tagline */}
        <span className="text-brand-light text-[12px] tracking-[3.6px] uppercase font-light mb-8 block">
          {tagline}
        </span>

        {/* Heading */}
        <h1 className="mb-16 text-center leading-none [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
          <span className="block text-[clamp(3rem,8vw,6rem)] text-white font-newsreader font-extralight">
            {heading}
          </span>
          <span className="block text-[clamp(3rem,8vw,6rem)] text-white/90 font-cormorant font-light italic">
            {headingItalic}
          </span>
        </h1>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={ctaPrimaryUrl}
            target={ctaPrimaryUrl?.startsWith("http") ? "_blank" : undefined}
            rel={
              ctaPrimaryUrl?.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="px-10 py-4 text-[14px] tracking-[1.4px] uppercase font-light text-white bg-brand hover:brightness-110 transition-all duration-300"
          >
            {ctaPrimaryLabel}
          </Link>
          <Link
            href={ctaSecondaryUrl}
            target={ctaSecondaryUrl?.startsWith("http") ? "_blank" : undefined}
            rel={
              ctaSecondaryUrl?.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="px-10 py-4 text-[14px] tracking-[1.4px] uppercase font-light text-white border border-white/40 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            {ctaSecondaryLabel}
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/50"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Full-screen loader — stays until the hero video is ready */}
      {!hideLoader && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-warm-white transition-opacity duration-[600ms] ease-out"
          style={{ opacity: progressDone ? 0 : 1, pointerEvents: progressDone ? "none" : "auto" }}
        >
          <div className="relative h-px w-56 overflow-hidden bg-black/5">
            <div
              className="absolute inset-y-0 left-0 bg-black/40 transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
