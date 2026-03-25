import { createClient } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";

const writeClient = createClient({
  projectId: "b0bkhf04",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, occasion, guestCount, desiredDate, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Udfyld venligst navn, email og besked." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ugyldig email adresse." },
        { status: 400 }
      );
    }

    await writeClient.create({
      _type: "selskaberInquiry",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      occasion: occasion || "",
      guestCount: guestCount ? Number(guestCount) : undefined,
      desiredDate: desiredDate || "",
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      status: "new",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Selskaber inquiry error:", error);
    return NextResponse.json(
      { error: "Noget gik galt. Prøv venligst igen eller kontakt os direkte." },
      { status: 500 }
    );
  }
}
