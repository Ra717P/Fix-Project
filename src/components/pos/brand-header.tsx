import Image from "next/image";
import { Package2 } from "lucide-react";

export function BrandHeader() {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-white px-3 py-3 lg:px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B572A] text-white shadow-sm">
          <Package2 size={18} />
        </div>

        <div>
          <p className="text-[15px] font-semibold text-stone-800 lg:text-[22px]">Sisi Kopi</p>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        <div className="text-right leading-tight">
          <p className="text-[10px] font-medium text-stone-700 lg:text-sm">Kasir A</p>
          <p className="hidden text-[11px] text-stone-500 lg:block">Shift 1 • 08:00-16:00</p>
        </div>

        <Image
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80"
          alt="Kasir"
          width={40}
          height={40}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-stone-200 lg:h-10 lg:w-10"
        />
      </div>
    </header>
  );
}
