import { BarChart3, ReceiptText, Settings, ShoppingBag } from "lucide-react";
import type { CartItem, CategoryItem, MenuItem, OrderType, SidebarItem } from "@/types/pos";

export const categories: CategoryItem[] = [
  { id: "all", label: "All" },
  { id: "coffee", label: "Coffee" },
  { id: "non-coffee", label: "Non-Coffee" },
  { id: "pastries", label: "Pastries" },
  { id: "snacks", label: "Snacks" },
  { id: "more", label: "..." },
];

export const orderTypes: Array<{ value: OrderType; label: string }> = [
  { value: "dine_in", label: "Dine In" },
  { value: "takeaway", label: "Takeaway" },
  { value: "delivery", label: "Delivery" },
];

export const sidebarItems: SidebarItem[] = [
  { id: "orders", label: "Orders", icon: ShoppingBag, active: true },
  { id: "transactions", label: "Transactions", icon: ReceiptText },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Espresso",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=80",
    category: "coffee",
    tags: ["Hot", "Ice"],
  },
  {
    id: 2,
    name: "Cappuccino",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    category: "coffee",
    tags: ["Hot", "Ice"],
  },
  {
    id: 3,
    name: "Caffe Latte",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=900&q=80",
    category: "coffee",
    tags: ["Hot", "Ice"],
  },
  {
    id: 4,
    name: "Flat White",
    price: 30000,
    image:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=900&q=80",
    category: "coffee",
    tags: ["Hot", "Ice"],
  },
  {
    id: 5,
    name: "Mocha",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80",
    category: "coffee",
    tags: ["Hot", "Ice"],
  },
  {
    id: 6,
    name: "Americano",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&w=900&q=80",
    category: "coffee",
    tags: ["Hot", "Ice"],
  },
  {
    id: 7,
    name: "Matcha Latte",
    price: 30000,
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80",
    category: "non-coffee",
    tags: ["Hot", "Ice"],
  },
  {
    id: 8,
    name: "Hot Chocolate",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=900&q=80",
    category: "non-coffee",
    tags: ["Hot", "Ice"],
  },
];

export const initialCart: CartItem[] = [
  {
    cartKey: "2-hot",
    id: 2,
    name: "Cappuccino",
    price: 25000,
    qty: 2,
    image: menuItems[1].image,
    variant: "Hot",
  },
  {
    cartKey: "3-ice",
    id: 3,
    name: "Caffe Latte",
    price: 28000,
    qty: 1,
    image: menuItems[2].image,
    variant: "Ice",
  },
];
