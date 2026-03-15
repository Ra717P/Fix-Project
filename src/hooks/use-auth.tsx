"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { employeeItems } from "@/data/dashboard-data";
import type { EmployeeRole } from "@/types/pos";

const AUTH_STORAGE_KEY = "sisi-kopi-auth-session";
const AUTH_REDIRECT_STORAGE_KEY = "sisi-kopi-auth-redirect";
const AUTH_LAST_USERNAME_STORAGE_KEY = "sisi-kopi-auth-last-username";

export interface AuthSession {
  id: string;
  name: string;
  image: string;
  role: EmployeeRole;
  shift: string;
  schedule: string;
  username: string;
}

interface LoginResult {
  success: boolean;
  message?: string;
  redirectTo?: string;
  session?: AuthSession;
}

interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  login: (username: string, pinCode: string) => LoginResult;
  logout: () => void;
  canAccessDashboard: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getDefaultRouteForRole(role: EmployeeRole) {
  return role === "Owner" || role === "Admin" ? "/dashboard" : "/pos";
}

function canRoleAccessDashboard(role: EmployeeRole) {
  return role === "Owner" || role === "Admin";
}

function canRoleManageEmployees(role: EmployeeRole) {
  return role === "Owner";
}

function canRoleAccessPath(role: EmployeeRole, pathname: string) {
  if (pathname.startsWith("/dashboard/karyawan")) {
    return canRoleManageEmployees(role);
  }

  if (pathname.startsWith("/dashboard")) {
    return canRoleAccessDashboard(role);
  }

  return pathname !== "/login";
}

function normalizeRedirectPath(pathname: string) {
  const trimmedPathname = pathname.trim();

  if (!trimmedPathname || trimmedPathname === "/login") {
    return null;
  }

  return trimmedPathname.startsWith("/") ? trimmedPathname : `/${trimmedPathname}`;
}

function rememberAuthRedirect(pathname: string) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedPathname = normalizeRedirectPath(pathname);

  if (!normalizedPathname) {
    return;
  }

  window.localStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, normalizedPathname);
}

function readAuthRedirect() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedPath = window.localStorage.getItem(AUTH_REDIRECT_STORAGE_KEY);
  return storedPath ? normalizeRedirectPath(storedPath) : null;
}

function clearAuthRedirect() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
}

function consumeAuthRedirect(role: EmployeeRole) {
  const redirectPath = readAuthRedirect();
  clearAuthRedirect();

  if (redirectPath && canRoleAccessPath(role, redirectPath)) {
    return redirectPath;
  }

  return getDefaultRouteForRole(role);
}

function getLastUsedUsername() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(AUTH_LAST_USERNAME_STORAGE_KEY) ?? "";
}

function createSessionFromAccount(account: (typeof employeeItems)[number]): AuthSession {
  return {
    id: account.id,
    name: account.name,
    image: account.image,
    role: account.role,
    shift: account.shift,
    schedule: account.schedule,
    username: account.username,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedValue) {
      setIsLoading(false);
      return;
    }

    try {
      const parsedSession = JSON.parse(storedValue) as AuthSession;

      const account = employeeItems.find(
        (item) =>
          item.id === parsedSession.id ||
          item.username.toLowerCase() === parsedSession.username.toLowerCase()
      );

      if (!account || account.status !== "Aktif") {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setSession(null);
        return;
      }

      const nextSession = createSessionFromAccount(account);
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
      window.localStorage.setItem(AUTH_LAST_USERNAME_STORAGE_KEY, nextSession.username);
      setSession(nextSession);
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      session,
      isLoading,
      login: (username: string, pinCode: string) => {
        const normalizedUsername = username.trim().toLowerCase();
        const normalizedPin = pinCode.trim();

        if (!normalizedUsername) {
          return {
            success: false,
            message: "Username wajib diisi terlebih dahulu.",
          };
        }

        if (!normalizedPin) {
          return {
            success: false,
            message: "PIN wajib diisi terlebih dahulu.",
          };
        }

        const account = employeeItems.find(
          (item) => item.username.toLowerCase() === normalizedUsername
        );

        if (!account) {
          return {
            success: false,
            message: "Username tidak ditemukan.",
          };
        }

        if (account.status !== "Aktif") {
          return {
            success: false,
            message: "Akun ini belum aktif untuk login.",
          };
        }

        if (account.pinCode !== normalizedPin) {
          return {
            success: false,
            message: "PIN yang dimasukkan belum sesuai.",
          };
        }

        const nextSession = createSessionFromAccount(account);
        const redirectTo = consumeAuthRedirect(account.role);

        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
        window.localStorage.setItem(AUTH_LAST_USERNAME_STORAGE_KEY, account.username);
        setSession(nextSession);

        return {
          success: true,
          redirectTo,
          session: nextSession,
        };
      },
      logout: () => {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setSession(null);
      },
      canAccessDashboard: session ? canRoleAccessDashboard(session.role) : false,
    };
  }, [isLoading, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export {
  canRoleAccessDashboard,
  canRoleManageEmployees,
  canRoleAccessPath,
  clearAuthRedirect,
  consumeAuthRedirect,
  getDefaultRouteForRole,
  getLastUsedUsername,
  rememberAuthRedirect,
};
