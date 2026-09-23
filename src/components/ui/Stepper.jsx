import React from "react";
import { Check } from "lucide-react";

/**
 * Horizontal progress stepper for multi-step flows (checkout, host-event, etc).
 * steps: string[] — labels in order.
 * current: 1-indexed current step.
 */
export default function Stepper({ steps, current }) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = current > stepNum;
        const active = current === stepNum;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  done
                    ? "bg-pine text-paper"
                    : active
                    ? "bg-raspberry text-paper"
                    : "bg-stone-200 text-stone-500",
                ].join(" ")}
              >
                {done ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={[
                  "hidden text-xs font-medium sm:block",
                  active ? "text-ink" : "text-stone-500",
                ].join(" ")}
              >
                {label}
              </span>
            </div>

            {stepNum !== steps.length && (
              <div
                className={[
                  "mx-2 h-0.5 flex-1 rounded-full transition-colors sm:mx-3",
                  done ? "bg-pine" : "bg-stone-200",
                ].join(" ")}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
