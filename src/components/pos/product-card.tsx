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
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[26px] border border-stone-200 bg-white shadow-[0_10px_28px_rgba(28,25,23,0.05)] transition",
        item.isAvailable
          ? "hover:shadow-[0_16px_34px_rgba(28,25,23,0.08)]"
          : "bg-stone-50 shadow-[0_8px_18px_rgba(28,25,23,0.04)]"
      )}
    >
      <div className="relative aspect-[1.08/1] overflow-hidden bg-stone-100">
        {!item.isAvailable ? (
          <span className="absolute left-3 top-3 z-[1] rounded-full bg-[#9A2B2B] px-3 py-1 text-[11px] font-semibold text-white">
            Habis
          </span>
        ) : null}

        <Image
          src={item.image}
          alt={item.name}
          width={500}
          height={420}
          sizes="(max-width: 768px) 50vw, (max-width: 1400px) 33vw, 25vw"
          className={cn(
            "h-full w-full object-cover transition duration-500",
            item.isAvailable ? "hover:scale-[1.02]" : "grayscale-[0.2] opacity-70"
          )}
        />
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="min-h-[58px]">
          <h3 className="text-[15px] font-semibold leading-snug text-stone-900 lg:text-base">
            {item.name}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[#8B572A] lg:text-[15px]">
            {formatRupiah(item.price)}
          </p>
          {!item.isAvailable ? (
            <p className="mt-1 text-xs font-medium text-[#9A2B2B]">Menu sedang habis</p>
          ) : null}
        </div>

        <div className="mt-auto border-t border-stone-100 pt-3">
          <div className="grid grid-cols-2 gap-2">
            {variants.map((variant, index) => (
              <button
                key={`${item.id}-${variant}`}
                type="button"
                onClick={() => onAdd(item, variant)}
                disabled={!item.isAvailable}
                className={cn(
                  "h-10 rounded-xl border px-3 text-sm font-semibold transition",
                  !item.isAvailable &&
                    "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 hover:bg-stone-100",
                  item.isAvailable &&
                  variant.toLowerCase() === "hot" &&
                    "border-[#8B572A] bg-[#8B572A] text-white hover:opacity-90",
                  item.isAvailable &&
                  variant.toLowerCase() === "ice" &&
                    "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100",
                  item.isAvailable &&
                  variant.toLowerCase() !== "hot" &&
                    variant.toLowerCase() !== "ice" &&
                    (index === 0
                      ? "border-[#8B572A] bg-[#8B572A] text-white hover:opacity-90"
                      : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100")
                )}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
