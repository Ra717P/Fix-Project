"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { MenuManagementView } from "@/components/pos/menu-management-view";
import { usePos } from "@/hooks/use-pos";

export default function DashboardMenuPage() {
  const {
    menuCatalog,
    menuManagementCategories,
    createMenuItem,
    createMenuCategory,
    updateMenuItem,
    toggleMenuAvailability,
  } = usePos();

  return (
    <div className="min-h-screen bg-[#F7F4F1] text-stone-900">
      <div className="mx-auto max-w-[1440px] p-4 lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            <ArrowLeft size={16} />
            Kembali ke Dashboard
          </Link>

          <LogoutButton />
        </div>

        <div className="overflow-hidden rounded-[32px] border border-stone-200 bg-white shadow-[0_16px_45px_rgba(28,25,23,0.06)]">
          <MenuManagementView
            items={menuCatalog}
            categoryOptions={menuManagementCategories}
            onCreateMenu={createMenuItem}
            onCreateCategory={createMenuCategory}
            onUpdateMenu={updateMenuItem}
            onToggleAvailability={toggleMenuAvailability}
          />
        </div>
      </div>
    </div>
  );
}
