"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SelskaberInquiryFormProps {
  occasionOptions?: string[];
  heading?: string;
  description?: string;
  phone?: string;
  email?: string;
}

const DEFAULT_OCCASIONS = [
  "Bryllup",
  "Barnedåb",
  "Fødselsdag",
  "Firmafest",
  "Konfirmation",
  "Jubilæum",
  "Andet",
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function SelskaberInquiryForm({
  occasionOptions,
  heading = "Send en forespørgsel",
  description = "Fortæl os lidt om jeres planer, så vender vi tilbage med et uforpligtende forslag til jeres arrangement.",
  phone = "+45 33 31 17 51",
  email = "info@allegade10.dk",
}: SelskaberInquiryFormProps) {
  const options = occasionOptions ?? DEFAULT_OCCASIONS;

  const [fields, setFields] = useState({
    name: "",
    email: "",
    occasion: "",
    guestCount: "",
    desiredDate: "",
    message: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const set = (key: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/selskaber-inquiry", {
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

  const inputClass =
    "w-full bg-transparent border border-border-warm px-4 py-3 text-sm text-[#292524] placeholder-[#292524]/30 focus:outline-none focus:border-warm-brown transition-colors";
  const labelClass = "block text-[10px] tracking-[1.5px] uppercase text-[#78716c] mb-2";

  if (formState === "success") {
    return (
      <section id="foresporgsel" className="bg-warm-gray py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-10 lg:px-16">
          <div className="max-w-lg">
            <p className="text-[10px] tracking-[2px] uppercase text-brand mb-6">
              Tak for din henvendelse
            </p>
            <h2 className="font-newsreader font-extralight text-3xl text-[#292524] leading-tight mb-4">
              Vi har modtaget jeres forespørgsel
            </h2>
            <p className="text-[#78716c] font-light leading-7 text-sm">
              Vi vender tilbage hurtigst muligt med et uforpligtende forslag. I
              kan også kontakte os direkte på{" "}
              <a href={`tel:${phone}`} className="text-[#292524] hover:text-brand transition-colors">
                {phone}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="foresporgsel" className="bg-warm-gray py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24">
          {/* Left: heading + contact */}
          <div className="flex flex-col gap-6 lg:pt-2">
            <div>
              <h2 className="font-newsreader font-extralight text-[clamp(2rem,3.5vw,2.75rem)] text-[#292524] leading-tight">
                {heading}
              </h2>
            </div>
            <p className="text-[#78716c] font-light leading-7 text-sm max-w-sm">
              {description}
            </p>

            <div className="border-t border-border-warm pt-8 flex flex-col gap-4">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 text-[#78716c] hover:text-brand transition-colors group"
                >
                  <span className="text-brand shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                    </svg>
                  </span>
                  <span className="text-sm font-light tracking-wide">{phone}</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 text-[#78716c] hover:text-brand transition-colors group"
                >
                  <span className="text-brand shrink-0">
                    <svg width="16" height="14" viewBox="0 0 24 20" fill="none">
                      <path d="M20 0H4C2.9 0 2.01.9 2.01 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V2l8 5 8-5v2z" fill="currentColor"/>
                    </svg>
                  </span>
                  <span className="text-sm font-light tracking-wide">{email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Row 1: Navn + Email */}
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

            {/* Row 2: Anledning + Antal gæster */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Anledning</label>
                <select
                  value={fields.occasion}
                  onChange={set("occasion")}
                  className={cn(inputClass, "appearance-none cursor-pointer")}
                >
                  <option value="" className="bg-warm-gray">
                    Vælg anledning
                  </option>
                  {options.map((o) => (
                    <option key={o} value={o} className="bg-warm-gray">
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Antal gæster</label>
                <input
                  type="number"
                  min={1}
                  value={fields.guestCount}
                  onChange={set("guestCount")}
                  placeholder="f.eks. 40"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 3: Dato */}
            <div>
              <label className={labelClass}>Ønsket dato</label>
              <input
                type="date"
                value={fields.desiredDate}
                onChange={set("desiredDate")}
                className={cn(inputClass, "cursor-pointer [color-scheme:light]")}
              />
            </div>

            {/* Row 4: Besked */}
            <div>
              <label className={labelClass}>Besked *</label>
              <textarea
                value={fields.message}
                onChange={set("message")}
                placeholder="Fortæl os om jeres arrangement, ønsker til menu, særlige behov osv."
                required
                rows={5}
                className={cn(inputClass, "resize-none")}
              />
            </div>

            {/* Error */}
            {formState === "error" && (
              <p className="text-sm text-red-600 font-light">{errorMessage}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="w-full py-4 text-[12px] tracking-[2px] uppercase font-light text-white bg-brand hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formState === "submitting" ? "Sender…" : "Send forespørgsel"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
