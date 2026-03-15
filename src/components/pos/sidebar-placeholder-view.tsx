"use client";

import { ArrowLeft, Sparkles } from "lucide-react";

interface SidebarPlaceholderViewProps {
  title: string;
  description: string;
  onBackToOrders: () => void;
}

export function SidebarPlaceholderView({
  title,
  description,
  onBackToOrders,
}: SidebarPlaceholderViewProps) {
  return (
    <main className="flex min-w-0 flex-1 flex-col p-4">
      <section className="flex min-h-[calc(100vh-150px)] flex-col items-center justify-center rounded-[32px] border border-stone-200 bg-[linear-gradient(135deg,#FFF8F1_0%,#FFFFFF_62%)] px-6 text-center shadow-[0_16px_45px_rgba(28,25,23,0.06)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#8B572A] text-white shadow-lg">
          <Sparkles size={26} />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#8B572A]">
          Segera Hadir
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-stone-900">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-stone-500">{description}</p>

        <button
          type="button"
          onClick={onBackToOrders}
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          <ArrowLeft size={16} />
          Kembali ke Orders
        </button>
      </section>
    </main>
  );
}
