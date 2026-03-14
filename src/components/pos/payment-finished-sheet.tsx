"use client";

import { ArrowLeft, CheckCircle2, Printer, QrCode, ReceiptText, Wallet, X } from "lucide-react";
import { CartSummary } from "@/components/pos/cart-summary";
import { cn } from "@/lib/utils/cn";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import type { CompletedOrder, PaymentMethod } from "@/types/pos";

interface PaymentFinishedSheetProps {
  isOpen: boolean;
  order: CompletedOrder | null;
  onClose: () => void;
}

const paymentMethodConfig: Record<
  PaymentMethod,
  {
    label: string;
    title: string;
    description: string;
    icon: typeof Wallet;
    accentClassName: string;
  }
> = {
  cash: {
    label: "Tunai",
    title: "Pembayaran tunai selesai",
    description: "Uang tunai sudah diterima dan kembalian bisa langsung diberikan ke pelanggan.",
    icon: ReceiptText,
    accentClassName: "bg-[#F4E7D9] text-[#8B572A]",
  },
  qris: {
    label: "QRIS",
    title: "Pembayaran QRIS berhasil",
    description: "Transaksi QRIS sudah diverifikasi dan ditandai lunas.",
    icon: QrCode,
    accentClassName: "bg-[#E5F5EE] text-[#176B43]",
  },
  ewallet: {
    label: "E-Wallet",
    title: "Pembayaran e-wallet berhasil",
    description: "Transaksi e-wallet sudah tercatat dan berhasil diproses.",
    icon: Wallet,
    accentClassName: "bg-[#EBF1FF] text-[#3452A5]",
  },
};

const orderTypeLabels = {
  dine_in: "Makan di Tempat",
  takeaway: "Bawa Pulang",
  delivery: "Delivery",
} as const;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function DetailRow({
  label,
  value,
  labelClassName,
  valueClassName,
}: {
  label: string;
  value: string;
  labelClassName?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className={cn("text-stone-500", labelClassName)}>{label}</span>
      <span className={cn("text-right font-semibold text-stone-800", valueClassName)}>
        {value}
      </span>
    </div>
  );
}

