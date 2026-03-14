import type { ReactNode } from "react";
import { CreditCard, QrCode, Wallet } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { PaymentMethod } from "@/types/pos";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  compact?: boolean;
}

function PaymentButton({
  active,
  label,
  icon,
  onClick,
  compact = false,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center justify-center border font-medium transition",
        compact ? "h-11 rounded-xl text-[11px]" : "h-14 rounded-2xl text-xs",
        active
          ? "border-[#8B572A] bg-[#8B572A] text-white"
          : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
      )}
    >
      {icon}
      <span className={cn(compact ? "mt-0.5" : "mt-1")}>{label}</span>
    </button>
  );
}

export function PaymentMethodSelector({
  value,
  onChange,
  compact = false,
}: PaymentMethodSelectorProps) {
  return (
    <div>
      <p className={cn("font-medium text-stone-500", compact ? "mb-2 text-[11px]" : "mb-3 text-xs")}>
        Metode Pembayaran
      </p>

      <div className={cn("flex", compact ? "gap-2" : "gap-3")}>
        <PaymentButton
          active={value === "cash"}
          label="Tunai"
          icon={<CreditCard size={compact ? 14 : 15} />}
          onClick={() => onChange("cash")}
          compact={compact}
        />

        <PaymentButton
          active={value === "qris"}
          label="QRIS"
          icon={<QrCode size={compact ? 14 : 15} />}
          onClick={() => onChange("qris")}
          compact={compact}
        />

        <PaymentButton
          active={value === "ewallet"}
          label="E-Wallet"
          icon={<Wallet size={compact ? 14 : 15} />}
          onClick={() => onChange("ewallet")}
          compact={compact}
        />
      </div>
    </div>
  );
}
