"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/pos/product-card";
import type { MenuItem } from "@/types/pos";

interface ProductGridProps {
  items: MenuItem[];
  onAdd: (item: MenuItem, variant: string) => void;
}

const INITIAL_VISIBLE_ITEMS = 8;
const LOAD_MORE_STEP = 4;

export function ProductGrid({ items, onAdd }: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_ITEMS);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_ITEMS);
  }, [items]);

  useEffect(() => {
    if (visibleCount >= items.length) {
      return;
    }

    const target = loadMoreRef.current;

    if (!target || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setVisibleCount((current) => Math.min(current + LOAD_MORE_STEP, items.length));
      },
      {
        rootMargin: "240px 0px",
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [items.length, visibleCount]);

  const visibleItems = items.slice(0, visibleCount);

  return (
    <>
      <div className="grid auto-rows-fr grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
      {visibleItems.map((item) => (
        <ProductCard key={item.id} item={item} onAdd={onAdd} />
      ))}
      </div>

      {visibleCount < items.length ? (
        <div
          ref={loadMoreRef}
          aria-hidden="true"
          className="flex h-14 items-center justify-center text-xs font-medium text-stone-400"
        >
          Memuat menu berikutnya...
        </div>
      ) : null}
    </>
  );
}
