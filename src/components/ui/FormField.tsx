import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { labelClass, errorClass, inputClass } from "./form-styles";

type FieldProps = {
  label?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

export function FormField({ label, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      {label && <label className={labelClass}>{label}</label>}
      {children}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  dark?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, dark, className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(inputClass({ invalid, dark }), className)}
      {...props}
    />
  );
});

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
  dark?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ invalid, dark, className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(inputClass({ invalid, dark }), "resize-none", className)}
        {...props}
      />
    );
  },
);

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  dark?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, dark, className, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        inputClass({ invalid, dark }),
        "appearance-none cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
};

export function SubmitButton({
  loading,
  loadingLabel,
  children,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading || props.disabled}
      className={cn(
        "w-full py-4 text-[12px] tracking-[2px] uppercase font-light text-white bg-brand hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2",
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
