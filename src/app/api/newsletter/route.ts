import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const { firstName, lastName, email } = await req.json();

  if (!email || !firstName) {
    return NextResponse.json({ error: "Navn og email er påkrævet." }, { status: 400 });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Newsletter ikke konfigureret." }, { status: 500 });
  }

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email,
      fields: {
        name: firstName,
        last_name: lastName,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: body?.message || "Tilmelding mislykkedes." },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
