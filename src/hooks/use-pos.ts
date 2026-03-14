"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { initialCart, menuItems } from "@/data/pos-data";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import type {
  CartItem,
  CompletedOrder,
  CompletedOrderItem,
  HeldOrder,
  MenuItem,
  OrderType,
  PaymentMethod,
  PosAlert,
} from "@/types/pos";

const DISCOUNT_RATE = 0.1;
const TAX_RATE = 0.1;

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "Tunai",
  qris: "QRIS",
  ewallet: "E-Wallet",
};

const paymentProviders: Record<PaymentMethod, string> = {
  cash: "Laci Kasir A1",
  qris: "QRIS Dinamis",
  ewallet: "SisiPay Wallet",
};

const paymentStatuses: Record<PaymentMethod, string> = {
  cash: "Diterima",
  qris: "Lunas",
  ewallet: "Lunas",
};

function createReference(prefix: string) {
  const timestamp = new Date().toISOString().slice(11, 19).replaceAll(":", "");
  const random = Math.floor(Math.random() * 900 + 100);

  return `${prefix}-${timestamp}${random}`;
}

function parseAmount(value: string) {
  const digitsOnly = value.replace(/[^\d]/g, "");
  return digitsOnly.length === 0 ? 0 : Number.parseInt(digitsOnly, 10);
}

function createCompletedItems(items: CartItem[]): CompletedOrderItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    qty: item.qty,
    price: item.price,
    variant: item.variant,
  }));
}

