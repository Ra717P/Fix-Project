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
    <div className="flex items-start gap-3">
      <Image
        src={item.image}
        alt={item.name}
        width={56}
        height={56}
        className="h-12 w-12 rounded-xl object-cover lg:h-14 lg:w-14"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="truncate text-sm font-semibold text-stone-800">{item.name}</p>
            <p className="text-xs text-stone-400">{item.variant}</p>
          </div>

          <p className="text-sm font-semibold text-[#8B572A]">{formatRupiah(item.price * item.qty)}</p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDecrease(item.cartKey)}
              className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 text-stone-500"
            >
              <Minus size={14} />
            </button>

            <span className="min-w-[10px] text-center text-sm text-stone-700">{item.qty}</span>

            <button
              onClick={() => onIncrease(item.cartKey)}
              className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 text-[#8B572A]"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.cartKey)}
            className="text-stone-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
