import Link from "next/link";
import { ArrowLeft, CreditCard, Receipt, TrendingUp } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  bestSellingMenus,
  salesByPaymentMethod,
  salesOverview,
} from "@/data/dashboard-data";
import { formatRupiah } from "@/lib/utils/format-rupiah";

export default function DashboardLaporanPage() {
  return (
    <main className="min-h-screen bg-[#F7F4F1] p-4 text-stone-900 lg:p-6">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B572A]">
              Dashboard Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-stone-900">
              Laporan Penjualan
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Ringkasan laporan ini masih memakai dummy data lokal agar struktur frontend siap
              sebelum integrasi backend dilakukan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              <ArrowLeft size={16} />
              Kembali ke Dashboard
            </Link>

            <LogoutButton />
          </div>
        </div>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              Omzet Kotor
            </p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              {formatRupiah(salesOverview.grossRevenue)}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              Omzet Bersih
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#1D6B3A]">
              {formatRupiah(salesOverview.netRevenue)}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              Total Transaksi
            </p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              {salesOverview.transactionCount}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              Rata-rata Order
            </p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              {formatRupiah(salesOverview.averageOrder)}
            </p>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr,1fr]">
          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B572A] text-white">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Metode Pembayaran</h2>
                <p className="text-sm text-stone-500">{salesOverview.dateLabel}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {salesByPaymentMethod.map((item) => (
                <div key={item.id} className="rounded-2xl bg-[#FBFAF8] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-stone-900">{item.label}</p>
                    <span className="text-sm font-semibold text-[#8B572A]">
                      {item.percentage}%
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-stone-900">
                    {formatRupiah(item.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B572A] text-white">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Menu Terlaris</h2>
                <p className="text-sm text-stone-500">Top seller berdasarkan dummy data</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {bestSellingMenus.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-[#FBFAF8] px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-[#8B572A]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{item.name}</p>
                      <p className="text-sm text-stone-500">{item.sold} porsi terjual</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-stone-900">
                    {formatRupiah(item.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B572A] text-white">
              <Receipt size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-900">Catatan</h2>
              <p className="text-sm text-stone-500">
                Struktur laporan ini sudah siap dikembangkan untuk filter tanggal, ekspor, dan
                integrasi histori transaksi dari backend nanti.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
