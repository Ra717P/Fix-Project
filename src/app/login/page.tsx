"use client";

import { useState } from "react";
import { ArrowRight, Coffee, ShieldCheck, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { employeeItems } from "@/data/dashboard-data";
import { getDefaultRouteForRole, useAuth } from "@/hooks/use-auth";

const ownerAccount = employeeItems.find((item) => item.role === "Owner");
const cashierAccount = employeeItems.find((item) => item.role === "Cashier");

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState(ownerAccount?.username ?? "");
  const [pinCode, setPinCode] = useState(ownerAccount?.pinCode ?? "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const result = login(username, pinCode);

    if (!result.success) {
      setError(result.message ?? "Login gagal.");
      return;
    }

    const account = employeeItems.find(
      (item) => item.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!account) {
      setError("Akun tidak ditemukan.");
      return;
    }

    router.replace(getDefaultRouteForRole(account.role));
  };

  return (
    <main className="min-h-screen bg-[#F7F4F1] px-4 py-6 text-stone-900 lg:px-6 lg:py-10">
      <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <section className="rounded-[32px] border border-stone-200 bg-[linear-gradient(135deg,#FFF8F1_0%,#FFFFFF_58%)] p-6 shadow-[0_16px_45px_rgba(28,25,23,0.06)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8B572A] text-white shadow-sm">
            <Coffee size={24} />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#8B572A]">
            Akses Dummy
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-stone-900">
            Login Sisi Kopi POS
          </h1>
          <p className="mt-3 max-w-xl text-sm text-stone-500">
            Sistem ini masih memakai dummy data lokal. Login ini dipakai untuk simulasi akses
            pemilik usaha, admin, dan kasir sebelum autentikasi asli dibuat.
          </p>

          <div className="mt-6 space-y-3">
            {ownerAccount ? (
              <button
                type="button"
                onClick={() => {
                  setUsername(ownerAccount.username);
                  setPinCode(ownerAccount.pinCode);
                  setError("");
                }}
                className="w-full rounded-[24px] border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:bg-stone-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Akun Owner</p>
                    <p className="mt-1 text-sm text-stone-500">
                      {ownerAccount.username} • akses dashboard manajemen
                    </p>
                  </div>
                  <ShieldCheck size={18} className="text-[#8B572A]" />
                </div>
              </button>
            ) : null}

            {cashierAccount ? (
              <button
                type="button"
                onClick={() => {
                  setUsername(cashierAccount.username);
                  setPinCode(cashierAccount.pinCode);
                  setError("");
                }}
                className="w-full rounded-[24px] border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:bg-stone-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Akun Kasir</p>
                    <p className="mt-1 text-sm text-stone-500">
                      {cashierAccount.username} • langsung masuk ke POS
                    </p>
                  </div>
                  <Store size={18} className="text-[#8B572A]" />
                </div>
              </button>
            ) : null}
          </div>
        </section>

        <section className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_16px_45px_rgba(28,25,23,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            Masuk Akun
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-900">Gunakan username dan PIN</h2>

          <div className="mt-6 space-y-4">
            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Username</span>
              <input
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError("");
                }}
                placeholder="Contoh: owner.sisikopi"
                className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
              />
            </label>

            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">PIN</span>
              <input
                value={pinCode}
                onChange={(event) => {
                  setPinCode(event.target.value);
                  setError("");
                }}
                inputMode="numeric"
                placeholder="Masukkan PIN akun"
                className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
              />
            </label>

            {error ? (
              <p className="rounded-2xl bg-[#FDECEC] px-4 py-3 text-sm text-[#9A2B2B]">{error}</p>
            ) : null}

            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#8B572A] px-5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Masuk
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
