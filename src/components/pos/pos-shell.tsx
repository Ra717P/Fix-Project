"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { EmployeeManagementView } from "@/components/dashboard/employee-management-view";
import { BrandHeader } from "@/components/pos/brand-header";
import { DesktopPosLayout } from "@/components/pos/desktop-pos-layout";
import { MobilePosLayout } from "@/components/pos/mobile-pos-layout";
import { SidebarNav } from "@/components/pos/sidebar-nav";
import { employeeItems } from "@/data/dashboard-data";
import { usePos } from "@/hooks/use-pos";
import { cn } from "@/lib/utils/cn";

const CheckoutSheet = dynamic(
  () => import("@/components/pos/checkout-sheet").then((mod) => mod.CheckoutSheet),
  { loading: () => null }
);
const PaymentFinishedSheet = dynamic(
  () =>
    import("@/components/pos/payment-finished-sheet").then((mod) => mod.PaymentFinishedSheet),
  { loading: () => null }
);
const MenuManagementView = dynamic(
  () => import("@/components/pos/menu-management-view").then((mod) => mod.MenuManagementView),
  { loading: () => null }
);
const SidebarPlaceholderView = dynamic(
  () =>
    import("@/components/pos/sidebar-placeholder-view").then((mod) => mod.SidebarPlaceholderView),
  { loading: () => null }
);
const MobileSidebarNav = dynamic(
  () => import("@/components/pos/mobile-sidebar-nav").then((mod) => mod.MobileSidebarNav),
  { loading: () => null }
);

