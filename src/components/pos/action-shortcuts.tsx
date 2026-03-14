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
    ? "Hold Order"
    : heldOrderCount > 0
      ? `Resume Hold${heldOrderCount > 1 ? ` (${heldOrderCount})` : ""}`
      : "Hold";
  const discountLabel = hasDiscount ? "Remove Disc." : "Discount 10%";
  const holdDisabled = !hasCart && heldOrderCount === 0;
  const discountDisabled = !hasCart;

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2 text-xs text-stone-500">
        <button
          type="button"
          onClick={onHold}
          disabled={holdDisabled}
          className="rounded-xl bg-stone-100 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {holdLabel}
        </button>
        <button
          type="button"
          onClick={onToggleDiscount}
          disabled={discountDisabled}
          className="rounded-xl bg-stone-100 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {discountLabel}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-xl bg-stone-100 px-3 py-2"
        >
          Clear
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
        className="rounded-lg px-3 py-2 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {holdLabel}
      </button>
      <button
        type="button"
        onClick={onToggleDiscount}
        disabled={discountDisabled}
        className="rounded-lg px-3 py-2 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {discountLabel}
      </button>
      <button type="button" onClick={onClear} className="rounded-lg px-3 py-2 hover:bg-white">
        Clear
      </button>
    </div>
  );
}
