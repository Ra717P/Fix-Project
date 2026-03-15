"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Coffee,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { employeeItems } from "@/data/dashboard-data";
import { cn } from "@/lib/utils/cn";
import {
  getDefaultRouteForRole,
  getLastUsedUsername,
  useAuth,
} from "@/hooks/use-auth";

function getRoleIcon(role: (typeof employeeItems)[number]["role"]) {
  if (role === "Owner" || role === "Admin") {
    return ShieldCheck;
  }

  if (role === "Cashier") {
    return Store;
  }

  return Coffee;
}

function getRoleRouteLabel(role: (typeof employeeItems)[number]["role"]) {
  return getDefaultRouteForRole(role) === "/dashboard"
    ? "Akses Dashboard"
    : "Akses POS";
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeAccounts = useMemo(() => {
    const roleOrder = ["Owner", "Admin", "Cashier", "Barista"] as const;

    return [...employeeItems]
      .filter((item) => item.status === "Aktif")
      .sort((firstItem, secondItem) => {
        const firstRoleIndex = roleOrder.indexOf(firstItem.role);
        const secondRoleIndex = roleOrder.indexOf(secondItem.role);

        if (firstRoleIndex !== secondRoleIndex) {
          return firstRoleIndex - secondRoleIndex;
        }

        return firstItem.name.localeCompare(secondItem.name);
      });
  }, []);

  const matchedAccount = useMemo(() => {
    const normalizedUsername = username.trim().toLowerCase();

    if (!normalizedUsername) {
      return null;
    }

    return (
      employeeItems.find((item) => item.username.toLowerCase() === normalizedUsername) ?? null
    );
  }, [username]);

  useEffect(() => {
    const lastUsername = getLastUsedUsername();

    if (lastUsername) {
      setUsername(lastUsername);
      return;
    }

    const ownerAccount = activeAccounts.find((item) => item.role === "Owner");

    if (ownerAccount) {
      setUsername(ownerAccount.username);
    }
  }, [activeAccounts]);

  const handleSelectAccount = (account: (typeof employeeItems)[number]) => {
    setUsername(account.username);
    setPinCode(account.pinCode);
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result = login(username, pinCode);

    if (!result.success) {
      setError(result.message ?? "Login gagal.");
      setIsSubmitting(false);
      return;
    }

    setError("");
    router.replace(result.redirectTo ?? "/pos");
  };

  const submitDisabled =
    isLoading || isSubmitting || username.trim().length === 0 || pinCode.trim().length === 0;

  return (
    <main className="min-h-screen bg-[#F7F4F1] px-4 py-6 text-stone-900 lg:px-6 lg:py-10">
      <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[0.96fr,1.04fr]">
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
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500">
            Sistem ini masih memakai dummy data lokal. Login dipakai untuk simulasi akses owner,
            admin, kasir, dan barista sebelum backend autentikasi asli ditambahkan.
          </p>

          <div className="mt-6 rounded-[28px] border border-stone-200 bg-white/85 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-stone-900">Akun Demo Cepat</p>
                <p className="mt-1 text-xs text-stone-500">
                  Klik salah satu akun agar username dan PIN terisi otomatis.
                </p>
              </div>
              <span className="rounded-full bg-[#F5EADD] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B572A]">
                {activeAccounts.length} akun aktif
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {activeAccounts.map((account) => {
                const Icon = getRoleIcon(account.role);
                const isSelected = username.trim().toLowerCase() === account.username.toLowerCase();

                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => handleSelectAccount(account)}
                    className={cn(
                      "rounded-[24px] border p-4 text-left shadow-sm transition",
                      isSelected
                        ? "border-[#8B572A] bg-[#FFF7EE]"
                        : "border-stone-200 bg-white hover:bg-stone-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-900">
                          {account.name}
                        </p>
                        <p className="mt-1 text-sm text-stone-500">{account.username}</p>
                      </div>
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
                          isSelected ? "bg-[#8B572A] text-white" : "bg-[#F6F2EE] text-[#8B572A]"
                        )}
                      >
                        <Icon size={18} />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-600">
                        {account.role}
                      </span>
                      <span className="rounded-full bg-[#F5EADD] px-3 py-1 font-medium text-[#8B572A]">
                        {getRoleRouteLabel(account.role)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-3 rounded-[28px] border border-dashed border-stone-200 bg-white/70 p-4 text-sm text-stone-600 sm:grid-cols-2">
            <div className="rounded-[22px] bg-[#FBF8F5] p-4">
              <p className="font-semibold text-stone-900">Role manajemen</p>
              <p className="mt-1 leading-6 text-stone-500">
                Owner dan Admin akan diarahkan ke dashboard untuk kelola bisnis.
              </p>
            </div>
            <div className="rounded-[22px] bg-[#FBF8F5] p-4">
              <p className="font-semibold text-stone-900">Role operasional</p>
              <p className="mt-1 leading-6 text-stone-500">
                Cashier dan Barista langsung diarahkan ke POS untuk operasional harian.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_16px_45px_rgba(28,25,23,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            Masuk Akun
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-900">
            Gunakan username dan PIN
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Login akan menyimpan akun terakhir yang dipakai agar akses berikutnya lebih cepat.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Username</span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <UserRound size={16} />
                </span>
                <input
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setError("");
                  }}
                  autoComplete="username"
                  placeholder="Contoh: owner.sisikopi"
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#8B572A] focus:bg-white placeholder:text-stone-400"
                />
              </div>
            </label>

            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">PIN</span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <LockKeyhole size={16} />
                </span>
                <input
                  value={pinCode}
                  onChange={(event) => {
                    setPinCode(event.target.value);
                    setError("");
                  }}
                  type={showPin ? "text" : "password"}
                  autoComplete="current-password"
                  inputMode="numeric"
                  placeholder="Masukkan PIN akun"
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 pl-11 pr-14 text-sm outline-none transition focus:border-[#8B572A] focus:bg-white placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPin((previousValue) => !previousValue)}
                  aria-label={showPin ? "Sembunyikan PIN" : "Tampilkan PIN"}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 transition hover:text-stone-600"
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <div className="rounded-[24px] border border-stone-200 bg-[#FCFBFA] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-stone-900">Preview Akses</p>
                  <p className="mt-1 text-sm text-stone-500">
                    {matchedAccount
                      ? "Akun terdeteksi dari username yang kamu input."
                      : "Masukkan username agar sistem menampilkan tujuan login dan role akun."}
                  </p>
                </div>
                {matchedAccount ? (
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                      matchedAccount.status === "Aktif"
                        ? "bg-[#F5EADD] text-[#8B572A]"
                        : "bg-[#FDECEC] text-[#9A2B2B]"
                    )}
                  >
                    {matchedAccount.status}
                  </span>
                ) : null}
              </div>

              {matchedAccount ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                      Pemilik Akun
                    </p>
                    <p className="mt-2 text-sm font-semibold text-stone-900">
                      {matchedAccount.name}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">{matchedAccount.role}</p>
                  </div>
                  <div className="rounded-[20px] bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                      Tujuan Login
                    </p>
                    <p className="mt-2 text-sm font-semibold text-stone-900">
                      {getDefaultRouteForRole(matchedAccount.role)}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {getRoleRouteLabel(matchedAccount.role)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-[20px] border border-dashed border-stone-200 bg-white px-4 py-5 text-sm text-stone-400">
                  Belum ada akun yang cocok dengan username tersebut.
                </div>
              )}
            </div>

            {error ? (
              <p className="rounded-2xl bg-[#FDECEC] px-4 py-3 text-sm text-[#9A2B2B]">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={submitDisabled}
              className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white transition",
                submitDisabled
                  ? "cursor-not-allowed bg-stone-300"
                  : "bg-[#8B572A] hover:opacity-90 active:scale-[0.99]"
              )}
            >
              <span>{isSubmitting ? "Memproses login..." : "Masuk"}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
