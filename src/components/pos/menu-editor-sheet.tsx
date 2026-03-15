"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { MenuFormValues, MenuItem } from "@/types/pos";

interface MenuEditorSheetProps {
  isOpen: boolean;
  mode: "create" | "edit";
  item: MenuItem | null;
  categoryOptions: string[];
  onClose: () => void;
  onSave: (values: MenuFormValues) => void;
}

function formatCategoryLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parsePrice(value: string) {
  const digitsOnly = value.replace(/[^\d]/g, "");
  return digitsOnly.length === 0 ? 0 : Number.parseInt(digitsOnly, 10);
}

function detectImageInputMode(value: string) {
  if (!value) {
    return "url" as const;
  }

  return value.startsWith("data:") ? ("upload" as const) : ("url" as const);
}

function createInitialState(item: MenuItem | null, fallbackCategory: string) {
  return {
    name: item?.name ?? "",
    price: item ? String(item.price) : "",
    image: item?.image ?? "",
    category: item?.category ?? fallbackCategory,
    tags: item?.tags.join(", ") ?? "Hot, Ice",
    isAvailable: item?.isAvailable ?? true,
  };
}

export function MenuEditorSheet({
  isOpen,
  mode,
  item,
  categoryOptions,
  onClose,
  onSave,
}: MenuEditorSheetProps) {
  const fallbackCategory = categoryOptions[0] ?? "coffee";
  const [form, setForm] = useState(() => createInitialState(item, fallbackCategory));
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

    setForm(createInitialState(item, fallbackCategory));
    setImageInputMode(detectImageInputMode(item?.image ?? ""));
    setImageUrlDraft(item?.image ?? "");
    setUploadedImageName("");
    setError("");
  }, [fallbackCategory, isOpen, item]);

  if (!isOpen) {
    return null;
  }

  const title = mode === "create" ? "Tambah Menu Baru" : "Edit Menu";

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
    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!form.name.trim()) {
      setError("Nama menu wajib diisi.");
      return;
    }

    if (parsePrice(form.price) <= 0) {
      setError("Harga menu harus lebih dari nol.");
      return;
    }

    if (!form.image.trim()) {
      setError("Pilih upload gambar atau isi link gambar menu.");
      return;
    }

    if (!form.category.trim()) {
      setError("Kategori menu wajib dipilih.");
      return;
    }

    onSave({
      name: form.name.trim(),
      price: parsePrice(form.price),
      image: form.image.trim(),
      category: form.category.trim(),
      tags: tags.length > 0 ? tags : ["Regular"],
      isAvailable: form.isAvailable,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 p-3 lg:items-center lg:p-6">
      <div className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[32px] bg-white p-5 shadow-[0_24px_90px_rgba(0,0,0,0.2)] lg:max-h-[calc(100vh-3rem)] lg:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8B572A]">
              Kelola Menu
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-stone-900">{title}</h2>
            <p className="mt-2 text-sm text-stone-500">
              Simpan menu baru atau ubah data menu yang sudah ada langsung dari dashboard.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-stone-200"
            aria-label="Tutup editor menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4 overflow-y-auto pr-1">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Nama Menu</span>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Contoh: Iced Caramel Latte"
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
              />
            </label>

            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Harga</span>
              <input
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                inputMode="numeric"
                placeholder="Contoh: 28000"
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.8fr,1.2fr]">
            <label className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Kategori</span>
              <select
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {formatCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-2 text-sm text-stone-600">
              <span className="font-medium">Sumber Gambar</span>
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
                  Link Gambar
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
                  Upload Gambar
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
                    Pilih file gambar
                  </label>

                  <p className="text-xs text-stone-400">
                    {uploadedImageName
                      ? `File dipilih: ${uploadedImageName}`
                      : form.image.startsWith("data:")
                        ? "Gambar upload tersimpan di form ini."
                        : "Belum ada file yang dipilih."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm text-stone-600">
            <span className="font-medium">Preview Gambar</span>
            <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-stone-50">
              {form.image ? (
                <div className="relative aspect-[1.5/1]">
                  <Image
                    src={form.image}
                    alt={form.name || "Preview menu"}
                    fill
                    className="object-cover"
                    unoptimized={form.image.startsWith("data:")}
                  />
                </div>
              ) : (
                <div className="flex aspect-[1.5/1] items-center justify-center text-sm text-stone-400">
                  Preview gambar akan tampil di sini
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm text-stone-600">
            <span className="font-medium">Status Menu</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, isAvailable: true }))}
                className={cn(
                  "h-11 rounded-2xl border px-4 text-sm font-semibold transition",
                  form.isAvailable
                    ? "border-[#1D6B3A] bg-[#E8F5EC] text-[#1D6B3A]"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                )}
              >
                Tersedia
              </button>

              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, isAvailable: false }))}
                className={cn(
                  "h-11 rounded-2xl border px-4 text-sm font-semibold transition",
                  !form.isAvailable
                    ? "border-[#9A2B2B] bg-[#FDECEC] text-[#9A2B2B]"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                )}
              >
                Habis
              </button>
            </div>
            <p className="text-xs text-stone-400">
              Menu yang ditandai habis tetap terlihat di katalog, tapi tidak bisa ditambahkan ke
              keranjang.
            </p>
          </div>

          <label className="space-y-2 text-sm text-stone-600">
            <span className="font-medium">Varian</span>
            <input
              value={form.tags}
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
              placeholder="Contoh: Hot, Ice"
              className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
            />
            <p className="text-xs text-stone-400">
              Pisahkan varian dengan koma. Contoh: `Hot, Ice` atau `Regular`.
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
            <Plus size={16} />
            {mode === "create" ? "Simpan Menu" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
