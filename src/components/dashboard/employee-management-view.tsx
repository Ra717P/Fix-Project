"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { KeyRound, PencilLine, Search, ShieldCheck, UserPlus, Users } from "lucide-react";
import { EmployeeEditorSheet } from "@/components/dashboard/employee-editor-sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils/cn";
import type { EmployeeFormValues, EmployeeItem } from "@/types/pos";

function isLockedEmployee(employee: EmployeeItem) {
  return employee.role === "Owner";
}

export function EmployeeManagementView() {
  const { employees, resetEmployeePin, saveEmployee, toggleEmployeeStatus } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeItem | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "info" | "error";
    title: string;
    message: string;
  } | null>(null);

  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchSearch =
        keyword.length === 0 ||
        employee.name.toLowerCase().includes(keyword) ||
        employee.username.toLowerCase().includes(keyword) ||
        employee.phone.toLowerCase().includes(keyword);
      const matchRole = selectedRole === "all" || employee.role === selectedRole;
      const matchStatus = selectedStatus === "all" || employee.status === selectedStatus;

      return matchSearch && matchRole && matchStatus;
    });
  }, [employees, search, selectedRole, selectedStatus]);

  const itemStats = useMemo(() => {
    const activeCount = employees.filter((item) => item.status === "Aktif").length;
    const nonActiveCount = employees.filter((item) => item.status === "Nonaktif").length;
    const managementCount = employees.filter(
      (item) => item.role === "Owner" || item.role === "Admin"
    ).length;

    return {
      total: employees.length,
      activeCount,
      nonActiveCount,
      managementCount,
    };
  }, [employees]);

  const handleCreate = () => {
    setEditingEmployee(null);
    setEditorOpen(true);
  };

  const handleEdit = (employee: EmployeeItem) => {
    if (isLockedEmployee(employee)) {
      setFeedback({
        tone: "info",
        title: "Akun owner dikunci",
        message: "Akun owner utama tidak bisa diedit, direset PIN-nya, atau dinonaktifkan.",
      });
      return;
    }

    setEditingEmployee(employee);
    setEditorOpen(true);
  };

  const handleSave = (values: EmployeeFormValues) => {
    const result = saveEmployee(editingEmployee?.id ?? null, values);

    if (!result.success) {
      setFeedback({
        tone: result.message?.includes("owner") ? "info" : "error",
        title:
          result.message?.includes("owner")
            ? "Akun owner dikunci"
            : result.message === "Akun karyawan tidak ditemukan."
            ? "Akun tidak ditemukan"
            : "Username sudah dipakai",
        message: result.message ?? "Gunakan username lain agar akun karyawan tidak bentrok.",
      });
      return;
    }

    if (editingEmployee) {
      setFeedback({
        tone: "success",
        title: "Akun diperbarui",
        message: `${values.name} berhasil diperbarui.`,
      });
      return;
    }

    setFeedback({
      tone: "success",
      title: "Akun ditambahkan",
      message: `${values.name} berhasil masuk ke daftar karyawan.`,
    });
  };

  const handleToggleStatus = (employeeId: string) => {
    const result = toggleEmployeeStatus(employeeId);

    if (!result.success || !result.employee) {
      if (result.message) {
        setFeedback({
          tone: "info",
          title: "Perubahan diblokir",
          message: result.message,
        });
      }

      return;
    }

    const updatedEmployee = result.employee;

    setFeedback({
      tone: updatedEmployee.status === "Aktif" ? "success" : "info",
      title: updatedEmployee.status === "Aktif" ? "Akun diaktifkan" : "Akun dinonaktifkan",
      message:
        updatedEmployee.status === "Aktif"
          ? `${updatedEmployee.name} kembali bisa memakai akun POS.`
          : `${updatedEmployee.name} tidak bisa login sampai diaktifkan lagi.`,
    });
  };

  const handleResetPin = (employeeId: string) => {
    const result = resetEmployeePin(employeeId);

    if (!result.success || !result.employee) {
      if (result.message) {
        setFeedback({
          tone: "info",
          title: "Perubahan diblokir",
          message: result.message,
        });
      }

      return;
    }

    const updatedEmployee = result.employee;

    setFeedback({
      tone: "info",
      title: "PIN direset",
      message: `PIN dummy ${updatedEmployee.name} sudah direset ke 123456.`,
    });
  };

  return (
    <>
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden p-4">
        <div className="flex min-h-0 flex-1 flex-col space-y-5">
          <section className="rounded-[30px] border border-stone-200 bg-[linear-gradient(135deg,#FFF8F1_0%,#FFFFFF_58%)] p-5 shadow-[0_16px_45px_rgba(28,25,23,0.06)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B572A]">
                  Settings
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-stone-900">
                  Kelola Akun Karyawan
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-stone-500">
                  Atur akun kasir, admin, dan barista dari satu tempat dengan dummy data lokal yang
                  siap dikembangkan ke sistem role dan autentikasi asli.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCreate}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#8B572A] px-5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <UserPlus size={16} />
                Tambah Akun
              </button>
            </div>

            {feedback ? (
              <div
                className={cn(
                  "mt-4 rounded-[24px] px-4 py-4 text-sm",
                  feedback.tone === "success" && "bg-[#E8F5EC] text-[#1D6B3A]",
                  feedback.tone === "info" && "bg-[#FFF8E8] text-[#9C5A00]",
                  feedback.tone === "error" && "bg-[#FDECEC] text-[#9A2B2B]"
                )}
              >
                <p className="font-semibold">{feedback.title}</p>
                <p className="mt-1">{feedback.message}</p>
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Total Akun
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">{itemStats.total}</p>
              </div>

              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Akun Aktif
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#1D6B3A]">
                  {itemStats.activeCount}
                </p>
              </div>

              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Akun Nonaktif
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#9A2B2B]">
                  {itemStats.nonActiveCount}
                </p>
              </div>

              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Akses Manajemen
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">
                  {itemStats.managementCount}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
            <div className="flex flex-col gap-4">
              <div className="grid gap-3 xl:grid-cols-[1.2fr,0.5fr,0.5fr]">
                <div className="flex h-11 items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-stone-400">
                  <Search size={18} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari nama, username, atau nomor telepon..."
                    className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                  />
                </div>

                <select
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                  className="h-11 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-700 outline-none"
                >
                  <option value="all">Semua Role</option>
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Barista">Barista</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  className="h-11 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-700 outline-none"
                >
                  <option value="all">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                  <option value="Cuti">Cuti</option>
                </select>
              </div>
            </div>

            <div className="mt-5 min-h-0 space-y-3">
              {filteredEmployees.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
                  <p className="text-lg font-semibold text-stone-800">Akun karyawan tidak ditemukan</p>
                  <p className="mt-2 text-sm text-stone-500">
                    Coba ubah filter pencarian atau tambahkan akun baru ke daftar karyawan.
                  </p>
                </div>
              ) : (
                filteredEmployees.map((employee) => (
                  <article key={employee.id} className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    {isLockedEmployee(employee) ? (
                      <div className="mb-4 rounded-2xl border border-[#E9D8C5] bg-[#FFF7EF] px-4 py-3 text-sm text-[#8B572A]">
                        Akun owner dikunci untuk menjaga akses utama tetap aman.
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-stone-200">
                          <Image
                            src={employee.image}
                            alt={employee.name}
                            fill
                            className="object-cover"
                            unoptimized={employee.image.startsWith("data:")}
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold text-stone-900">
                              {employee.name}
                            </h2>
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-[11px] font-semibold",
                                employee.status === "Aktif" && "bg-[#E8F5EC] text-[#1D6B3A]",
                                employee.status === "Nonaktif" && "bg-[#FDECEC] text-[#9A2B2B]",
                                employee.status === "Cuti" && "bg-[#FFF4E5] text-[#9C5A00]"
                              )}
                            >
                              {employee.status}
                            </span>
                            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-stone-600 shadow-sm">
                              {employee.role}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-stone-500">{employee.id}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-2 lg:items-end">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#8B572A] shadow-sm">
                          @{employee.username}
                        </span>
                        <p className="text-xs text-stone-400">Foto akun bisa diubah dari editor</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 xl:grid-cols-4">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                          Shift
                        </p>
                        <p className="mt-2 text-sm font-semibold text-stone-900">{employee.shift}</p>
                        <p className="mt-1 text-sm text-stone-500">{employee.schedule}</p>
                      </div>

                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                          Kontak
                        </p>
                        <p className="mt-2 text-sm font-semibold text-stone-900">{employee.phone}</p>
                      </div>

                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                          PIN Dummy
                        </p>
                        <p className="mt-2 text-sm font-semibold text-stone-900">
                          {`••••${employee.pinCode.slice(-2)}`}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                          Last Login
                        </p>
                        <p className="mt-2 text-sm font-semibold text-stone-900">
                          {employee.lastLogin}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      {(() => {
                        const isLocked = isLockedEmployee(employee);

                        return (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEdit(employee)}
                              disabled={isLocked}
                              className={cn(
                                "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition",
                                isLocked
                                  ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
                                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
                              )}
                            >
                              <PencilLine size={16} />
                              Edit Akun
                            </button>

                            <button
                              type="button"
                              onClick={() => handleResetPin(employee.id)}
                              disabled={isLocked}
                              className={cn(
                                "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition",
                                isLocked
                                  ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
                                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
                              )}
                            >
                              <KeyRound size={16} />
                              Reset PIN
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(employee.id)}
                              disabled={isLocked}
                              className={cn(
                                "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition",
                                isLocked
                                  ? "cursor-not-allowed bg-stone-200 text-stone-500"
                                  : employee.status === "Aktif"
                                    ? "bg-[#FDECEC] text-[#9A2B2B] hover:opacity-90"
                                    : "bg-[#E8F5EC] text-[#1D6B3A] hover:opacity-90"
                              )}
                            >
                              <ShieldCheck size={16} />
                              {isLocked
                                ? "Akun Owner Terkunci"
                                : employee.status === "Aktif"
                                  ? "Nonaktifkan Akun"
                                  : "Aktifkan Akun"}
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B572A] text-white">
                <Users size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Konteks Pengembangan</h2>
                <p className="text-sm text-stone-500">
                  Fondasi ini sudah siap untuk role admin/cashier, autentikasi PIN, dan sinkronisasi
                  akun karyawan saat backend nanti ditambahkan.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <EmployeeEditorSheet
        isOpen={editorOpen}
        mode={editingEmployee ? "edit" : "create"}
        item={editingEmployee}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
