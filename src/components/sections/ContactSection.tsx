"use client";

import { useState } from "react";
import { FormField, Input, Textarea, SubmitButton } from "@/components/ui/FormField";
import { EMAIL_RE } from "@/components/ui/form-styles";

interface ContactSectionProps {
  eyebrow?: string;
  heading?: string;
  phone?: string;
  email?: string;
  address?: string;
  notificationEmail?: string;
  // Field labels
  nameLabel?: string;
  emailLabel?: string;
  messageLabel?: string;
  // Placeholders
  namePlaceholder?: string;
  emailPlaceholder?: string;
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
  successBodyPrefix?: string;
  successBodySuffix?: string;
}

type FormState = "idle" | "submitting" | "success" | "error";
type FieldKey = "name" | "email" | "message";

export default function ContactSection({
  eyebrow = "Kom i kontakt",
  heading = "Kontakt Os",
  phone = "+45 33 31 17 51",
  email = "info@allegade10.dk",
  address,
  nameLabel = "Navn *",
  emailLabel = "Email *",
  messageLabel = "Besked *",
  namePlaceholder = "Jens Jensen",
  emailPlaceholder = "jens@eksempel.dk",
  messagePlaceholder = "Skriv din besked her…",
  nameRequiredMessage = "Navn er påkrævet",
  emailRequiredMessage = "Email er påkrævet",
  emailInvalidMessage = "Indtast en gyldig emailadresse",
  messageRequiredMessage = "Besked er påkrævet",
  genericErrorMessage = "Noget gik galt.",
  networkErrorMessage = "Netværksfejl. Prøv venligst igen.",
  submitLabel = "Send besked",
  submittingLabel = "Sender…",
  successEyebrow = "Tak for din besked",
  successHeading = "Vi vender tilbage hurtigst muligt",
  successBodyPrefix = "Du er også velkommen til at ringe til os på ",
  successBodySuffix = ".",
}: ContactSectionProps) {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const set =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      if (fieldErrors[key]) {
        setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    };

  function validate(): boolean {
    const errors: Partial<Record<FieldKey, string>> = {};
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
      const res = await fetch("/api/contact", {
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
                {successEyebrow}
              </span>
              <h3 className="font-newsreader font-extralight text-2xl text-[#292524] leading-tight">
                {successHeading}
              </h3>
              <p className="text-sm font-light text-[#78716c] leading-7">
                {successBodyPrefix}
                <a href={`tel:${phone?.replace(/\s/g, "")}`} className="text-[#292524] hover:text-[#8b6f47] transition-colors">
                  {phone}
                </a>
                {successBodySuffix}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

              <FormField label={messageLabel} error={fieldErrors.message}>
                <Textarea
                  value={fields.message}
                  onChange={set("message")}
                  placeholder={messagePlaceholder}
                  rows={5}
                  invalid={!!fieldErrors.message}
                />
              </FormField>

              {formState === "error" && (
                <p className="text-sm text-red-600 font-light">{errorMessage}</p>
              )}

              <SubmitButton
                loading={formState === "submitting"}
                loadingLabel={submittingLabel}
              >
                {submitLabel}
              </SubmitButton>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
