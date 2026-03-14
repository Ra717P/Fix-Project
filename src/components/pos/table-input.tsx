import { cn } from "@/lib/utils/cn";

interface TableInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
  placeholder?: string;
}

export function TableInput({
  value,
  onChange,
  className,
  label = "Table",
  placeholder = "Input table number",
}: TableInputProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs text-stone-500">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none placeholder:text-stone-400"
      />
    </div>
  );
}
