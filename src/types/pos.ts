import type { LucideIcon } from "lucide-react";

export type PaymentMethod = "cash" | "qris" | "ewallet";
export type OrderType = "dine_in" | "takeaway" | "delivery";

export interface CategoryItem {
  id: string;
  label: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
}

export interface CartItem {
  cartKey: string;
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
  variant: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

export interface HeldOrder {
  id: string;
  items: CartItem[];
  discountRate: number;
  orderType: OrderType;
  tableNumber: string;
  paymentMethod: PaymentMethod;
}

export interface CompletedOrderItem {
  id: number;
  name: string;
  qty: number;
  price: number;
  variant: string;
}

export interface CompletedOrder {
  orderNumber: string;
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  itemCount: number;
  items: CompletedOrderItem[];
  paymentMethod: PaymentMethod;
  orderType: OrderType;
  tableNumber: string;
  cashReceived: number;
  changeDue: number;
  paymentReference: string;
  paymentProvider: string;
  paymentStatus: string;
  completedAt: string;
}

export interface PosAlert {
  tone: "success" | "error" | "info";
  title: string;
  message: string;
}
