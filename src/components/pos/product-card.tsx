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
    <article className="flex h-full flex-col rounded-[28px] border border-stone-200 bg-white p-3 shadow-[0_10px_30px_rgba(28,25,23,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(28,25,23,0.08)]">
      <div className="aspect-[4/3] overflow-hidden rounded-[22px] bg-stone-100">
        <Image
          src={item.image}
          alt={item.name}
          width={500}
          height={420}
          className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <div className="min-h-[72px]">
          <h3 className="text-base font-semibold leading-tight text-stone-900 lg:text-lg">
            {item.name}
          </h3>
          <p className="mt-2 text-lg font-semibold tracking-[-0.01em] text-[#8B572A] lg:text-[22px]">
            {formatRupiah(item.price)}
          </p>
        </div>

        <div className="mt-auto pt-3">
          <div className="grid grid-cols-2 gap-2.5">
            {variants.map((variant, index) => (
              <button
                key={`${item.id}-${variant}`}
                type="button"
                onClick={() => onAdd(item, variant)}
                className={cn(
                  "rounded-2xl border px-3 py-2.5 text-sm font-semibold transition",
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
