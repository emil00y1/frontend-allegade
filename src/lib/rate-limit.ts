import { NextRequest, NextResponse } from "next/server";

const hits = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5;   // per window per IP
const CLEANUP_INTERVAL = 5 * 60_000;

let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  const cutoff = now - WINDOW_MS;
  for (const [key, timestamps] of hits) {
    const valid = timestamps.filter((t) => t > cutoff);
    if (valid.length === 0) hits.delete(key);
    else hits.set(key, valid);
  }
}

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Returns a 429 response if the IP has exceeded the limit, or null if allowed.
 */
export function rateLimit(req: NextRequest): NextResponse | null {
  cleanup();

  const ip = getIP(req);
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  const timestamps = hits.get(ip) ?? [];
  const recent = timestamps.filter((t) => t > cutoff);

  if (recent.length >= MAX_REQUESTS) {
    return NextResponse.json(
      { error: "For mange forespørgsler. Prøv venligst igen om lidt." },
      { status: 429 },
    );
  }

  recent.push(now);
  hits.set(ip, recent);
  return null;
}
