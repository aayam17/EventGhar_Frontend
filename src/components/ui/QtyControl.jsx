import { Minus, Plus } from "lucide-react";

export default function QtyControl({ value, onDec, onInc, min = 0 }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onDec}
        disabled={value <= min}
        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink text-ink transition hover:bg-ink hover:text-paper disabled:opacity-40"
        aria-label="Decrease"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-5 text-center font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={onInc}
        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-marigold text-ink transition hover:bg-marigold-dark"
        aria-label="Increase"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
