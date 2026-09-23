import React from "react";
import { CalendarSearch } from "lucide-react";

/**
 * Shared empty state — for "no events found," "no bookings," etc.
 * Always pair with a next action when one exists.
 */
export default function EmptyState({
  icon: Icon = CalendarSearch,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-ink/40 bg-white/60 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-marigold/20 text-ink">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-stone-500">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
