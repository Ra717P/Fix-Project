import { ActionShortcuts } from "@/components/pos/action-shortcuts";
import { CartItemRow } from "@/components/pos/cart-item-row";
import { CartSummary } from "@/components/pos/cart-summary";
import { CategoryTabs } from "@/components/pos/category-tabs";
import { OrderTypeTabs } from "@/components/pos/order-type-tabs";
import { PaymentMethodSelector } from "@/components/pos/payment-method-selector";
import { ProductGrid } from "@/components/pos/product-grid";
import { SearchBar } from "@/components/pos/search-bar";
import { SidebarNav } from "@/components/pos/sidebar-nav";
import { TableInput } from "@/components/pos/table-input";
import type { CartItem, MenuItem, OrderType, PaymentMethod } from "@/types/pos";

interface DesktopPosLayoutProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
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
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (value: PaymentMethod) => void;
  onIncreaseQty: (cartKey: string) => void;
  onDecreaseQty: (cartKey: string) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
  onHoldOrder: () => void;
  onToggleDiscount: () => void;
  onProceedToPayment: () => void;
  hasDiscount: boolean;
  heldOrderCount: number;
}

export function DesktopPosLayout({
  search,
  onSearchChange,
  selectedCategory,
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
  paymentMethod,
  onPaymentMethodChange,
  onIncreaseQty,
  onDecreaseQty,
  onRemoveItem,
  onClearCart,
  onHoldOrder,
  onToggleDiscount,
  onProceedToPayment,
  hasDiscount,
  heldOrderCount,
}: DesktopPosLayoutProps) {
  const hasCart = cart.length > 0;
  const showTableInput = selectedOrderType === "dine_in";

  return (
    <div className="hidden lg:flex lg:min-h-[calc(100vh-73px)]">
      <SidebarNav />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden p-4">
        <div className="flex min-h-0 flex-1 flex-col space-y-5">
          <SearchBar value={search} onChange={onSearchChange} />

          <section className="rounded-3xl border border-stone-200 bg-[#FBFAF8] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="grid gap-4 xl:grid-cols-[1fr,280px] xl:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                  Pengaturan Pesanan
                </p>
                <h2 className="mt-1 text-lg font-semibold text-stone-900">
                  Pilih jenis order untuk transaksi ini
                </h2>
                <OrderTypeTabs
                  value={selectedOrderType}
                  onChange={onOrderTypeChange}
                  className="mt-3"
                />
              </div>

              {showTableInput ? (
                <TableInput
                  value={tableNumber}
                  onChange={onTableNumberChange}
                  label="Nomor Meja"
                  placeholder="Masukkan nomor meja"
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-4 py-3 text-sm text-stone-500">
                  Nomor meja tidak dibutuhkan untuk pesanan{" "}
                  {selectedOrderType === "takeaway" ? "bawa pulang" : "delivery"}.
                </div>
              )}
            </div>
          </section>

          <CategoryTabs value={selectedCategory} onChange={onCategoryChange} />

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <ProductGrid items={products} onAdd={onAddToCart} />
          </div>
        </div>
      </main>

      <aside className="flex w-[340px] shrink-0 flex-col border-l border-stone-200 bg-[#FBFAF8] p-4 xl:w-[360px]">
        <div className="flex min-h-0 flex-1 flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-800">Keranjang</h2>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-500 shadow-sm">
              {itemCount} item
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
                  Keranjang masih kosong
                </div>
              ) : (
                cart.map((item) => (
                  <CartItemRow
                    key={item.cartKey}
                    item={item}
                    onIncrease={onIncreaseQty}
                    onDecrease={onDecreaseQty}
                    onRemove={onRemoveItem}
                  />
                ))
              )}
            </div>

            <div className="mt-auto space-y-4 border-t border-stone-200 pt-4">
              <CartSummary
                subtotal={subtotal}
                discount={discountAmount}
                tax={tax}
                total={total}
              />
              <PaymentMethodSelector value={paymentMethod} onChange={onPaymentMethodChange} />
              <ActionShortcuts
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
                className="h-12 w-full rounded-2xl bg-[#8B572A] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
