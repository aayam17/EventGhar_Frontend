import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import Input from "./Input";

/**
 * Shared confirm/prompt modal — replaces window.confirm / window.prompt /
 * alert() so destructive or blocking actions match the rest of the app
 * instead of dropping into an unstyled native browser dialog.
 *
 * Closes on Escape or backdrop click, traps Tab focus inside itself, and
 * focuses its first interactive element on mount.
 *
 * Usage:
 *   const [dialog, setDialog] = useState(null);
 *
 *   setDialog({
 *     title: "Delete this event?",
 *     description: "This can't be undone.",
 *     tone: "danger",
 *     confirmLabel: "Delete",
 *     onConfirm: async () => { await doDelete(); },
 *   });
 *
 *   // or, to replace window.prompt():
 *   setDialog({
 *     title: `Mark "${event.title}" as refundable`,
 *     withInput: true,
 *     inputLabel: "Reason shown to ticket holders",
 *     inputDefault: "Event cancelled",
 *     confirmLabel: "Enable refunds",
 *     onConfirm: async (reason) => { await enableRefunds(reason); },
 *   });
 *
 *   {dialog && <Dialog {...dialog} onClose={() => setDialog(null)} />}
 */
export default function Dialog({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary", // "primary" | "danger"
  withInput = false,
  inputLabel,
  inputDefault = "",
  onConfirm,
  onClose,
}) {
  const [value, setValue] = useState(inputDefault);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const focusTimer = setTimeout(() => {
      panelRef.current?.querySelector("input, button")?.focus();
    }, 20);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(focusTimer);
    };
  }, [onClose]);

  const handleConfirm = async () => {
    if (withInput && !value.trim()) {
      setError("This field is required");
      return;
    }
    setError("");
    try {
      setLoading(true);
      await onConfirm(withInput ? value.trim() : undefined);
      onClose();
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="eg-dialog-title"
        className="w-full max-w-sm border-2 border-ink bg-white p-6 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="eg-dialog-title" className="font-display text-lg font-bold text-ink">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{description}</p>
        )}

        {withInput && (
          <div className="mt-4">
            <Input
              label={inputLabel}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError("");
              }}
              error={error}
            />
          </div>
        )}

        {!withInput && error && (
          <p className="mt-3 text-xs font-medium text-raspberry">{error}</p>
        )}

        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            size="sm"
            loading={loading}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