export function PosShell() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const {
    activeSidebarItem,
    setActiveSidebarItem,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedOrderType,
    setSelectedOrderType,
    tableNumber,
    setTableNumber,
    paymentMethod,
    setPaymentMethod,
    cart,
    itemCount,
    menuCatalog,
    menuManagementCategories,
    filteredMenu,
    subtotal,
    discountAmount,
    tax,
    total,
    cashReceived,
    cashReceivedAmount,
    changeDue,
    remainingBalance,
    hasDiscount,
    heldOrderCount,
    checkoutOpen,
    paymentFinishedOpen,
    canCompletePayment,
    checkoutBlockerMessage,
    alert,
    lastCompletedOrder,
    addToCart,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    toggleDiscount,
    holdOrder,
    openCheckout,
    closeCheckout,
    closeFinishedPayment,
    setCashReceived,
    useExactCashAmount,
    completePayment,
    createMenuItem,
    createMenuCategory,
    updateMenuItem,
    toggleMenuAvailability,
    dismissAlert,
  } = usePos();

  const placeholderContent = {
    transactions: {
      title: "Transactions",
      description:
        "Halaman riwayat transaksi bisa diisi nanti dengan daftar pembayaran, filter tanggal, reprint struk, dan refund.",
    },
    reports: {
      title: "Reports",
      description:
        "Halaman laporan bisa dipakai untuk omzet harian, menu terlaris, performa kasir, dan ringkasan pembayaran.",
    },
  } as const;

  return (
    <div className="min-h-screen bg-[#F7F4F1] text-stone-900">
      <div className="mx-auto max-w-[1440px] bg-[#F7F4F1] lg:min-h-screen lg:border lg:border-stone-300 lg:bg-white lg:shadow-xl">
        <BrandHeader onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {(alert || heldOrderCount > 0) && (
          <section className="border-b border-stone-200 bg-[#FFF8F2] px-3 py-3 lg:px-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-3">
                {heldOrderCount > 0 ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600 shadow-sm">
                    Pesanan ditahan: {heldOrderCount}
                  </span>
                ) : null}
              </div>

              {alert ? (
                <div
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-2xl px-4 py-3 text-sm shadow-sm lg:min-w-[360px] lg:max-w-[420px]",
                    alert.tone === "success" && "bg-[#E8F5EC] text-[#1D6B3A]",
                    alert.tone === "error" && "bg-[#FDECEC] text-[#9A2B2B]",
                    alert.tone === "info" && "bg-white text-stone-600"
                  )}
                >
                  <div>
                    <p className="font-semibold">{alert.title}</p>
                    <p className="text-xs opacity-90">{alert.message}</p>
                  </div>

                  <button
                    type="button"
                    onClick={dismissAlert}
                    className="shrink-0 text-xs font-semibold opacity-70 transition hover:opacity-100"
                  >
                    Tutup
                  </button>
                </div>
              ) : null}
            </div>
          </section>
        )}

        <div className="hidden lg:flex lg:min-h-[calc(100vh-73px)]">
          <SidebarNav activeItem={activeSidebarItem} onChange={setActiveSidebarItem} />

          {activeSidebarItem === "orders" ? (
            <DesktopPosLayout
              search={search}
              onSearchChange={setSearch}
              selectedCategory={selectedCategory}
              categoryOptions={menuManagementCategories}
              onCategoryChange={setSelectedCategory}
              selectedOrderType={selectedOrderType}
              onOrderTypeChange={setSelectedOrderType}
              tableNumber={tableNumber}
              onTableNumberChange={setTableNumber}
              products={filteredMenu}
              onAddToCart={addToCart}
              cart={cart}
              itemCount={itemCount}
              subtotal={subtotal}
              discountAmount={discountAmount}
              tax={tax}
              total={total}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onIncreaseQty={increaseQty}
              onDecreaseQty={decreaseQty}
              onRemoveItem={removeItem}
              onClearCart={clearCart}
              onHoldOrder={holdOrder}
              onToggleDiscount={toggleDiscount}
              onProceedToPayment={openCheckout}
              hasDiscount={hasDiscount}
              heldOrderCount={heldOrderCount}
            />
          ) : activeSidebarItem === "settings" ? (
            <MenuManagementView
              items={menuCatalog}
              categoryOptions={menuManagementCategories}
              onCreateMenu={createMenuItem}
              onCreateCategory={createMenuCategory}
              onUpdateMenu={updateMenuItem}
              onToggleAvailability={toggleMenuAvailability}
            />
          ) : activeSidebarItem === "employees" ? (
            <EmployeeManagementView initialItems={employeeItems} />
          ) : (
            <SidebarPlaceholderView
              title={placeholderContent[activeSidebarItem].title}
              description={placeholderContent[activeSidebarItem].description}
              onBackToOrders={() => setActiveSidebarItem("orders")}
            />
          )}
        </div>

        <div className="lg:hidden">
          {activeSidebarItem === "orders" ? (
            <MobilePosLayout
              search={search}
              onSearchChange={setSearch}
              selectedCategory={selectedCategory}
              categoryOptions={menuManagementCategories}
              onCategoryChange={setSelectedCategory}
              selectedOrderType={selectedOrderType}
              onOrderTypeChange={setSelectedOrderType}
              tableNumber={tableNumber}
              onTableNumberChange={setTableNumber}
              products={filteredMenu}
              onAddToCart={addToCart}
              cart={cart}
              itemCount={itemCount}
              subtotal={subtotal}
              discountAmount={discountAmount}
              tax={tax}
              total={total}
              onClearCart={clearCart}
              onHoldOrder={holdOrder}
              onToggleDiscount={toggleDiscount}
              onProceedToPayment={openCheckout}
              hasDiscount={hasDiscount}
              heldOrderCount={heldOrderCount}
            />
          ) : activeSidebarItem === "settings" ? (
            <MenuManagementView
              items={menuCatalog}
              categoryOptions={menuManagementCategories}
              onCreateMenu={createMenuItem}
              onCreateCategory={createMenuCategory}
              onUpdateMenu={updateMenuItem}
              onToggleAvailability={toggleMenuAvailability}
            />
          ) : activeSidebarItem === "employees" ? (
            <EmployeeManagementView initialItems={employeeItems} />
          ) : (
            <SidebarPlaceholderView
              title={placeholderContent[activeSidebarItem].title}
              description={placeholderContent[activeSidebarItem].description}
              onBackToOrders={() => setActiveSidebarItem("orders")}
            />
          )}
        </div>

        <MobileSidebarNav
          isOpen={mobileSidebarOpen}
          activeItem={activeSidebarItem}
          onChange={setActiveSidebarItem}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <CheckoutSheet
          isOpen={checkoutOpen}
          itemCount={itemCount}
          subtotal={subtotal}
          discountAmount={discountAmount}
          tax={tax}
          total={total}
          orderType={selectedOrderType}
          onOrderTypeChange={setSelectedOrderType}
          tableNumber={tableNumber}
          onTableNumberChange={setTableNumber}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          cashReceived={cashReceived}
          cashReceivedAmount={cashReceivedAmount}
          onCashReceivedChange={setCashReceived}
          changeDue={changeDue}
          remainingBalance={remainingBalance}
          canCompletePayment={canCompletePayment}
          blockerMessage={checkoutBlockerMessage}
          onClose={closeCheckout}
          onConfirm={completePayment}
          onUseExactCashAmount={useExactCashAmount}
        />

        <PaymentFinishedSheet
          isOpen={paymentFinishedOpen}
          order={lastCompletedOrder}
          onClose={closeFinishedPayment}
        />
      </div>
    </div>
  );
}
