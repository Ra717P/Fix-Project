"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getDefaultRouteForRole, useAuth } from "@/hooks/use-auth";
import type { ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading, canAccessDashboard } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isLoginPage = pathname === "/login";
    const isDashboardRoute = pathname.startsWith("/dashboard");

    if (!session && !isLoginPage) {
      router.replace("/login");
      return;
    }

    if (session && isLoginPage) {
      router.replace(getDefaultRouteForRole(session.role));
      return;
    }

    if (session && isDashboardRoute && !canAccessDashboard) {
      router.replace("/pos");
    }
  }, [canAccessDashboard, isLoading, pathname, router, session]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4F1] text-sm font-medium text-stone-500">
        Memuat akses akun...
      </div>
    );
  }

  const isLoginPage = pathname === "/login";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!session && !isLoginPage) {
    return null;
  }

  if (session && isLoginPage) {
    return null;
  }

  if (session && isDashboardRoute && !canAccessDashboard) {
    return null;
  }

  return <>{children}</>;
}