export function PaymentFinishedSheet({
  isOpen,
  order,
  onClose,
}: PaymentFinishedSheetProps) {
  if (!isOpen || !order) {
    return null;
  }

  const methodConfig = paymentMethodConfig[order.paymentMethod];
  const MethodIcon = methodConfig.icon;
  const orderTypeLabel = orderTypeLabels[order.orderType];
  const completedAt = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(order.completedAt));

  const handlePrintReceipt = () => {
    const receiptWindow = window.open("", "_blank", "width=420,height=760");

    if (!receiptWindow) {
      return;
    }

    const itemMarkup = order.items
      .map(
        (item) => `
          <tr>
            <td>
              <div class="item-name">${escapeHtml(item.name)}</div>
              <div class="item-meta">${escapeHtml(item.variant)} x ${item.qty}</div>
            </td>
            <td class="item-price">${formatRupiah(item.price * item.qty)}</td>
          </tr>
        `
      )
      .join("");

    const paymentDetailMarkup =
      order.paymentMethod === "cash"
        ? `
          <div class="detail-row">
            <span>Uang diterima</span>
            <strong>${formatRupiah(order.cashReceived)}</strong>
          </div>
          <div class="detail-row">
            <span>Uang kembalian</span>
            <strong>${formatRupiah(order.changeDue)}</strong>
          </div>
        `
        : `
          <div class="detail-row">
            <span>Status</span>
            <strong>${escapeHtml(order.paymentStatus)}</strong>
          </div>
          <div class="detail-row">
            <span>Referensi</span>
            <strong>${escapeHtml(order.paymentReference)}</strong>
          </div>
        `;

    const receiptMarkup = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <title>Struk ${escapeHtml(order.orderNumber)}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 24px;
              font-family: "Segoe UI", Arial, sans-serif;
              background: #f6f1ea;
              color: #292524;
            }
            .receipt {
              max-width: 360px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 24px;
              padding: 24px;
              box-shadow: 0 18px 50px rgba(41, 37, 36, 0.12);
            }
            .brand {
              text-align: center;
              padding-bottom: 16px;
              border-bottom: 1px dashed #d6d3d1;
            }
            .brand h1 {
              margin: 0;
              font-size: 24px;
              color: #8b572a;
            }
            .brand p {
              margin: 6px 0 0;
              font-size: 12px;
              color: #78716c;
            }
            .section {
              margin-top: 18px;
            }
            .section-title {
              margin: 0 0 10px;
              font-size: 11px;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: #a8a29e;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              margin-top: 8px;
              font-size: 13px;
            }
            .detail-row strong {
              text-align: right;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td {
              padding: 10px 0;
              border-bottom: 1px dashed #e7e5e4;
              vertical-align: top;
              font-size: 13px;
            }
            .item-name {
              font-weight: 600;
              color: #292524;
            }
            .item-meta {
              margin-top: 2px;
              font-size: 12px;
              color: #78716c;
            }
            .item-price {
              text-align: right;
              font-weight: 600;
              white-space: nowrap;
            }
            .summary {
              margin-top: 14px;
              padding-top: 4px;
            }
            .summary .detail-row {
              margin-top: 10px;
            }
            .change-box {
              margin-top: 16px;
              padding: 14px 16px;
              border-radius: 18px;
              background: #fff7ef;
              border: 1px solid #ead7c3;
            }
            .change-box p {
              margin: 0;
            }
            .change-label {
              font-size: 11px;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: #8b572a;
            }
            .change-value {
              margin-top: 8px !important;
              font-size: 24px;
              font-weight: 700;
              color: #1c1917;
            }
            .footer {
              margin-top: 20px;
              padding-top: 14px;
              border-top: 1px dashed #d6d3d1;
              text-align: center;
              font-size: 12px;
              color: #78716c;
            }
            @media print {
              body {
                background: #ffffff;
                padding: 0;
              }
              .receipt {
                box-shadow: none;
                border-radius: 0;
                max-width: none;
              }
            }
          </style>
        </head>
        <body>
          <main class="receipt">
            <header class="brand">
              <h1>Sisi Kopi</h1>
              <p>Struk pembayaran selesai</p>
            </header>

            <section class="section">
              <p class="section-title">Informasi Pesanan</p>
              <div class="detail-row">
                <span>Nomor order</span>
                <strong>${escapeHtml(order.orderNumber)}</strong>
              </div>
              <div class="detail-row">
                <span>Metode</span>
                <strong>${escapeHtml(methodConfig.label)}</strong>
              </div>
              <div class="detail-row">
                <span>Status</span>
                <strong>${escapeHtml(order.paymentStatus)}</strong>
              </div>
              <div class="detail-row">
                <span>Jenis pesanan</span>
                <strong>${escapeHtml(orderTypeLabel)}</strong>
              </div>
              ${
                order.tableNumber
                  ? `<div class="detail-row"><span>Meja</span><strong>${escapeHtml(order.tableNumber)}</strong></div>`
                  : ""
              }
              <div class="detail-row">
                <span>Waktu</span>
                <strong>${escapeHtml(completedAt)}</strong>
              </div>
            </section>

            <section class="section">
              <p class="section-title">Item Pesanan</p>
              <table>
                <tbody>${itemMarkup}</tbody>
              </table>
            </section>

            <section class="section summary">
              <p class="section-title">Rincian Pembayaran</p>
              <div class="detail-row">
                <span>Subtotal</span>
                <strong>${formatRupiah(order.subtotal)}</strong>
              </div>
              <div class="detail-row">
                <span>Diskon</span>
                <strong>${formatRupiah(order.discountAmount)}</strong>
              </div>
              <div class="detail-row">
                <span>Pajak</span>
                <strong>${formatRupiah(order.tax)}</strong>
              </div>
              <div class="detail-row">
                <span>Total dibayar</span>
                <strong>${formatRupiah(order.total)}</strong>
              </div>
              ${paymentDetailMarkup}
            </section>

            ${
              order.paymentMethod === "cash"
                ? `
                  <section class="change-box">
                    <p class="change-label">Uang Kembalian</p>
                    <p class="change-value">${formatRupiah(order.changeDue)}</p>
                    <p>${order.changeDue > 0 ? "Berikan nominal ini kepada pelanggan." : "Pembayaran pas."}</p>
                  </section>
                `
                : ""
            }

            <footer class="footer">
              Terima kasih sudah menggunakan Sisi Kopi POS.
            </footer>
          </main>
        </body>
      </html>
    `;

    receiptWindow.document.open();
    receiptWindow.document.write(receiptMarkup);
    receiptWindow.document.close();
    receiptWindow.focus();
    receiptWindow.onload = () => {
      receiptWindow.print();
      receiptWindow.onafterprint = () => receiptWindow.close();
    };
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-3 lg:items-center lg:p-6">
      <div className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[34px] bg-[#FCFAF7] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.2)] lg:max-h-[calc(100vh-3rem)] lg:p-6">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7F6EC] text-[#187241]">
                <CheckCircle2 size={28} />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8B572A]">
                  Pembayaran Selesai
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-stone-900">{methodConfig.title}</h2>
                <p className="mt-2 max-w-2xl text-sm text-stone-500">{methodConfig.description}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup ringkasan pembayaran selesai"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-stone-500 shadow-sm transition hover:bg-stone-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
              <div className="space-y-4">
                <section className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                          methodConfig.accentClassName
                        )}
                      >
                        <MethodIcon size={14} />
                        {methodConfig.label}
                      </span>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <DetailRow label="Nomor order" value={order.orderNumber} />
                      <DetailRow label="Referensi pembayaran" value={order.paymentReference} />
                      <DetailRow label="Waktu selesai" value={completedAt} />
                      <DetailRow label="Penyedia" value={order.paymentProvider} />
                      <DetailRow label="Jenis pesanan" value={orderTypeLabel} />
                      {order.tableNumber ? <DetailRow label="Meja" value={order.tableNumber} /> : null}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-[#8B572A] p-5 text-white shadow-sm">
                    <p className="text-sm font-medium text-white/80">Total Dibayar</p>
                    <p className="mt-2 text-3xl font-semibold">{formatRupiah(order.total)}</p>
                    <p className="mt-2 text-sm text-white/80">
                      {order.itemCount} item tercatat pada transaksi ini.
                    </p>

                    <div className="mt-5 rounded-2xl bg-white/12 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                        Detail Metode
                      </p>
                      <div className="mt-3 space-y-2 text-sm">
                        {order.paymentMethod === "cash" ? (
                          <>
                            <DetailRow
                              label="Uang diterima"
                              value={formatRupiah(order.cashReceived)}
                              labelClassName="text-white/70"
                              valueClassName="text-white"
                            />
                            <DetailRow
                              label="Uang yang harus dikembalikan"
                              value={formatRupiah(order.changeDue)}
                              labelClassName="text-white/70"
                              valueClassName="text-white"
                            />
                          </>
                        ) : (
                          <>
                            <DetailRow
                              label="Nominal berhasil"
                              value={formatRupiah(order.total)}
                              labelClassName="text-white/70"
                              valueClassName="text-white"
                            />
                            <DetailRow
                              label="Referensi persetujuan"
                              value={order.paymentReference}
                              labelClassName="text-white/70"
                              valueClassName="text-white"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                        {order.paymentMethod === "cash" ? "Ringkasan Kembalian" : "Status Pembayaran"}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {order.paymentMethod === "cash"
                          ? formatRupiah(order.changeDue)
                          : order.paymentStatus}
                      </p>
                      <p className="mt-1 text-sm text-white/80">
                        {order.paymentMethod === "cash"
                          ? order.changeDue > 0
                            ? "Berikan nominal ini kepada pelanggan sebagai uang kembalian."
                            : "Pembayaran pas, tidak ada uang yang harus dikembalikan."
                          : "Pembayaran non-tunai tidak membutuhkan uang kembalian."}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                        Item Pesanan
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-stone-900">Menu Dibeli</h3>
                    </div>

                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                      {order.itemCount} item
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={`${order.orderNumber}-${item.id}-${item.variant}`}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-stone-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-stone-500">
                            {item.variant} • {formatRupiah(item.price)} x {item.qty}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm font-semibold text-[#8B572A]">
                          {formatRupiah(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                  Ringkasan Pembayaran
                </p>
                <h3 className="mt-1 text-lg font-semibold text-stone-900">Rincian Pembayaran</h3>

                <div className="mt-4 rounded-3xl bg-stone-50 p-4">
                  <CartSummary
                    subtotal={order.subtotal}
                    discount={order.discountAmount}
                    tax={order.tax}
                    total={order.total}
                  />
                </div>

                {order.paymentMethod === "cash" ? (
                  <div className="mt-4 rounded-3xl border border-[#E9D8C5] bg-[#FFF7EF] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B572A]">
                      Uang Kembalian
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-stone-900">
                      {formatRupiah(order.changeDue)}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {order.changeDue > 0
                        ? "Nominal ini yang perlu dikembalikan ke pelanggan."
                        : "Pembayaran pas, jadi tidak ada uang kembalian."}
                    </p>
                  </div>
                ) : null}

                <div className="mt-4 space-y-3 rounded-3xl border border-stone-200 p-4">
                  <DetailRow label="Metode pembayaran" value={methodConfig.label} />
                  <DetailRow label="Status" value={order.paymentStatus} />
                  <DetailRow label="Penyedia" value={order.paymentProvider} />
                  {order.paymentMethod === "cash" ? (
                    <>
                      <DetailRow label="Uang diterima" value={formatRupiah(order.cashReceived)} />
                      <DetailRow
                        label="Uang yang harus dikembalikan"
                        value={formatRupiah(order.changeDue)}
                      />
                    </>
                  ) : (
                    <DetailRow label="Referensi" value={order.paymentReference} />
                  )}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#8B572A] text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    <Printer size={16} />
                    Print Struk
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                  >
                    <ArrowLeft size={16} />
                    Kembali ke Menu
                  </button>
                </div>

                <p className="mt-3 text-center text-xs text-stone-400">
                  Ringkasan ini tetap bisa dibuka lagi dari panel pembayaran di atas.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
