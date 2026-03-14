import type { ReactNode } from "react";
import { CreditCard, QrCode, Wallet } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { PaymentMethod } from "@/types/pos";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

function PaymentButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-14 flex-1 flex-col items-center justify-center rounded-2xl border text-xs font-medium transition",
        active
          ? "border-[#8B572A] bg-[#8B572A] text-white"
          : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
      )}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </button>
  );
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium text-stone-500">Payment Method</p>

      <div className="flex gap-3">
        <PaymentButton
          active={value === "cash"}
          label="Cash"
          icon={<CreditCard size={15} />}
          onClick={() => onChange("cash")}
        />

        <PaymentButton
          active={value === "qris"}
          label="QRIS"
          icon={<QrCode size={15} />}
          onClick={() => onChange("qris")}
        />

        <PaymentButton
          active={value === "ewallet"}
          label="E-Wallet"
          icon={<Wallet size={15} />}
          onClick={() => onChange("ewallet")}
        />
      </div>
    </div>
  );
}
