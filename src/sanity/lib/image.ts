import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";

const { projectId, dataset } = client.config();

const builder = createImageUrlBuilder({ projectId: projectId!, dataset: dataset! });

// Defaults: auto-negotiate WebP/AVIF and a sane quality for photographic content.
// Callers can still override (e.g. .format("png") or .quality(90)).
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").quality(80).fit("max");
}

// Parse "image-<hash>-<w>x<h>-<ext>" → {width, height}. Sanity asset _refs encode
// original dimensions, which lets us set intrinsic width/height on <Image> without
// an extra GROQ fetch. Returns null if the ref isn't recognized.
export function dimensionsFromRef(ref?: string | null): { width: number; height: number } | null {
  if (!ref) return null;
  const m = ref.match(/-(\d+)x(\d+)-[a-z]+$/i);
  if (!m) return null;
  return { width: Number(m[1]), height: Number(m[2]) };
}

// Pull a pre-computed low-quality image placeholder (data URI) from a Sanity
// image asset. Sanity generates this for free on upload (asset.metadata.lqip);
// we just need to request it in the GROQ query. Feeds next/image's
// placeholder="blur".
export function lqipFromImage(image: unknown): string | undefined {
  if (!image || typeof image !== "object") return undefined;
  const asset = (image as { asset?: { metadata?: { lqip?: string } } }).asset;
  return asset?.metadata?.lqip;
}
