import { formatRupiah } from "@/lib/utils/format-rupiah";

interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  tax: number;
  total: number;
}

export function CartSummary({ subtotal, discount = 0, tax, total }: CartSummaryProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between text-stone-500">
        <span>Subtotal</span>
        <span>{formatRupiah(subtotal)}</span>
      </div>

      {discount > 0 ? (
        <div className="flex items-center justify-between text-stone-500">
          <span>Discount</span>
          <span>-{formatRupiah(discount)}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-between text-stone-500">
        <span>Tax (10%)</span>
        <span>{formatRupiah(tax)}</span>
      </div>

      <div className="flex items-center justify-between border-t border-stone-200 pt-2 text-base font-semibold text-stone-800">
        <span>Total</span>
        <span className="text-[#8B572A]">{formatRupiah(total)}</span>
      </div>
    </div>
  );
}
