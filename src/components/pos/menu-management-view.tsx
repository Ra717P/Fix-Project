"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { PencilLine, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils/cn";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import type { MenuFormValues, MenuItem } from "@/types/pos";

const MenuEditorSheet = dynamic(
  () => import("@/components/pos/menu-editor-sheet").then((mod) => mod.MenuEditorSheet),
  { loading: () => null }
);

interface MenuManagementViewProps {
  items: MenuItem[];
  categoryOptions: string[];
  onCreateMenu: (values: MenuFormValues) => void;
  onCreateCategory: (value: string) => string | null;
  onUpdateMenu: (itemId: number, values: MenuFormValues) => void;
  onToggleAvailability: (itemId: number) => void;
}

function formatCategoryLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeCategoryValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function MenuManagementView({
  items,
  categoryOptions,
  onCreateMenu,
  onCreateCategory,
  onUpdateMenu,
  onToggleAvailability,
}: MenuManagementViewProps) {
  const { session } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVariant, setSelectedVariant] = useState("all");
  const [categoryDraft, setCategoryDraft] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const isOwner = session?.role === "Owner";

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchSearch =
        keyword.length === 0 || item.name.toLowerCase().includes(keyword);
      const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchVariant =
        selectedVariant === "all" ||
        item.tags.some((tag) => tag.toLowerCase() === selectedVariant);

      return matchSearch && matchCategory && matchVariant;
    });
  }, [items, search, selectedCategory, selectedVariant]);

  const itemStats = useMemo(() => {
    const availableCount = items.filter((item) => item.isAvailable).length;
    const soldOutCount = items.length - availableCount;

    return {
      total: items.length,
      categories: categoryOptions.length,
      availableCount,
      soldOutCount,
    };
  }, [categoryOptions.length, items]);

  const handleCreate = () => {
    if (!isOwner) {
      return;
    }

    setEditingItem(null);
    setEditorOpen(true);
  };

  const handleOpenCategoryEditor = () => {
    if (!isOwner) {
      return;
    }

    setCategoryEditorOpen(true);
    setCategoryError("");
  };

  const handleCloseCategoryEditor = () => {
    setCategoryEditorOpen(false);
    setCategoryDraft("");
    setCategoryError("");
  };

  const handleEdit = (item: MenuItem) => {
    if (!isOwner) {
      return;
    }

    setEditingItem(item);
    setEditorOpen(true);
  };

  const handleSave = (values: MenuFormValues) => {
    if (!isOwner) {
      return;
    }

    if (editingItem) {
      onUpdateMenu(editingItem.id, values);
      return;
    }

    onCreateMenu(values);
  };

  const handleCreateCategory = () => {
    if (!isOwner) {
      return;
    }

    if (!categoryDraft.trim()) {
      setCategoryError("Nama filter wajib diisi.");
      return;
    }

    const createdCategory = onCreateCategory(categoryDraft);

    if (!createdCategory) {
      setCategoryError("Nama filter sudah dipakai atau belum valid.");
      return;
    }

    setSelectedCategory(normalizeCategoryValue(createdCategory));
    handleCloseCategoryEditor();
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
                  Kelola Menu
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-stone-500">
                  Tambah menu baru, edit menu yang sudah ada, dan rapikan katalog dengan filter
                  yang mudah dipakai tim kasir.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {isOwner ? (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenCategoryEditor}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                    >
                      <Plus size={16} />
                      Tambah Filter
                    </button>

                    <button
                      type="button"
                      onClick={handleCreate}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#8B572A] px-5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      <Plus size={16} />
                      Tambah Menu
                    </button>
                  </>
                ) : (
                  <div className="rounded-2xl border border-[#F3D7D7] bg-[#FFF8F2] px-4 py-3 text-sm text-stone-600">
                    Akses {session?.role ?? "user"} hanya bisa menandai menu sebagai habis.
                  </div>
                )}
              </div>
            </div>

            {isOwner && categoryEditorOpen ? (
              <div className="mt-4 rounded-[28px] border border-stone-200 bg-white/90 p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                  <label className="flex-1 space-y-2 text-sm text-stone-600">
                    <span className="font-medium">Nama Filter Menu</span>
                    <input
                      value={categoryDraft}
                      onChange={(event) => {
                        setCategoryDraft(event.target.value);
                        setCategoryError("");
                      }}
                      placeholder="Contoh: Signature Coffee"
                      className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none placeholder:text-stone-400"
                    />
                    <p className="text-xs text-stone-400">
                      Filter baru akan muncul di tab menu POS dan pilihan kategori menu.
                    </p>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCloseCategoryEditor}
                      className="h-11 rounded-2xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="h-11 rounded-2xl bg-[#8B572A] px-4 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Simpan Filter
                    </button>
                  </div>
                </div>

                {categoryError ? (
                  <p className="mt-3 rounded-2xl bg-[#FDECEC] px-4 py-3 text-sm text-[#9A2B2B]">
                    {categoryError}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Total Menu
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">{itemStats.total}</p>
              </div>

              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Kategori Aktif
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">{itemStats.categories}</p>
              </div>

              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Menu Tersedia
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#1D6B3A]">
                  {itemStats.availableCount}
                </p>
              </div>

              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Menu Habis
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#9A2B2B]">
                  {itemStats.soldOutCount}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex h-11 w-full items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-stone-400 xl:max-w-[420px]">
                  <Search size={18} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari nama menu..."
                    className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2">
                  <SlidersHorizontal size={16} className="text-stone-400" />
                  <label className="text-xs font-medium text-stone-500">Varian</label>
                  <select
                    value={selectedVariant}
                    onChange={(event) => setSelectedVariant(event.target.value)}
                    className="bg-transparent text-sm text-stone-700 outline-none"
                  >
                    <option value="all">Semua</option>
                    <option value="hot">Hot</option>
                    <option value="ice">Ice</option>
                    <option value="regular">Regular</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold transition",
                    selectedCategory === "all"
                      ? "bg-[#8B572A] text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  Semua
                </button>

                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "rounded-full px-4 py-2 text-xs font-semibold transition",
                      selectedCategory === category
                        ? "bg-[#8B572A] text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    )}
                  >
                    {formatCategoryLabel(category)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 min-h-0">
              {filteredItems.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
                  <p className="text-lg font-semibold text-stone-800">Menu tidak ditemukan</p>
                  <p className="mt-2 text-sm text-stone-500">
                    Coba ubah filter atau tambah menu baru ke katalog.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {filteredItems.map((item) => (
                    <article
                      key={item.id}
                      className={cn(
                        "flex h-full flex-col overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_10px_28px_rgba(28,25,23,0.05)] transition",
                        item.isAvailable
                          ? "hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(28,25,23,0.08)]"
                          : "bg-stone-50 shadow-[0_8px_18px_rgba(28,25,23,0.04)]"
                      )}
                    >
                      <div className="relative aspect-[1.08/1] overflow-hidden bg-stone-100">
                        <div className="absolute left-3 top-3 z-[1] flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-stone-600 shadow-sm backdrop-blur">
                            {formatCategoryLabel(item.category)}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-[11px] font-semibold shadow-sm",
                              item.isAvailable
                                ? "bg-[#E8F5EC] text-[#1D6B3A]"
                                : "bg-[#9A2B2B] text-white"
                            )}
                          >
                            {item.isAvailable ? "Tersedia" : "Habis"}
                          </span>
                        </div>

                        <Image
                          src={item.image}
                          alt={item.name}
                          width={560}
                          height={520}
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          unoptimized={item.image.startsWith("data:")}
                          className={cn(
                            "h-full w-full object-cover transition duration-500",
                            item.isAvailable ? "hover:scale-[1.02]" : "grayscale-[0.2] opacity-75"
                          )}
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <div className="min-h-[90px]">
                          <h3 className="text-lg font-semibold leading-snug text-stone-900">
                            {item.name}
                          </h3>
                          <p className="mt-2 text-base font-semibold text-[#8B572A]">
                            {formatRupiah(item.price)}
                          </p>
                          {!item.isAvailable ? (
                            <p className="mt-1 text-xs font-medium text-[#9A2B2B]">
                              Menu sedang ditandai habis.
                            </p>
                          ) : null}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                          {item.tags.map((tag) => (
                            <span
                              key={`${item.id}-${tag}`}
                              className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div
                          className={cn(
                            "mt-auto pt-4",
                            isOwner ? "grid grid-cols-2 gap-2" : "grid grid-cols-1"
                          )}
                        >
                          {isOwner ? (
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                            >
                              <PencilLine size={16} />
                              Edit Menu
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => onToggleAvailability(item.id)}
                            disabled={!isOwner && !item.isAvailable}
                            className={cn(
                              "inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition",
                              !isOwner && !item.isAvailable
                                ? "cursor-not-allowed bg-stone-200 text-stone-500"
                                : item.isAvailable
                                  ? "bg-[#FDECEC] text-[#9A2B2B] hover:opacity-90"
                                  : "bg-[#E8F5EC] text-[#1D6B3A] hover:opacity-90"
                            )}
                          >
                            {!isOwner && !item.isAvailable
                              ? "Sudah Habis"
                              : item.isAvailable
                                ? "Tandai Habis"
                                : "Aktifkan Lagi"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <MenuEditorSheet
        isOpen={editorOpen}
        mode={editingItem ? "edit" : "create"}
        item={editingItem}
        categoryOptions={categoryOptions}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
