import type { EmployeeItem } from "@/types/pos";

export const employeeItems: EmployeeItem[] = [
  {
    id: "EMP-000",
    name: "Owner Sisi Kopi",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    role: "Owner",
    shift: "Owner Access",
    schedule: "Flexible Access",
    status: "Aktif",
    phone: "0812-0000-1111",
    username: "owner.sisikopi",
    pinCode: "112233",
    lastLogin: "15 Mar 2026, 06:45",
  },
  {
    id: "EMP-001",
    name: "Kasir A",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    role: "Cashier",
    shift: "Shift 1",
    schedule: "08:00 - 16:00",
    status: "Aktif",
    phone: "0812-3456-7890",
    username: "kasir.a",
    pinCode: "120901",
    lastLogin: "15 Mar 2026, 08:02",
  },
  {
    id: "EMP-002",
    name: "Kasir B",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    role: "Cashier",
    shift: "Shift 2",
    schedule: "16:00 - 23:00",
    status: "Aktif",
    phone: "0812-2222-3333",
    username: "kasir.b",
    pinCode: "778811",
    lastLogin: "14 Mar 2026, 16:05",
  },
  {
    id: "EMP-003",
    name: "Barista A",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    role: "Barista",
    shift: "Shift 1",
    schedule: "07:00 - 15:00",
    status: "Aktif",
    phone: "0813-1111-2222",
    username: "barista.a",
    pinCode: "456123",
    lastLogin: "15 Mar 2026, 07:11",
  },
  {
    id: "EMP-004",
    name: "Supervisor",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    role: "Admin",
    shift: "Full Day",
    schedule: "09:00 - 18:00",
    status: "Cuti",
    phone: "0813-9999-0000",
    username: "supervisor",
    pinCode: "990011",
    lastLogin: "13 Mar 2026, 09:00",
  },
];

export const salesOverview = {
  dateLabel: "15 Maret 2026",
  grossRevenue: 4850000,
  netRevenue: 4410000,
  transactionCount: 126,
  averageOrder: 38500,
} as const;

export const salesByPaymentMethod = [
  {
    id: "cash",
    label: "Tunai",
    total: 1920000,
    percentage: 40,
  },
  {
    id: "qris",
    label: "QRIS",
    total: 2230000,
    percentage: 46,
  },
  {
    id: "ewallet",
    label: "E-Wallet",
    total: 700000,
    percentage: 14,
  },
] as const;

export const bestSellingMenus = [
  {
    id: "MENU-001",
    name: "Cappuccino",
    sold: 42,
    revenue: 1050000,
  },
  {
    id: "MENU-002",
    name: "Caffe Latte",
    sold: 38,
    revenue: 1064000,
  },
  {
    id: "MENU-003",
    name: "Americano",
    sold: 29,
    revenue: 638000,
  },
] as const;

export const storeSettings = {
  storeName: "Sisi Kopi",
  branchName: "Main Store",
  storeAddress: "Jl. Kopi No. 12, Jakarta",
  taxRateLabel: "10%",
  serviceChargeLabel: "0%",
  receiptFooter: "Terima kasih sudah berkunjung ke Sisi Kopi.",
  openHours: "07:00 - 23:00",
  posMode: "Dummy Local Data",
  syncStatus: "Belum terhubung ke backend",
} as const;
