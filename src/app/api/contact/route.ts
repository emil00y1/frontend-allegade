import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rate-limit";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { name, email, message } = body;

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

    const recipient =
      process.env.CONTACT_NOTIFICATION_EMAIL ||
      process.env.SMTP_USER;

    if (recipient && process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: recipient,
        replyTo: `${name.trim()} <${email.trim()}>`,
        subject: `Ny besked fra ${name.trim()} – allegade10.dk`,
        text: [
          `Navn: ${name.trim()}`,
          `Email: ${email.trim()}`,
          ``,
          `Besked:`,
          message.trim(),
        ].join("\n"),
        html: `
          <table style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#2c2c2c;">
            <tr><td style="padding:32px 0 16px;">
              <h2 style="margin:0;font-weight:normal;font-size:22px;">Ny kontaktbesked</h2>
            </td></tr>
            <tr><td style="border-top:1px solid #e0dbd8;padding:24px 0;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#888;font-size:13px;width:140px;">Navn</td><td style="padding:6px 0;font-size:14px;">${name.trim()}</td></tr>
                <tr><td style="padding:6px 0;color:#888;font-size:13px;">Email</td><td style="padding:6px 0;font-size:14px;"><a href="mailto:${email.trim()}" style="color:#8b6f47;">${email.trim()}</a></td></tr>
              </table>
            </td></tr>
            <tr><td style="padding:24px 0 0;">
              <p style="margin:0 0 8px;color:#888;font-size:13px;">Besked</p>
              <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message.trim()}</p>
            </td></tr>
            <tr><td style="padding:32px 0 0;border-top:1px solid #e0dbd8;margin-top:24px;">
              <p style="margin:0;font-size:12px;color:#aaa;">Sendt via kontaktformularen på allegade10.dk</p>
            </td></tr>
          </table>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Noget gik galt. Prøv venligst igen eller kontakt os direkte." },
      { status: 500 }
    );
  }
}
