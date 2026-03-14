import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import type { CartItem } from "@/types/pos";

interface CartItemRowProps {
  item: CartItem;
  onIncrease: (cartKey: string) => void;
  onDecrease: (cartKey: string) => void;
  onRemove: (cartKey: string) => void;
}

export function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-2.5">
      <Image
        src={item.image}
        alt={item.name}
        width={56}
        height={56}
        className="h-11 w-11 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-stone-800">{item.name}</p>
            <p className="mt-0.5 text-[11px] text-stone-400">{item.variant}</p>
          </div>

          <p className="text-sm font-semibold text-[#8B572A]">{formatRupiah(item.price * item.qty)}</p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-1.5 py-1">
            <button
              type="button"
              onClick={() => onDecrease(item.cartKey)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-stone-500 transition hover:bg-stone-200"
            >
              <Minus size={14} />
            </button>

            <span className="min-w-[16px] text-center text-xs font-semibold text-stone-700">
              {item.qty}
            </span>

            <button
              type="button"
              onClick={() => onIncrease(item.cartKey)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#8B572A] transition hover:bg-stone-200"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.cartKey)}
            className="rounded-full p-1 text-stone-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
