"use client";

import { BrandHeader } from "@/components/pos/brand-header";
import { CheckoutSheet } from "@/components/pos/checkout-sheet";
import { DesktopPosLayout } from "@/components/pos/desktop-pos-layout";
import { MobilePosLayout } from "@/components/pos/mobile-pos-layout";
import { PaymentFinishedSheet } from "@/components/pos/payment-finished-sheet";
import { usePos } from "@/hooks/use-pos";
import { cn } from "@/lib/utils/cn";

export function PosShell() {
  const {
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
    dismissAlert,
  } = usePos();

  return (
    <div className="min-h-screen bg-[#F7F4F1] text-stone-900">
      <div className="mx-auto max-w-[1440px] bg-[#F7F4F1] lg:min-h-screen lg:border lg:border-stone-300 lg:bg-white lg:shadow-xl">
        <BrandHeader />

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

        <DesktopPosLayout
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
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

        <MobilePosLayout
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
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
