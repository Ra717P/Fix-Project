import Link from "next/link";
import { Coffee, FileBarChart2, Settings, ShoppingBag, Users } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { employeeItems, salesOverview, storeSettings } from "@/data/dashboard-data";
import { menuItems } from "@/data/pos-data";
import { formatRupiah } from "@/lib/utils/format-rupiah";

const adminLinks = [
  {
    href: "/dashboard/menu",
    label: "Kelola Menu",
    description: "Tambah, edit, filter, dan atur status menu.",
    icon: Coffee,
  },
  {
    href: "/dashboard/karyawan",
    label: "Karyawan",
    description: "Lihat data kasir, barista, dan pembagian shift.",
    icon: Users,
  },
  {
    href: "/dashboard/laporan",
    label: "Laporan",
    description: "Pantau penjualan harian dan performa metode pembayaran.",
    icon: FileBarChart2,
  },
  {
    href: "/dashboard/pengaturan",
    label: "Pengaturan",
    description: "Atur profil toko, pajak, dan pengaturan POS.",
    icon: Settings,
  },
] as const;

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F7F4F1] p-4 text-stone-900 lg:p-6">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <div className="flex justify-end">
          <LogoutButton />
        </div>

        <section className="rounded-[32px] border border-stone-200 bg-[linear-gradient(135deg,#FFF8F1_0%,#FFFFFF_60%)] p-6 shadow-[0_16px_45px_rgba(28,25,23,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B572A]">
                Dashboard Admin
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-stone-900">
                Ringkasan Operasional Sisi Kopi
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-stone-500">
                Dashboard ini masih memakai dummy data lokal, jadi aman dipakai untuk menyusun
                struktur admin sebelum project dihubungkan ke backend asli.
              </p>
            </div>

            <Link
              href="/pos"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#8B572A] px-5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <ShoppingBag size={16} />
              Buka POS Kasir
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white/90 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                Total Menu
              </p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">{menuItems.length}</p>
            </div>

            <div className="rounded-2xl bg-white/90 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                Total Karyawan
              </p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">{employeeItems.length}</p>
            </div>

            <div className="rounded-2xl bg-white/90 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                Transaksi Hari Ini
              </p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">
                {salesOverview.transactionCount}
              </p>
            </div>

            <div className="rounded-2xl bg-white/90 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                Mode Sistem
              </p>
              <p className="mt-2 text-lg font-semibold text-[#8B572A]">{storeSettings.posMode}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {adminLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(28,25,23,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B572A] text-white">
                  <Icon size={20} />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-stone-900">{item.label}</h2>
                <p className="mt-2 text-sm text-stone-500">{item.description}</p>
              </Link>
            );
          })}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Omzet Hari Ini
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-900">
              {formatRupiah(salesOverview.grossRevenue)}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#FBFAF8] p-4">
                <p className="text-sm text-stone-500">Pendapatan Bersih</p>
                <p className="mt-1 text-lg font-semibold text-stone-900">
                  {formatRupiah(salesOverview.netRevenue)}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FBFAF8] p-4">
                <p className="text-sm text-stone-500">Rata-rata Order</p>
                <p className="mt-1 text-lg font-semibold text-stone-900">
                  {formatRupiah(salesOverview.averageOrder)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Informasi Toko
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-900">
              {storeSettings.storeName}
            </h2>
            <p className="mt-2 text-sm text-stone-500">{storeSettings.storeAddress}</p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-[#FBFAF8] px-4 py-3">
                <span className="text-sm text-stone-500">Cabang</span>
                <span className="text-sm font-semibold text-stone-900">
                  {storeSettings.branchName}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#FBFAF8] px-4 py-3">
                <span className="text-sm text-stone-500">Jam Operasional</span>
                <span className="text-sm font-semibold text-stone-900">
                  {storeSettings.openHours}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#FBFAF8] px-4 py-3">
                <span className="text-sm text-stone-500">Status Sinkronisasi</span>
                <span className="text-sm font-semibold text-[#8B572A]">
                  {storeSettings.syncStatus}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
