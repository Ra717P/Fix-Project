import { cn } from "@/lib/utils/cn";

interface ActionShortcutsProps {
  onClear?: () => void;
  onHold?: () => void;
  onToggleDiscount?: () => void;
  compact?: boolean;
  hasDiscount?: boolean;
  heldOrderCount?: number;
  hasCart?: boolean;
}

export function ActionShortcuts({
  onClear,
  onHold,
  onToggleDiscount,
  compact = false,
  hasDiscount = false,
  heldOrderCount = 0,
  hasCart = false,
}: ActionShortcutsProps) {
  const holdLabel = hasCart
    ? "Tahan"
    : heldOrderCount > 0
      ? `Ambil Hold${heldOrderCount > 1 ? ` (${heldOrderCount})` : ""}`
      : "Tahan";
  const discountLabel = hasDiscount ? "Lepas Diskon" : "Diskon 10%";
  const holdDisabled = !hasCart && heldOrderCount === 0;
  const discountDisabled = !hasCart;
  const clearDisabled = !hasCart;
  const holdActive = heldOrderCount > 0;

  const compactButtonClassName =
    "rounded-xl border px-3 py-2 font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
  const defaultCompactClassName =
    "border-stone-200 bg-stone-100 text-stone-600 hover:bg-stone-200";
  const fullButtonClassName =
    "rounded-lg border px-3 py-2 font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
  const defaultFullClassName =
    "border-transparent bg-transparent text-stone-600 hover:bg-white";

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2 text-xs text-stone-500">
        <button
          type="button"
          onClick={onHold}
          disabled={holdDisabled}
          aria-pressed={holdActive}
          className={cn(
            compactButtonClassName,
            holdActive
              ? "border-[#8B572A] bg-[#8B572A] text-white shadow-[0_8px_18px_rgba(139,87,42,0.22)] hover:opacity-90"
              : defaultCompactClassName
          )}
        >
          {holdLabel}
        </button>
        <button
          type="button"
          onClick={onToggleDiscount}
          disabled={discountDisabled}
          aria-pressed={hasDiscount}
          className={cn(
            compactButtonClassName,
            hasDiscount
              ? "border-[#1D6B3A] bg-[#E8F5EC] text-[#1D6B3A] shadow-[0_8px_18px_rgba(29,107,58,0.12)] hover:opacity-90"
              : defaultCompactClassName
          )}
        >
          {discountLabel}
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={clearDisabled}
          className={cn(
            compactButtonClassName,
            hasCart
              ? "border-[#F3D7D7] bg-[#FDECEC] text-[#9A2B2B] hover:opacity-90"
              : defaultCompactClassName
          )}
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 rounded-xl bg-stone-100 p-2 text-xs text-stone-500">
      <button
        type="button"
        onClick={onHold}
        disabled={holdDisabled}
        aria-pressed={holdActive}
        className={cn(
          fullButtonClassName,
          holdActive
            ? "border-[#8B572A] bg-white text-[#8B572A] shadow-sm"
            : defaultFullClassName
        )}
      >
        {holdLabel}
      </button>
      <button
        type="button"
        onClick={onToggleDiscount}
        disabled={discountDisabled}
        aria-pressed={hasDiscount}
        className={cn(
          fullButtonClassName,
          hasDiscount
            ? "border-[#1D6B3A] bg-white text-[#1D6B3A] shadow-sm"
            : defaultFullClassName
        )}
      >
        {discountLabel}
      </button>
      <button
        type="button"
        onClick={onClear}
        disabled={clearDisabled}
        className={cn(
          fullButtonClassName,
          hasCart
            ? "border-[#F3D7D7] bg-white text-[#9A2B2B] shadow-sm hover:bg-[#FFF7F7]"
            : defaultFullClassName
        )}
      >
        Reset
      </button>
    </div>
  );
}
