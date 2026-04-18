import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center w-fit text-[11px] tracking-[2px] uppercase font-light transition-all",
  {
    variants: {
      variant: {
        primary: "text-white bg-brand hover:opacity-90",
        secondary: "text-dark-stone border border-border-warm hover:border-dark-stone/50 transition-colors",
        ghost: "text-dark-stone border border-border-warm hover:border-brand hover:text-brand transition-colors",
        dark: "text-white bg-dark-stone hover:opacity-80",
      },
      size: {
        default: "px-8 py-4",
        sm: "px-8 py-3.5",
        lg: "px-10 py-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);
