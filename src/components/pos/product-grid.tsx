import { ProductCard } from "@/components/pos/product-card";
import type { MenuItem } from "@/types/pos";

interface ProductGridProps {
  items: MenuItem[];
  onAdd: (item: MenuItem, variant: string) => void;
}

export function ProductGrid({ items, onAdd }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 lg:gap-4">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} onAdd={onAdd} />
      ))}
    </div>
  );
}
