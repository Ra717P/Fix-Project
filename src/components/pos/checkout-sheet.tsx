"use client";

import { X } from "lucide-react";
import { CartSummary } from "@/components/pos/cart-summary";
import { OrderTypeTabs } from "@/components/pos/order-type-tabs";
import { PaymentMethodSelector } from "@/components/pos/payment-method-selector";
import { TableInput } from "@/components/pos/table-input";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import type { OrderType, PaymentMethod } from "@/types/pos";

interface CheckoutSheetProps {
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  orderType: OrderType;
  onOrderTypeChange: (value: OrderType) => void;
  tableNumber: string;
  onTableNumberChange: (value: string) => void;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (value: PaymentMethod) => void;
  cashReceived: string;
  cashReceivedAmount: number;
  onCashReceivedChange: (value: string) => void;
  changeDue: number;
  remainingBalance: number;
  canCompletePayment: boolean;
  blockerMessage: string | null;
  onClose: () => void;
  onConfirm: () => void;
  onUseExactCashAmount: () => void;
}

const confirmLabels: Record<PaymentMethod, string> = {
  cash: "Confirm Cash Payment",
  qris: "Mark QRIS as Paid",
  ewallet: "Mark E-Wallet as Paid",
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "Cash",
  qris: "QRIS",
  ewallet: "E-Wallet",
};

export function CheckoutSheet({
  isOpen,
  itemCount,
  subtotal,
  discountAmount,
  tax,
  total,
  orderType,
  onOrderTypeChange,
  tableNumber,
  onTableNumberChange,
  paymentMethod,
  onPaymentMethodChange,
  cashReceived,
  cashReceivedAmount,
  onCashReceivedChange,
  changeDue,
  remainingBalance,
  canCompletePayment,
  blockerMessage,
  onClose,
  onConfirm,
  onUseExactCashAmount,
}: CheckoutSheetProps) {
  if (!isOpen) {
    return null;
  }

  const showTableInput = orderType === "dine_in";
  const isCashPayment = paymentMethod === "cash";
  const formattedCashReceived = cashReceivedAmount > 0 ? formatRupiah(cashReceivedAmount) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 lg:items-center lg:p-6">
      <div className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] lg:max-h-[calc(100vh-3rem)] lg:p-6">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#8B572A]">Checkout</p>
              <h2 className="text-2xl font-semibold text-stone-900">Finalize this order</h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-stone-200"
              aria-label="Close checkout"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="space-y-4">
                <section className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Order Setup
                  </p>
                  <OrderTypeTabs value={orderType} onChange={onOrderTypeChange} className="mt-3" />

                  {showTableInput ? (
                    <TableInput
                      value={tableNumber}
                      onChange={onTableNumberChange}
                      className="mt-4"
                    />
                  ) : (
                    <p className="mt-4 rounded-2xl border border-dashed border-stone-300 px-4 py-3 text-sm text-stone-500">
                      No table number is needed for {orderType === "takeaway" ? "takeaway" : "delivery"} orders.
                    </p>
                  )}
                </section>

                <section className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
                  <PaymentMethodSelector value={paymentMethod} onChange={onPaymentMethodChange} />

                  {isCashPayment ? (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-xs font-medium text-stone-500">Uang Diterima</label>
                        <button
                          type="button"
                          onClick={onUseExactCashAmount}
                          className="rounded-full bg-stone-200 px-3 py-1 text-[11px] font-semibold text-stone-700 transition hover:bg-stone-300"
                        >
                          Uang Pas
                        </button>
                      </div>
                      <input
                        value={formattedCashReceived}
                        onChange={(event) => onCashReceivedChange(event.target.value)}
                        inputMode="numeric"
                        placeholder="Masukkan uang diterima"
                        className="h-11 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm font-medium outline-none placeholder:text-stone-400"
                      />

                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span>{remainingBalance > 0 ? "Kurang Bayar" : "Kembalian"}</span>
                        <span className="font-semibold text-stone-700">
                          {formatRupiah(remainingBalance > 0 ? remainingBalance : changeDue)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 rounded-2xl border border-dashed border-stone-300 px-4 py-3 text-sm text-stone-500">
                      Confirm the digital payment after the customer completes it on their device.
                    </p>
                  )}
                </section>
              </div>

              <section className="rounded-3xl border border-stone-200 bg-[#FBFAF8] p-4 lg:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                      Summary
                    </p>
                    <h3 className="text-lg font-semibold text-stone-900">Order total</h3>
                  </div>

                  <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600 shadow-sm">
                    {itemCount} item{itemCount === 1 ? "" : "s"}
                  </div>
                </div>

                <CartSummary
                  subtotal={subtotal}
                  discount={discountAmount}
                  tax={tax}
                  total={total}
                />

                <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-stone-600 shadow-sm">
                  <span className="font-medium text-stone-500">Payment method</span>
                  <p className="mt-1 font-semibold text-stone-800">
                    {paymentMethodLabels[paymentMethod]}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={!canCompletePayment}
                    aria-disabled={!canCompletePayment}
                    className="h-12 w-full rounded-2xl bg-[#8B572A] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-stone-300"
                  >
                    {confirmLabels[paymentMethod]}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="h-11 w-full rounded-2xl border border-stone-200 bg-white text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
                  >
                    Cancel
                  </button>

                  {blockerMessage ? (
                    <p className="rounded-2xl bg-[#FDECEC] px-4 py-3 text-xs text-[#9A2B2B]">
                      {blockerMessage}
                    </p>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
