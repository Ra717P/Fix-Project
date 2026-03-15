import { cn } from "@/lib/utils/cn";

interface CategoryTabsProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function formatCategoryLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function CategoryTabs({ value, options, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition",
          value === "all"
            ? "border-[#8B572A] bg-[#8B572A] text-white"
            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
        )}
      >
        Semua
      </button>

      {options.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={cn(
            "whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition",
            value === category
              ? "border-[#8B572A] bg-[#8B572A] text-white"
              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          )}
        >
          {formatCategoryLabel(category)}
        </button>
      ))}
    </div>
  );
}
