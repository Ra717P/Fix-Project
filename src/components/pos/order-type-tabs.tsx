import { orderTypes } from "@/data/pos-data";
import { cn } from "@/lib/utils/cn";
import type { OrderType } from "@/types/pos";

interface OrderTypeTabsProps {
  value: OrderType;
  onChange: (value: OrderType) => void;
  className?: string;
}

export function OrderTypeTabs({ value, onChange, className }: OrderTypeTabsProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto", className)}>
      {orderTypes.map((item) => (
        <button
          type="button"
          key={item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            "min-w-[92px] rounded-xl px-4 py-2 text-xs font-semibold",
            value === item.value ? "bg-[#8B572A] text-white" : "bg-stone-100 text-stone-500"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
