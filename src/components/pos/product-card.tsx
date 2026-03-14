import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import type { MenuItem } from "@/types/pos";

interface ProductCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem, variant: string) => void;
}

export function ProductCard({ item, onAdd }: ProductCardProps) {
  const variants = item.tags.length > 0 ? item.tags : ["Regular"];

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="aspect-[1.1/1] overflow-hidden bg-stone-100">
        <Image
          src={item.image}
          alt={item.name}
          width={500}
          height={420}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-2 p-3 lg:p-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-800 lg:text-[15px]">{item.name}</h3>
          <p className="mt-1 text-sm font-bold text-[#8B572A] lg:text-xl">{formatRupiah(item.price)}</p>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone-400">
            Choose Variant
          </p>

          <div className="grid grid-cols-2 gap-2">
            {variants.map((variant, index) => (
              <button
                key={`${item.id}-${variant}`}
                type="button"
                onClick={() => onAdd(item, variant)}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold transition",
                  variant.toLowerCase() === "hot" && "bg-[#8B572A] text-white hover:opacity-90",
                  variant.toLowerCase() === "ice" && "bg-stone-100 text-stone-600 hover:bg-stone-200",
                  variant.toLowerCase() !== "hot" &&
                    variant.toLowerCase() !== "ice" &&
                    (index === 0
                      ? "bg-[#8B572A] text-white hover:opacity-90"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200")
                )}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
