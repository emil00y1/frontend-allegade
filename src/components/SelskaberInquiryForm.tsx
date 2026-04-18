"use client";

import { useState } from "react";
import { FormField, Input, Textarea, Select, SubmitButton } from "@/components/ui/FormField";
import { EMAIL_RE } from "@/components/ui/form-styles";

interface SelskaberInquiryFormProps {
  occasionOptions?: string[];
  heading?: string;
  description?: string;
  phone?: string;
  email?: string;
  // Field labels
  nameLabel?: string;
  emailLabel?: string;
  occasionLabel?: string;
  guestCountLabel?: string;
  dateLabel?: string;
  messageLabel?: string;
  // Placeholders
  namePlaceholder?: string;
  emailPlaceholder?: string;
  occasionPlaceholder?: string;
  guestCountPlaceholder?: string;
  messagePlaceholder?: string;
  // Validation
  nameRequiredMessage?: string;
  emailRequiredMessage?: string;
  emailInvalidMessage?: string;
  messageRequiredMessage?: string;
  genericErrorMessage?: string;
  networkErrorMessage?: string;
  // Submit & states
  submitLabel?: string;
  submittingLabel?: string;
  successEyebrow?: string;
  successHeading?: string;
  successBody?: string;
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
  nameLabel = "Navn *",
  emailLabel = "Email *",
  occasionLabel = "Anledning",
  guestCountLabel = "Antal gæster",
  dateLabel = "Ønsket dato",
  messageLabel = "Besked *",
  namePlaceholder = "Jens Jensen",
  emailPlaceholder = "jens@eksempel.dk",
  occasionPlaceholder = "Vælg anledning",
  guestCountPlaceholder = "f.eks. 40",
  messagePlaceholder = "Fortæl os om jeres arrangement, ønsker til menu, særlige behov osv.",
  nameRequiredMessage = "Navn er påkrævet",
  emailRequiredMessage = "Email er påkrævet",
  emailInvalidMessage = "Indtast en gyldig emailadresse",
  messageRequiredMessage = "Besked er påkrævet",
  genericErrorMessage = "Noget gik galt.",
  networkErrorMessage = "Netværksfejl. Prøv venligst igen.",
  submitLabel = "Send forespørgsel",
  submittingLabel = "Sender…",
  successEyebrow = "Tak for din henvendelse",
  successHeading = "Vi har modtaget jeres forespørgsel",
  successBody = "Vi vender tilbage hurtigst muligt med et uforpligtende forslag. I kan også kontakte os direkte på",
}: SelskaberInquiryFormProps) {
  const options = occasionOptions && occasionOptions.length > 0 ? occasionOptions : DEFAULT_OCCASIONS;
  // Restrict date picker to today onward — Selskab bookings can't be backdated.
  const minDate = new Date().toISOString().slice(0, 10);

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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof typeof fields, string>>>({});

  const set = (key: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  function validate(): boolean {
    const errors: Partial<Record<keyof typeof fields, string>> = {};
    if (!fields.name.trim()) errors.name = nameRequiredMessage;
    if (!fields.email.trim()) {
      errors.email = emailRequiredMessage;
    } else if (!EMAIL_RE.test(fields.email)) {
      errors.email = emailInvalidMessage;
    }
    if (!fields.message.trim()) errors.message = messageRequiredMessage;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
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
        setErrorMessage(json.error ?? genericErrorMessage);
        setFormState("error");
      } else {
        setFormState("success");
      }
    } catch {
      setErrorMessage(networkErrorMessage);
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <section id="foresporgsel" className="bg-warm-gray py-14 md:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-10 lg:px-16">
          <div className="max-w-lg">
            <p className="text-[10px] tracking-[2px] uppercase text-brand mb-6">
              {successEyebrow}
            </p>
            <h2 className="font-newsreader font-extralight text-3xl text-[#292524] leading-tight mb-4">
              {successHeading}
            </h2>
            <p className="text-[#78716c] font-light leading-7 text-sm">
              {successBody}{" "}
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
    <section id="foresporgsel" className="bg-warm-gray py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24">
          {/* Left: heading + contact */}
          <div className="flex flex-col gap-6 lg:pt-2">
            <div>
              <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] text-[#292524] leading-tight">
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
              <FormField label={nameLabel} error={fieldErrors.name}>
                <Input
                  type="text"
                  value={fields.name}
                  onChange={set("name")}
                  placeholder={namePlaceholder}
                  invalid={!!fieldErrors.name}
                  autoComplete="name"
                />
              </FormField>
              <FormField label={emailLabel} error={fieldErrors.email}>
                <Input
                  type="email"
                  value={fields.email}
                  onChange={set("email")}
                  placeholder={emailPlaceholder}
                  invalid={!!fieldErrors.email}
                  autoComplete="email"
                />
              </FormField>
            </div>

            {/* Row 2: Anledning + Antal gæster */}
            <div className="grid sm:grid-cols-2 gap-6">
              <FormField label={occasionLabel}>
                <Select value={fields.occasion} onChange={set("occasion")}>
                  <option value="" className="bg-warm-gray">
                    {occasionPlaceholder}
                  </option>
                  {options.map((o) => (
                    <option key={o} value={o} className="bg-warm-gray">
                      {o}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label={guestCountLabel}>
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={fields.guestCount}
                  onChange={set("guestCount")}
                  placeholder={guestCountPlaceholder}
                />
              </FormField>
            </div>

            {/* Row 3: Dato */}
            <FormField label={dateLabel}>
              <Input
                type="date"
                min={minDate}
                value={fields.desiredDate}
                onChange={set("desiredDate")}
                className="cursor-pointer [color-scheme:light]"
              />
            </FormField>

            {/* Row 4: Besked */}
            <FormField label={messageLabel} error={fieldErrors.message}>
              <Textarea
                value={fields.message}
                onChange={set("message")}
                placeholder={messagePlaceholder}
                rows={5}
                invalid={!!fieldErrors.message}
              />
            </FormField>

            {/* Error */}
            {formState === "error" && (
              <p className="text-sm text-red-600 font-light">{errorMessage}</p>
            )}

            {/* Submit */}
            <SubmitButton
              loading={formState === "submitting"}
              loadingLabel={submittingLabel}
            >
              {submitLabel}
            </SubmitButton>
          </form>
        </div>
      </div>
    </section>
  );
}
