import Link from "next/link";
import { ArrowLeft, Clock3, Printer, Store } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { storeSettings } from "@/data/dashboard-data";

export default function DashboardPengaturanPage() {
  return (
    <main className="min-h-screen bg-[#F7F4F1] p-4 text-stone-900 lg:p-6">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B572A]">
              Dashboard Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-stone-900">
              Pengaturan Toko
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Pengaturan ini masih dummy, tetapi struktur tampilannya sudah siap untuk disambungkan
              ke backend dan pengaturan role admin di tahap berikutnya.
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

        <section className="grid gap-4 xl:grid-cols-[1fr,1fr]">
          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B572A] text-white">
                <Store size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Profil Toko</h2>
                <p className="text-sm text-stone-500">Identitas dasar outlet</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-[#FBFAF8] px-4 py-3">
                <p className="text-sm text-stone-500">Nama Toko</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {storeSettings.storeName}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FBFAF8] px-4 py-3">
                <p className="text-sm text-stone-500">Cabang</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {storeSettings.branchName}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FBFAF8] px-4 py-3">
                <p className="text-sm text-stone-500">Alamat</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {storeSettings.storeAddress}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B572A] text-white">
                <Clock3 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Operasional</h2>
                <p className="text-sm text-stone-500">Jam buka dan status sistem</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-[#FBFAF8] px-4 py-3">
                <p className="text-sm text-stone-500">Jam Operasional</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {storeSettings.openHours}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FBFAF8] px-4 py-3">
                <p className="text-sm text-stone-500">Mode POS</p>
                <p className="mt-1 text-sm font-semibold text-[#8B572A]">
                  {storeSettings.posMode}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FBFAF8] px-4 py-3">
                <p className="text-sm text-stone-500">Status Sinkronisasi</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {storeSettings.syncStatus}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr,1fr]">
          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
            <h2 className="text-lg font-semibold text-stone-900">Pajak dan Biaya</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-[#FBFAF8] px-4 py-3">
                <span className="text-sm text-stone-500">Pajak</span>
                <span className="text-sm font-semibold text-stone-900">
                  {storeSettings.taxRateLabel}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#FBFAF8] px-4 py-3">
                <span className="text-sm text-stone-500">Service Charge</span>
                <span className="text-sm font-semibold text-stone-900">
                  {storeSettings.serviceChargeLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B572A] text-white">
                <Printer size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Struk & Printer</h2>
                <p className="text-sm text-stone-500">Template footer dummy untuk POS</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#FBFAF8] px-4 py-4">
              <p className="text-sm text-stone-500">Footer Struk</p>
              <p className="mt-2 text-sm font-semibold text-stone-900">
                {storeSettings.receiptFooter}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
