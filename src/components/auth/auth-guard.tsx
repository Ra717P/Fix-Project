"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  canRoleAccessPath,
  consumeAuthRedirect,
  getDefaultRouteForRole,
  rememberAuthRedirect,
  useAuth,
} from "@/hooks/use-auth";
import type { ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isLoginPage = pathname === "/login";
    if (!session && !isLoginPage) {
      rememberAuthRedirect(pathname);
      router.replace("/login");
      return;
    }

    if (session && isLoginPage) {
      router.replace(consumeAuthRedirect(session.role) ?? getDefaultRouteForRole(session.role));
      return;
    }

    if (session && !canRoleAccessPath(session.role, pathname)) {
      router.replace(getDefaultRouteForRole(session.role));
    }
  }, [isLoading, pathname, router, session]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4F1] text-sm font-medium text-stone-500">
        Memuat akses akun...
      </div>
    );
  }

  const isLoginPage = pathname === "/login";
  if (!session && !isLoginPage) {
    return null;
  }

  if (session && isLoginPage) {
    return null;
  }

  if (session && !canRoleAccessPath(session.role, pathname)) {
    return null;
  }

  return <>{children}</>;
}
