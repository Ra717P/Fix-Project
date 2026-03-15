import Image from "next/image";
import { Menu, Package2 } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { useAuth } from "@/hooks/use-auth";

interface BrandHeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function BrandHeader({ onOpenMobileSidebar }: BrandHeaderProps) {
  const { session } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-white px-3 py-3 lg:px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 shadow-sm transition hover:bg-stone-50 lg:hidden"
          aria-label="Buka menu fitur"
        >
          <Menu size={18} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B572A] text-white shadow-sm">
          <Package2 size={18} />
        </div>

        <div>
          <p className="text-[15px] font-semibold text-stone-800 lg:text-[22px]">Sisi Kopi</p>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        <LogoutButton compact className="hidden md:inline-flex" />

        <div className="text-right leading-tight">
          <p className="text-[10px] font-medium text-stone-700 lg:text-sm">
            {session?.name ?? "Guest"}
          </p>
          <p className="hidden text-[11px] text-stone-500 lg:block">
            {session ? `${session.role} • ${session.schedule}` : "Akses lokal"}
          </p>
        </div>

        <Image
          src={
            session?.image ??
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80"
          }
          alt={session?.name ?? "Pengguna"}
          width={40}
          height={40}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-stone-200 lg:h-10 lg:w-10"
        />
      </div>
    </header>
  );
}
