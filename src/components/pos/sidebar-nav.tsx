import Image from "next/image";
import { useMemo } from "react";
import { sidebarItems } from "@/data/pos-data";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils/cn";
import type { SidebarSection } from "@/types/pos";

interface SidebarNavProps {
  activeItem: SidebarSection;
  onChange: (value: SidebarSection) => void;
}

export function SidebarNav({ activeItem, onChange }: SidebarNavProps) {
  const { session } = useAuth();
  const visibleSidebarItems = useMemo(() => {
    const isOwner = session?.role === "Owner";

    return sidebarItems.filter((item) => (item.id === "employees" ? isOwner : true));
  }, [session?.role]);

  return (
    <aside className="hidden w-[68px] shrink-0 flex-col items-center justify-between border-r border-stone-200 bg-white py-4 lg:flex">
      <div className="flex w-full flex-col items-center gap-5">
        {visibleSidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              title={item.label}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border transition",
                activeItem === item.id
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
        src={
          session?.image ??
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
        }
        alt={session?.name ?? "User"}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-stone-200"
      />
    </aside>
  );
}
