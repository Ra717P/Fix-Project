"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/hooks/use-auth";

interface LogoutButtonProps {
  className?: string;
  compact?: boolean;
}

export function LogoutButton({ className, compact = false }: LogoutButtonProps) {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={() => {
        logout();
        router.replace("/login");
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white text-sm font-semibold text-stone-700 transition hover:bg-stone-50",
        compact ? "h-10 px-3" : "h-11 px-4",
        className
      )}
    >
      <LogOut size={16} />
      <span>{compact ? "Logout" : "Keluar"}</span>
    </button>
  );
}
