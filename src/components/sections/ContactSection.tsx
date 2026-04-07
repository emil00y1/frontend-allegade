"use client";

import { useState } from "react";

interface ContactSectionProps {
  eyebrow?: string;
  heading?: string;
  phone?: string;
  email?: string;
  address?: string;
  notificationEmail?: string;
}

type FormState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full bg-transparent border border-[#e0dbd8] px-4 py-3 text-sm text-[#292524] placeholder-[#292524]/30 focus:outline-none focus:border-[#8b6f47] transition-colors";
const labelClass = "block text-[10px] tracking-[1.5px] uppercase text-[#78716c] mb-2";

export default function ContactSection({
  eyebrow = "Kom i kontakt",
  heading = "Kontakt Os",
  phone = "+45 33 31 17 51",
  email = "info@allegade10.dk",
  address,
}: ContactSectionProps) {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const set =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.error ?? "Noget gik galt.");
        setFormState("error");
      } else {
        setFormState("success");
      }
    } catch {
      setErrorMessage("Netværksfejl. Prøv venligst igen.");
      setFormState("error");
    }
  };

  return (
    <section className="bg-[#f5f0e8] py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24">
          {/* Left: contact info */}
          <div className="flex flex-col gap-6 lg:pt-2">
            {eyebrow && (
              <span className="text-[10px] tracking-[2px] uppercase text-[#8b6f47]">
                {eyebrow}
              </span>
            )}
            <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] text-[#292524] leading-tight">
              {heading}
            </h2>

            <div className="border-t border-[#e0dbd8] pt-8 flex flex-col gap-4">
              {address && (
                <div className="flex items-start gap-4 text-[#78716c]">
                  <span className="text-[#8b6f47] shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-light leading-relaxed">{address}</span>
                </div>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 text-[#78716c] hover:text-[#8b6f47] transition-colors"
                >
                  <span className="text-[#8b6f47] shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-light tracking-wide">{phone}</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 text-[#78716c] hover:text-[#8b6f47] transition-colors"
                >
                  <span className="text-[#8b6f47] shrink-0">
                    <svg width="16" height="14" viewBox="0 0 24 20" fill="none">
                      <path
                        d="M20 0H4C2.9 0 2.01.9 2.01 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V2l8 5 8-5v2z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-light tracking-wide">{email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Right: form */}
          {formState === "success" ? (
            <div className="flex flex-col justify-center gap-4">
              <span className="text-[10px] tracking-[2px] uppercase text-[#8b6f47]">
                Tak for din besked
              </span>
              <h3 className="font-newsreader font-extralight text-2xl text-[#292524] leading-tight">
                Vi vender tilbage hurtigst muligt
              </h3>
              <p className="text-sm font-light text-[#78716c] leading-7">
                Du er også velkommen til at ringe til os på{" "}
                <a href={`tel:${phone?.replace(/\s/g, "")}`} className="text-[#292524] hover:text-[#8b6f47] transition-colors">
                  {phone}
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Navn *</label>
                  <input
                    type="text"
                    value={fields.name}
                    onChange={set("name")}
                    placeholder="Jens Jensen"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    value={fields.email}
                    onChange={set("email")}
                    placeholder="jens@eksempel.dk"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Besked *</label>
                <textarea
                  value={fields.message}
                  onChange={set("message")}
                  placeholder="Skriv din besked her…"
                  required
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {formState === "error" && (
                <p className="text-sm text-red-600 font-light">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={formState === "submitting"}
                className="w-full py-4 text-[12px] tracking-[2px] uppercase font-light text-white bg-[#8b6f47] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formState === "submitting" ? "Sender…" : "Send besked"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
