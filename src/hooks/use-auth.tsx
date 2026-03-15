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
      setSession(parsedSession);
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

        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
        setSession(nextSession);

        return {
          success: true,
        };
      },
      logout: () => {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setSession(null);
      },
      canAccessDashboard:
        session?.role === "Owner" || session?.role === "Admin" || false,
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

export { getDefaultRouteForRole };
