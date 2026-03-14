import { MoreHorizontal, ScanLine, Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  showScanButton?: boolean;
}

export function SearchBar({ value, onChange, showScanButton = false }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <div className="flex h-11 flex-1 items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 text-stone-400 shadow-sm lg:max-w-[560px]">
        <Search size={18} className="text-stone-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search menu or scan barcode..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
        />
      </div>

      {showScanButton && (
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-500 shadow-sm lg:hidden">
          <ScanLine size={18} />
        </button>
      )}

      <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-500 shadow-sm">
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
}
