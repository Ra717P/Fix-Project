import Image from "next/image";
import { sidebarItems } from "@/data/pos-data";
import { cn } from "@/lib/utils/cn";

export function SidebarNav() {
  return (
    <aside className="hidden w-[68px] shrink-0 flex-col items-center justify-between border-r border-stone-200 bg-white py-4 lg:flex">
      <div className="flex w-full flex-col items-center gap-5">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              title={item.label}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border transition",
                item.active
                  ? "border-[#8B572A] bg-[#8B572A] text-white shadow-sm"
                  : "border-transparent text-stone-400 hover:bg-stone-100"
              )}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      <Image
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
        alt="User"
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-stone-200"
      />
    </aside>
  );
}
