"use client";

import { useState } from "react";
import { Input } from "@/components/ui/FormField";

interface NewsletterSectionProps {
  label?: string;
  subtext?: string;
  buttonLabel?: string;
  firstNameLabel?: string;
  lastNameLabel?: string;
  emailLabel?: string;
  successMessage?: string;
  errorMessage?: string;
}

export default function NewsletterSection({
  label = "Nyhedsbrev",
  subtext = "Hold dig opdateret på events og tilbud",
  buttonLabel = "Tilmeld",
  firstNameLabel = "Fornavn",
  lastNameLabel = "Efternavn",
  emailLabel = "E-mailadresse",
  successMessage = "Tak! Du er nu tilmeldt vores nyhedsbrev.",
  errorMessage = "Noget gik galt. Prøv igen.",
}: NewsletterSectionProps) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("success");
      setMessage(successMessage);
      setForm({ firstName: "", lastName: "", email: "" });
    } else {
      setStatus("error");
      setMessage(data.error || errorMessage);
    }
  }

  return (
    <div className="bg-dark-stone">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Label */}
          <div className="shrink-0">
            <p className="text-[10px] tracking-[1.4px] uppercase font-light text-brand-light mb-1">
              {label}
            </p>
            <p className="text-white/70 text-sm font-light">
              {subtext}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 flex-1 min-w-0">
            <Input
              type="text"
              placeholder={firstNameLabel}
              required
              dark
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className="flex-1 min-w-0 py-2.5"
              autoComplete="given-name"
            />
            <Input
              type="text"
              placeholder={lastNameLabel}
              dark
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className="flex-1 min-w-0 py-2.5"
              autoComplete="family-name"
            />
            <Input
              type="email"
              placeholder={emailLabel}
              required
              dark
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="flex-1 min-w-0 py-2.5"
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-brand text-white text-[11px] tracking-[1.2px] uppercase font-light px-7 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2"
            >
              {status === "loading" && (
                <svg className="animate-spin size-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {status === "loading" ? "Sender…" : buttonLabel}
            </button>
          </form>
        </div>

        {/* Status message — always below the form row */}
        {message && (
          <p
            className={`mt-3 text-xs font-light ${
              status === "success" ? "text-brand-light" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
