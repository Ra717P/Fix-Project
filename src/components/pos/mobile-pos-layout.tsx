import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ActionShortcuts } from "@/components/pos/action-shortcuts";
import { CartSummary } from "@/components/pos/cart-summary";
import { CategoryTabs } from "@/components/pos/category-tabs";
import { OrderTypeTabs } from "@/components/pos/order-type-tabs";
import { ProductGrid } from "@/components/pos/product-grid";
import { SearchBar } from "@/components/pos/search-bar";
import { TableInput } from "@/components/pos/table-input";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import type { CartItem, MenuItem, OrderType } from "@/types/pos";

interface MobilePosLayoutProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  categoryOptions: string[];
  onCategoryChange: (value: string) => void;
  selectedOrderType: OrderType;
  onOrderTypeChange: (value: OrderType) => void;
  tableNumber: string;
  onTableNumberChange: (value: string) => void;
  products: MenuItem[];
  onAddToCart: (item: MenuItem, variant: string) => void;
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  onClearCart: () => void;
  onHoldOrder: () => void;
  onToggleDiscount: () => void;
  onProceedToPayment: () => void;
  hasDiscount: boolean;
  heldOrderCount: number;
}

export function MobilePosLayout({
  search,
  onSearchChange,
  selectedCategory,
  categoryOptions,
  onCategoryChange,
  selectedOrderType,
  onOrderTypeChange,
  tableNumber,
  onTableNumberChange,
  products,
  onAddToCart,
  cart,
  itemCount,
  subtotal,
  discountAmount,
  tax,
  total,
  onClearCart,
  onHoldOrder,
  onToggleDiscount,
  onProceedToPayment,
  hasDiscount,
  heldOrderCount,
}: MobilePosLayoutProps) {
  const hasCart = cart.length > 0;

  return (
    <div className="p-3 lg:hidden">
      <div className="space-y-4">
        <SearchBar value={search} onChange={onSearchChange} showScanButton />
        <OrderTypeTabs value={selectedOrderType} onChange={onOrderTypeChange} />
        {selectedOrderType === "dine_in" ? (
          <TableInput value={tableNumber} onChange={onTableNumberChange} />
        ) : null}
        <CategoryTabs
          value={selectedCategory}
          options={categoryOptions}
          onChange={onCategoryChange}
        />

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-stone-800">Popular Today</h2>
          </div>

          <ProductGrid items={products} onAdd={onAddToCart} />
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-stone-800">Cart ({itemCount} items)</h2>
            <ChevronDown size={18} className="text-stone-400" />
          </div>

          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
                Cart is empty
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartKey} className="flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-stone-800">
                      {item.name} ({item.variant})
                    </p>
                    <p className="text-xs font-semibold text-[#8B572A]">{formatRupiah(item.price)}</p>
                  </div>

                  <div className="text-sm text-stone-500">x{item.qty}</div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 space-y-4 border-t border-stone-200 pt-4">
            <CartSummary
              subtotal={subtotal}
              discount={discountAmount}
              tax={tax}
              total={total}
            />
            <ActionShortcuts
              compact
              onClear={onClearCart}
              onHold={onHoldOrder}
              onToggleDiscount={onToggleDiscount}
              hasDiscount={hasDiscount}
              heldOrderCount={heldOrderCount}
              hasCart={hasCart}
            />

            <button
              type="button"
              onClick={onProceedToPayment}
              disabled={!hasCart}
              className="h-12 w-full rounded-2xl bg-[#8B572A] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              Proceed to Payment
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
