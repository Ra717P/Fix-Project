"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { sidebarItems } from "@/data/pos-data";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils/cn";
import type { SidebarSection } from "@/types/pos";

interface MobileSidebarNavProps {
  isOpen: boolean;
  activeItem: SidebarSection;
  onChange: (value: SidebarSection) => void;
  onClose: () => void;
}

export function MobileSidebarNav({
  isOpen,
  activeItem,
  onChange,
  onClose,
}: MobileSidebarNavProps) {
  const { session } = useAuth();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleSidebarItems = useMemo(() => {
    const isOwner = session?.role === "Owner";

    return sidebarItems.filter((item) => (item.id === "employees" ? isOwner : true));
  }, [session?.role]);

  useEffect(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (isOpen) {
      setShouldRender(true);

      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => cancelAnimationFrame(frame);
    }

    setIsVisible(false);
    closeTimeoutRef.current = setTimeout(() => {
      setShouldRender(false);
    }, 240);

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[65] lg:hidden",
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup menu fitur"
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-200 ease-out",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />

      <aside
        className={cn(
          "relative flex h-full w-[84vw] max-w-[320px] flex-col border-r border-stone-200 bg-white px-4 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8B572A]">
              Navigasi
            </p>
            <h2 className="mt-1 text-xl font-semibold text-stone-900">Fitur POS</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-stone-200"
            aria-label="Tutup sidebar mobile"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {visibleSidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChange(item.id);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-[#8B572A] text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
                style={{
                  transitionDelay: isVisible ? `${40 + index * 28}ms` : "0ms",
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto rounded-3xl border border-stone-200 bg-[#FBFAF8] p-4">
          <div className="flex items-center gap-3">
            <Image
              src={
                session?.image ??
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
              }
              alt={session?.name ?? "Kasir"}
              width={44}
              height={44}
              className="h-11 w-11 rounded-2xl object-cover ring-2 ring-stone-200"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-800">
                {session?.name ?? "Guest"}
              </p>
              <p className="mt-0.5 text-xs text-stone-500">
                {session ? `${session.role} • ${session.schedule}` : "Akses lokal"}
              </p>
            </div>
          </div>

          <LogoutButton compact className="mt-3 w-full" />
        </div>
      </aside>
    </div>
  );
}
