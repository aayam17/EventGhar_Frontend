import React from "react";

/**
 * Shared text input with label and inline error state.
 * Use across every form in the app instead of bare <input>.
 */
export default function Input({ label, error, className = "", id, ...props }) {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "border-2 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-all",
          "placeholder:text-stone-400",
          error
            ? "border-raspberry focus:ring-4 focus:ring-raspberry/15"
            : "border-ink focus:ring-4 focus:ring-marigold/25",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <span className="text-xs font-medium text-raspberry">{error}</span>}
    </div>
  );
}
