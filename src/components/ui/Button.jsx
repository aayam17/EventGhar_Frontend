import React from "react";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-raspberry text-paper border-2 border-ink shadow-[3px_3px_0_var(--color-ink)] hover:shadow-[4px_4px_0_var(--color-ink)]",
  marigold:
    "bg-marigold text-ink border-2 border-ink shadow-[3px_3px_0_var(--color-ink)] hover:shadow-[4px_4px_0_var(--color-ink)]",
  secondary:
    "bg-ink text-paper border-2 border-ink shadow-[3px_3px_0_var(--color-raspberry)] hover:shadow-[4px_4px_0_var(--color-raspberry)]",
  ghost:
    "bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-paper",
  danger:
    "bg-transparent text-raspberry border-2 border-raspberry hover:bg-raspberry hover:text-paper",
};

const sizes = {
  sm: "text-sm px-4 py-2",
  md: "text-[15px] px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

/**
 * Shared Button — the only button component the app should use.
 * variant: primary | marigold | secondary | ghost | danger
 * size: sm | md | lg
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wide",
        "transition-all duration-150 ease-out",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      {children}
    </button>
  );
}
