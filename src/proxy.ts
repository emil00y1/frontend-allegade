import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: "b0bkhf04",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});

const REDIRECTS_QUERY = `*[_type == "redirect"]{ source, destination, permanent }`;

let cachedRedirects: { source: string; destination: string; permanent: boolean }[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

async function getRedirects() {
  const now = Date.now();
  if (cachedRedirects && now - cacheTimestamp < CACHE_TTL) {
    return cachedRedirects;
  }
  cachedRedirects = await client.fetch(REDIRECTS_QUERY);
  cacheTimestamp = now;
  return cachedRedirects!;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const redirects = await getRedirects();
  const match = redirects.find((r) => r.source === path);

  if (match) {
    const url = match.destination.startsWith("http")
      ? match.destination
      : `${request.nextUrl.origin}${match.destination}`;

    return NextResponse.redirect(url, match.permanent ? 308 : 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals, static files, and API routes.
     */
    "/((?!_next/|api/|favicon\\.ico|.*\\..*).*)",
  ],
};
