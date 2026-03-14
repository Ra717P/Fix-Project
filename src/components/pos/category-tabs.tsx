import { categories } from "@/data/pos-data";
import { cn } from "@/lib/utils/cn";

interface CategoryTabsProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={cn(
            "whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition",
            value === category.id
              ? "border-[#8B572A] bg-[#8B572A] text-white"
              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
