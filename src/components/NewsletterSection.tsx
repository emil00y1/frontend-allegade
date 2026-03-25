"use client";

import { useState } from "react";

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
            <input
              type="text"
              placeholder={firstNameLabel}
              required
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className="bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm font-light px-4 py-2.5 flex-1 min-w-0 focus:outline-none focus:border-brand transition-colors"
            />
            <input
              type="text"
              placeholder={lastNameLabel}
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className="bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm font-light px-4 py-2.5 flex-1 min-w-0 focus:outline-none focus:border-brand transition-colors"
            />
            <input
              type="email"
              placeholder={emailLabel}
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm font-light px-4 py-2.5 flex-1 min-w-0 focus:outline-none focus:border-brand transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-brand text-white text-[11px] tracking-[1.2px] uppercase font-light px-7 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {status === "loading" ? "..." : buttonLabel}
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
