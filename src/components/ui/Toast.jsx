import React, { useCallback, useRef, useState } from "react";
import { CheckCircle2, Info, AlertTriangle, XCircle } from "lucide-react";

const styles = {
  success: { icon: CheckCircle2, cls: "bg-pine text-paper" },
  info: { icon: Info, cls: "bg-ink text-paper" },
  warning: { icon: AlertTriangle, cls: "bg-marigold text-ink" },
  error: { icon: XCircle, cls: "bg-raspberry text-paper" },
};

/**
 * Single toast, positioned fixed at the bottom of the viewport.
 * Render conditionally from the page that owns the `snack` state.
 */
export default function Toast({ message, type = "info" }) {
  if (!message) return null;
  const { icon: Icon, cls } = styles[type] || styles.info;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4">
      <div
        role="status"
        className={[
          "pointer-events-auto flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium shadow-pop",
          "animate-[toast-in_0.25s_ease-out]",
          cls,
        ].join(" ")}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {message}
      </div>
    </div>
  );
}

/**
 * Shared toast state + standardized auto-dismiss timing, so every page
 * doesn't hand-roll its own setTimeout with a slightly different delay.
 * Errors stay onscreen a bit longer than success/info/warning.
 *
 *   const [snack, showSnack] = useSnack();
 *   showSnack("Refund request submitted", "success");
 *   {snack && <Toast message={snack.message} type={snack.type} />}
 */
const DEFAULT_DURATION = 3000;
const ERROR_DURATION = 4000;

export function useSnack() {
  const [snack, setSnack] = useState(null);
  const timerRef = useRef(null);

  const showSnack = useCallback((message, type = "info", duration) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSnack({ message, type });
    timerRef.current = setTimeout(
      () => setSnack(null),
      duration ?? (type === "error" ? ERROR_DURATION : DEFAULT_DURATION)
    );
  }, []);

  return [snack, showSnack];
}
