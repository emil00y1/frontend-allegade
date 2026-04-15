import { cn } from "@/lib/utils";

// Shared form styling tokens so ContactSection, SelskaberInquiryForm,
// NewsletterSection etc. stay in sync.

export const labelClass =
  "block text-[10px] tracking-[1.5px] uppercase text-[#78716c] mb-2";

export const errorClass = "text-[11px] text-red-500 font-light mt-1.5";

const inputBase =
  "w-full bg-transparent border px-4 py-3 text-sm text-[#292524] placeholder-[#292524]/30 focus:outline-none transition-colors";

export function inputClass(opts?: { invalid?: boolean; dark?: boolean; extra?: string }) {
  const dark = opts?.dark
    ? "bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:border-brand"
    : opts?.invalid
      ? "border-red-400 focus:border-red-500"
      : "border-[#e0dbd8] focus:border-[#8b6f47]";
  return cn(inputBase, dark, opts?.extra);
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
