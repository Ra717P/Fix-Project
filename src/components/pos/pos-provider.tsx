"use client";

import type { ReactNode } from "react";
import { PosContext, useCreatePosStore } from "@/hooks/use-pos";

export function PosProvider({ children }: { children: ReactNode }) {
  const value = useCreatePosStore();

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}
