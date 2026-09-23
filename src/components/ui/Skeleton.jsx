import React from "react";

/** Generic shimmer block — build skeleton layouts by composing these. */
export default function Skeleton({ className = "" }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} />;
}

/** Skeleton matching the EventCard layout, for grid loading states. */
export function EventCardSkeleton() {
  return (
    <div className="overflow-hidden border-2 border-ink bg-white shadow-card">
      <Skeleton className="h-36 w-full rounded-none md:h-40" />
      <div className="space-y-3 border-t-2 border-ink p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}
