"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Save, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { EmployeeFormValues, EmployeeItem } from "@/types/pos";

interface EmployeeEditorSheetProps {
  isOpen: boolean;
  mode: "create" | "edit";
  item: EmployeeItem | null;
  onClose: () => void;
  onSave: (values: EmployeeFormValues) => void;
}

const roleOptions = ["Owner", "Admin", "Cashier", "Barista"] as const;
const statusOptions = ["Aktif", "Nonaktif", "Cuti"] as const;

function createInitialState(item: EmployeeItem | null): EmployeeFormValues {
  return {
    name: item?.name ?? "",
    image: item?.image ?? "",
    role: item?.role ?? "Cashier",
    shift: item?.shift ?? "Shift 1",
    schedule: item?.schedule ?? "08:00 - 16:00",
    status: item?.status ?? "Aktif",
    phone: item?.phone ?? "",
    username: item?.username ?? "",
    pinCode: item?.pinCode ?? "",
  };
}

function detectImageInputMode(value: string) {
  if (!value) {
    return "url" as const;
  }

  return value.startsWith("data:") ? ("upload" as const) : ("url" as const);
}

export function EmployeeEditorSheet({
  isOpen,
  mode,
  item,
  onClose,
  onSave,
}: EmployeeEditorSheetProps) {
  const [form, setForm] = useState<EmployeeFormValues>(() => createInitialState(item));
  const [imageInputMode, setImageInputMode] = useState<"url" | "upload">(
    detectImageInputMode(item?.image ?? "")
  );
  const [imageUrlDraft, setImageUrlDraft] = useState(item?.image ?? "");
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(createInitialState(item));
    setImageInputMode(detectImageInputMode(item?.image ?? ""));
    setImageUrlDraft(item?.image ?? "");
    setUploadedImageName("");
    setError("");
  }, [isOpen, item]);

  if (!isOpen) {
    return null;
  }

  const title = mode === "create" ? "Tambah Akun Karyawan" : "Edit Akun Karyawan";

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("File yang dipilih harus berupa gambar.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      setForm((prev) => ({ ...prev, image: result }));
      setUploadedImageName(file.name);
      setError("");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError("Nama karyawan wajib diisi.");
      return;
    }

    if (!form.username.trim()) {
      setError("Username akun wajib diisi.");
      return;
    }

    if (!form.pinCode.trim() || form.pinCode.trim().length < 4) {
      setError("PIN minimal 4 digit.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Nomor telepon wajib diisi.");
      return;
    }

    if (!form.image.trim()) {
      setError("Pilih upload foto atau isi link foto karyawan.");
      return;
    }

    onSave({
      name: form.name.trim(),
      image: form.image.trim(),
      role: form.role,
      shift: form.shift.trim(),
      schedule: form.schedule.trim(),
      status: form.status,
      phone: form.phone.trim(),
      username: form.username.trim().toLowerCase(),
      pinCode: form.pinCode.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-3 lg:items-center lg:p-6">
      <div className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[32px] bg-white p-5 shadow-[0_24px_90px_rgba(0,0,0,0.2)] lg:max-h-[calc(100vh-3rem)] lg:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8B572A]">
              Kelola Karyawan
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-stone-900">{title}</h2>
            <p className="mt-2 text-sm text-stone-500">
              Pengaturan akun ini masih dummy data lokal dan siap disambungkan ke backend nanti.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-stone-200"
            aria-label="Tutup editor akun karyawan"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4 overflow-y-auto pr-1">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Nama Karyawan</span>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Contoh: Kasir Pagi"
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
              />
            </label>

            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Nomor Telepon</span>
              <input
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Contoh: 0812-0000-0000"
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
              />
            </label>
          </div>

          <div className="space-y-2 text-sm text-stone-600">
            <span className="font-medium">Sumber Foto</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setImageInputMode("url");
                  setError("");
                }}
                className={cn(
                  "h-11 rounded-2xl border px-4 text-sm font-semibold transition",
                  imageInputMode === "url"
                    ? "border-[#8B572A] bg-[#8B572A] text-white"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                )}
              >
                Link Foto
              </button>

              <button
                type="button"
                onClick={() => {
                  setImageInputMode("upload");
                  setError("");
                }}
                className={cn(
                  "h-11 rounded-2xl border px-4 text-sm font-semibold transition",
                  imageInputMode === "upload"
                    ? "border-[#8B572A] bg-[#8B572A] text-white"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                )}
              >
                Upload Foto
              </button>
            </div>

            {imageInputMode === "url" ? (
              <input
                value={imageUrlDraft}
                onChange={(event) => {
                  const nextValue = event.target.value;

                  setImageUrlDraft(nextValue);
                  setForm((prev) => ({ ...prev, image: nextValue }));
                }}
                placeholder="https://..."
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
              />
            ) : (
              <div className="space-y-2">
                <label className="flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 text-sm font-medium text-stone-600 transition hover:bg-stone-100">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  Pilih file foto
                </label>

                <p className="text-xs text-stone-400">
                  {uploadedImageName
                    ? `File dipilih: ${uploadedImageName}`
                    : form.image.startsWith("data:")
                      ? "Foto upload tersimpan di form ini."
                      : "Belum ada file yang dipilih."}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm text-stone-600">
            <span className="font-medium">Preview Foto</span>
            <div className="flex items-center gap-4 rounded-[24px] border border-stone-200 bg-stone-50 p-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-white shadow-sm">
                {form.image ? (
                  <Image
                    src={form.image}
                    alt={form.name || "Preview karyawan"}
                    fill
                    className="object-cover"
                    unoptimized={form.image.startsWith("data:")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                    Belum ada foto
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-900">
                  {form.name || "Nama karyawan"}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  Preview ini akan dipakai di daftar akun karyawan.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Role</span>
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    role: event.target.value as EmployeeFormValues["role"],
                  }))
                }
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Status Akun</span>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as EmployeeFormValues["status"],
                  }))
                }
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Shift</span>
              <input
                value={form.shift}
                onChange={(event) => setForm((prev) => ({ ...prev, shift: event.target.value }))}
                placeholder="Contoh: Shift 1"
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Jadwal Kerja</span>
              <input
                value={form.schedule}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, schedule: event.target.value }))
                }
                placeholder="Contoh: 08:00 - 16:00"
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
              />
            </label>

            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Username</span>
              <input
                value={form.username}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, username: event.target.value }))
                }
                placeholder="Contoh: kasir.pagi"
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-stone-600">
            <span className="font-medium">PIN Dummy</span>
            <input
              value={form.pinCode}
              onChange={(event) => setForm((prev) => ({ ...prev, pinCode: event.target.value }))}
              inputMode="numeric"
              placeholder="Minimal 4 digit"
              className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
            />
            <p className="text-xs text-stone-400">
              PIN ini hanya dipakai untuk simulasi akun kasir sebelum autentikasi asli dibuat.
            </p>
          </label>

          {error ? (
            <p className="rounded-2xl bg-[#FDECEC] px-4 py-3 text-sm text-[#9A2B2B]">{error}</p>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-2xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#8B572A] px-5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Save size={16} />
            {mode === "create" ? "Simpan Akun" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
