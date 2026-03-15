import type { LucideIcon } from "lucide-react";

export type PaymentMethod = "cash" | "qris" | "ewallet";
export type OrderType = "dine_in" | "takeaway" | "delivery";
export type SidebarSection = "orders" | "transactions" | "reports" | "employees" | "settings";
export type EmployeeRole = "Owner" | "Admin" | "Cashier" | "Barista";
export type EmployeeStatus = "Aktif" | "Nonaktif" | "Cuti";

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
  isAvailable: boolean;
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
  id: SidebarSection;
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

export interface MenuFormValues {
  name: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  isAvailable: boolean;
}

export interface EmployeeItem {
  id: string;
  name: string;
  image: string;
  role: EmployeeRole;
  shift: string;
  schedule: string;
  status: EmployeeStatus;
  phone: string;
  username: string;
  pinCode: string;
  lastLogin: string;
}

export interface EmployeeFormValues {
  name: string;
  image: string;
  role: EmployeeRole;
  shift: string;
  schedule: string;
  status: EmployeeStatus;
  phone: string;
  username: string;
  pinCode: string;
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
