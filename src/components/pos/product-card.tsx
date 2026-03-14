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
    <article className="flex h-full flex-col overflow-hidden rounded-[26px] border border-stone-200 bg-white shadow-[0_10px_28px_rgba(28,25,23,0.05)] transition hover:shadow-[0_16px_34px_rgba(28,25,23,0.08)]">
      <div className="aspect-[1.08/1] overflow-hidden bg-stone-100">
        <Image
          src={item.image}
          alt={item.name}
          width={500}
          height={420}
          className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
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
        </div>

        <div className="mt-auto border-t border-stone-100 pt-3">
          <div className="grid grid-cols-2 gap-2">
            {variants.map((variant, index) => (
              <button
                key={`${item.id}-${variant}`}
                type="button"
                onClick={() => onAdd(item, variant)}
                className={cn(
                  "h-10 rounded-xl border px-3 text-sm font-semibold transition",
                  variant.toLowerCase() === "hot" &&
                    "border-[#8B572A] bg-[#8B572A] text-white hover:opacity-90",
                  variant.toLowerCase() === "ice" &&
                    "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100",
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