export function usePos() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>("dine_in");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [discountRate, setDiscountRate] = useState(0);
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentFinishedOpen, setPaymentFinishedOpen] = useState(false);
  const [cashReceived, setCashReceived] = useState("");
  const [alert, setAlert] = useState<PosAlert | null>(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<CompletedOrder | null>(null);

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCategory =
        selectedCategory === "all" ||
        selectedCategory === "more" ||
        item.category === selectedCategory;

      const keyword = search.trim().toLowerCase();
      const matchSearch = keyword.length === 0 || item.name.toLowerCase().includes(keyword);

      return matchCategory && matchSearch;
    });
  }, [search, selectedCategory]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const discountAmount = useMemo(() => subtotal * discountRate, [discountRate, subtotal]);
  const taxableSubtotal = useMemo(
    () => Math.max(subtotal - discountAmount, 0),
    [discountAmount, subtotal]
  );
  const tax = useMemo(() => taxableSubtotal * TAX_RATE, [taxableSubtotal]);
  const total = useMemo(() => taxableSubtotal + tax, [tax, taxableSubtotal]);
  const cashReceivedAmount = useMemo(() => parseAmount(cashReceived), [cashReceived]);
  const changeDue = useMemo(
    () => Math.max(cashReceivedAmount - total, 0),
    [cashReceivedAmount, total]
  );
  const remainingBalance = useMemo(
    () => Math.max(total - cashReceivedAmount, 0),
    [cashReceivedAmount, total]
  );
  const hasDiscount = discountRate > 0;
  const heldOrderCount = heldOrders.length;
  const requiresTableNumber = selectedOrderType === "dine_in";
  const hasTableNumber = tableNumber.trim().length > 0;
  const isOrderReady = cart.length > 0 && (!requiresTableNumber || hasTableNumber);
  const canCompletePayment =
    isOrderReady && (paymentMethod !== "cash" || cashReceivedAmount >= total);
  const checkoutBlockerMessage = useMemo(() => {
    if (cart.length === 0) {
      return "Tambahkan menu ke keranjang sebelum memproses pembayaran.";
    }

    if (requiresTableNumber && !hasTableNumber) {
      return "Masukkan nomor meja untuk pesanan dine-in.";
    }

    if (paymentMethod === "cash" && cashReceivedAmount < total) {
      const missingAmount = Math.max(total - cashReceivedAmount, 0);

      if (cashReceivedAmount === 0) {
        return "Masukkan uang diterima atau gunakan tombol uang pas.";
      }

      return `Uang diterima masih kurang ${formatRupiah(missingAmount)}.`;
    }

    return null;
  }, [cart.length, cashReceivedAmount, hasTableNumber, paymentMethod, requiresTableNumber, total]);

  useEffect(() => {
    if (paymentMethod !== "cash") {
      setCashReceived("");
    }
  }, [paymentMethod]);

  useEffect(() => {
    if (selectedOrderType !== "dine_in") {
      setTableNumber("");
    }
  }, [selectedOrderType]);

  useEffect(() => {
    if (cart.length > 0) {
      return;
    }

    setDiscountRate(0);
    setCashReceived("");
    setCheckoutOpen(false);
  }, [cart.length]);

  const dismissAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const showAlert = useCallback((nextAlert: PosAlert) => {
    setAlert(nextAlert);
  }, []);

  const validateCart = useCallback(() => {
    if (cart.length === 0) {
      showAlert({
        tone: "error",
        title: "Keranjang kosong",
        message: "Tambahkan menu terlebih dahulu sebelum lanjut ke pembayaran.",
      });
      return false;
    }

    return true;
  }, [cart.length, showAlert]);

  const validateOrderSetup = useCallback(() => {
    if (!validateCart()) {
      return false;
    }

    if (requiresTableNumber && !hasTableNumber) {
      showAlert({
        tone: "error",
        title: "Nomor meja wajib diisi",
        message: "Masukkan nomor meja untuk pesanan makan di tempat sebelum checkout.",
      });
      return false;
    }

    return true;
  }, [hasTableNumber, requiresTableNumber, showAlert, validateCart]);

  const addToCart = useCallback(
    (item: MenuItem, variant: string) => {
      const cartKey = `${item.id}-${variant.toLowerCase()}`;

      setCart((prev) => {
        const existing = prev.find((cartItem) => cartItem.cartKey === cartKey);

        if (existing) {
          return prev.map((cartItem) =>
            cartItem.cartKey === cartKey ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
          );
        }

        return [
          ...prev,
          {
            cartKey,
            id: item.id,
            name: item.name,
            price: item.price,
            qty: 1,
            image: item.image,
            variant,
          },
        ];
      });
    },
    []
  );

  const increaseQty = useCallback((cartKey: string) => {
    setCart((prev) =>
      prev.map((item) => (item.cartKey === cartKey ? { ...item, qty: item.qty + 1 } : item))
    );
  }, []);

  const decreaseQty = useCallback((cartKey: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey ? { ...item, qty: Math.max(item.qty - 1, 0) } : item
        )
        .filter((item) => item.qty > 0)
    );
  }, []);

  const removeItem = useCallback((cartKey: string) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleDiscount = useCallback(() => {
    if (cart.length === 0) {
      showAlert({
        tone: "error",
        title: "Diskon belum bisa dipakai",
        message: "Tambahkan menu ke keranjang sebelum memberi diskon.",
      });
      return;
    }

    if (hasDiscount) {
      setDiscountRate(0);
      showAlert({
        tone: "info",
        title: "Diskon dihapus",
        message: "Diskon manual 10% sudah dilepas dari pesanan ini.",
      });
      return;
    }

    setDiscountRate(DISCOUNT_RATE);
    showAlert({
      tone: "success",
      title: "Diskon diterapkan",
      message: "Diskon manual 10% sudah ditambahkan ke pesanan ini.",
    });
  }, [cart.length, hasDiscount, showAlert]);

  const holdOrder = useCallback(() => {
    if (cart.length === 0) {
      const [nextHeldOrder, ...remainingHeldOrders] = heldOrders;

      if (!nextHeldOrder) {
        showAlert({
          tone: "info",
          title: "Belum ada pesanan ditahan",
          message: "Tahan pesanan dulu, lalu gunakan tombol ini lagi untuk memanggilnya.",
        });
        return;
      }

      setHeldOrders(remainingHeldOrders);
      setCart(nextHeldOrder.items);
      setDiscountRate(nextHeldOrder.discountRate);
      setSelectedOrderType(nextHeldOrder.orderType);
      setTableNumber(nextHeldOrder.tableNumber);
      setPaymentMethod(nextHeldOrder.paymentMethod);
      setCheckoutOpen(false);
      setCashReceived("");
      showAlert({
        tone: "success",
        title: "Pesanan ditampilkan lagi",
        message: `${nextHeldOrder.id} siap dilanjutkan.`,
      });
      return;
    }

    const heldOrderId = createReference("HOLD");

    setHeldOrders((prev) => [
      {
        id: heldOrderId,
        items: cart.map((item) => ({ ...item })),
        discountRate,
        orderType: selectedOrderType,
        tableNumber,
        paymentMethod,
      },
      ...prev,
    ]);
    setCart([]);
    setCheckoutOpen(false);
    setCashReceived("");
    showAlert({
      tone: "info",
      title: "Pesanan ditahan",
      message: `${itemCount} item disimpan sebagai ${heldOrderId}.`,
    });
  }, [
    cart,
    discountRate,
    heldOrders,
    itemCount,
    paymentMethod,
    selectedOrderType,
    showAlert,
    tableNumber,
  ]);

  const openCheckout = useCallback(() => {
    if (!validateCart()) {
      return;
    }

    setCheckoutOpen(true);
    setAlert(null);
  }, [validateCart]);

  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false);
    setCashReceived("");
  }, []);

  const closeFinishedPayment = useCallback(() => {
    setPaymentFinishedOpen(false);
  }, []);

  const updateCashReceived = useCallback((value: string) => {
    setCashReceived(value.replace(/[^\d]/g, ""));
  }, []);

  const useExactCashAmount = useCallback(() => {
    setCashReceived(String(Math.round(total)));
  }, [total]);

  const completePayment = useCallback(() => {
    if (!validateOrderSetup()) {
      return;
    }

    if (paymentMethod === "cash" && cashReceivedAmount < total) {
      showAlert({
        tone: "error",
        title: "Uang belum cukup",
        message: "Masukkan jumlah uang yang diterima sebelum mengonfirmasi pembayaran.",
      });
      return;
    }

    const orderNumber = createReference("ORD");
    const paymentReference =
      paymentMethod === "cash" ? createReference("CASH") : createReference("PAY");

    setLastCompletedOrder({
      orderNumber,
      subtotal,
      discountAmount,
      tax,
      total,
      itemCount,
      items: createCompletedItems(cart),
      paymentMethod,
      orderType: selectedOrderType,
      tableNumber,
      cashReceived: paymentMethod === "cash" ? cashReceivedAmount : total,
      changeDue: paymentMethod === "cash" ? changeDue : 0,
      paymentReference,
      paymentProvider: paymentProviders[paymentMethod],
      paymentStatus: paymentStatuses[paymentMethod],
      completedAt: new Date().toISOString(),
    });
    setPaymentFinishedOpen(true);
    setCart([]);
    setTableNumber("");
    setCheckoutOpen(false);
    setCashReceived("");
    setDiscountRate(0);
    setPaymentMethod("cash");
    setSelectedOrderType("dine_in");
    showAlert({
      tone: "success",
      title: "Pembayaran selesai",
      message: `${orderNumber} dibayar dengan ${paymentMethodLabels[paymentMethod]}.`,
    });
  }, [
    cart,
    cashReceivedAmount,
    changeDue,
    discountAmount,
    itemCount,
    paymentMethod,
    selectedOrderType,
    showAlert,
    subtotal,
    tableNumber,
    tax,
    total,
    validateOrderSetup,
  ]);

  return {
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
    setCashReceived: updateCashReceived,
    useExactCashAmount,
    completePayment,
    dismissAlert,
  };
}
