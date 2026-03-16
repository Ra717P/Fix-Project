"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { employeeItems } from "@/data/dashboard-data";
import type { EmployeeFormValues, EmployeeItem, EmployeeRole } from "@/types/pos";

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
  employees: EmployeeItem[];
  session: AuthSession | null;
  isLoading: boolean;
  login: (username: string, pinCode: string) => LoginResult;
  logout: () => void;
  saveEmployee: (employeeId: string | null, values: EmployeeFormValues) => EmployeeMutationResult;
  toggleEmployeeStatus: (employeeId: string) => EmployeeMutationResult;
  resetEmployeePin: (employeeId: string) => EmployeeMutationResult;
  canAccessDashboard: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface EmployeeMutationResult {
  success: boolean;
  employee?: EmployeeItem;
  message?: string;
}

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

function createSessionFromAccount(account: EmployeeItem): AuthSession {
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

function createEmployeeId(items: EmployeeItem[]) {
  const ids = items
    .map((item) => Number(item.id.split("-")[1]))
    .filter((value) => Number.isFinite(value));
  const nextId = ids.length === 0 ? 1 : Math.max(...ids) + 1;

  return `EMP-${String(nextId).padStart(3, "0")}`;
}

function isSameSession(current: AuthSession, next: AuthSession) {
  return (
    current.id === next.id &&
    current.name === next.name &&
    current.image === next.image &&
    current.role === next.role &&
    current.shift === next.shift &&
    current.schedule === next.schedule &&
    current.username === next.username
  );
}

function isProtectedEmployee(employee: EmployeeItem) {
  return employee.role === "Owner";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<EmployeeItem[]>(employeeItems);
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

      const account = employees.find(
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

  useEffect(() => {
    if (!session) {
      return;
    }

    const account = employees.find((item) => item.id === session.id);

    if (!account || account.status !== "Aktif") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      setSession(null);
      return;
    }

    const nextSession = createSessionFromAccount(account);

    if (isSameSession(session, nextSession)) {
      return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    window.localStorage.setItem(AUTH_LAST_USERNAME_STORAGE_KEY, nextSession.username);
    setSession(nextSession);
  }, [employees, session]);

  const login = useCallback(
    (username: string, pinCode: string) => {
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

      const account = employees.find((item) => item.username.toLowerCase() === normalizedUsername);

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
    [employees]
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  }, []);

  const saveEmployee = useCallback(
    (employeeId: string | null, values: EmployeeFormValues): EmployeeMutationResult => {
      const normalizedValues: EmployeeFormValues = {
        ...values,
        name: values.name.trim(),
        image: values.image.trim(),
        shift: values.shift.trim(),
        schedule: values.schedule.trim(),
        phone: values.phone.trim(),
        username: values.username.trim().toLowerCase(),
        pinCode: values.pinCode.trim(),
      };

      const duplicateUsername = employees.some(
        (employee) =>
          employee.username.toLowerCase() === normalizedValues.username &&
          employee.id !== employeeId
      );

      if (duplicateUsername) {
        return {
          success: false,
          message: "Gunakan username lain agar akun karyawan tidak bentrok.",
        };
      }

      if (employeeId) {
        const currentEmployee = employees.find((employee) => employee.id === employeeId);

        if (!currentEmployee) {
          return {
            success: false,
            message: "Akun karyawan tidak ditemukan.",
          };
        }

        if (isProtectedEmployee(currentEmployee)) {
          return {
            success: false,
            message: "Akun owner dikunci dan tidak bisa diubah.",
          };
        }

        const nextEmployee: EmployeeItem = {
          ...currentEmployee,
          ...normalizedValues,
        };

        setEmployees((prev) =>
          prev.map((employee) => (employee.id === employeeId ? nextEmployee : employee))
        );

        return {
          success: true,
          employee: nextEmployee,
        };
      }

      const nextEmployee: EmployeeItem = {
        id: createEmployeeId(employees),
        ...normalizedValues,
        lastLogin: "Belum pernah login",
      };

      setEmployees((prev) => [nextEmployee, ...prev]);

      return {
        success: true,
        employee: nextEmployee,
      };
    },
    [employees]
  );

  const toggleEmployeeStatus = useCallback(
    (employeeId: string) => {
      const currentEmployee = employees.find((employee) => employee.id === employeeId);

      if (!currentEmployee) {
        return {
          success: false,
          message: "Akun karyawan tidak ditemukan.",
        };
      }

      if (isProtectedEmployee(currentEmployee)) {
        return {
          success: false,
          message: "Akun owner dikunci dan tidak bisa dinonaktifkan.",
        };
      }

      const nextEmployee: EmployeeItem = {
        ...currentEmployee,
        status: currentEmployee.status === "Aktif" ? "Nonaktif" : "Aktif",
      };

      setEmployees((prev) =>
        prev.map((employee) => (employee.id === employeeId ? nextEmployee : employee))
      );

      return {
        success: true,
        employee: nextEmployee,
      };
    },
    [employees]
  );

  const resetEmployeePin = useCallback(
    (employeeId: string) => {
      const currentEmployee = employees.find((employee) => employee.id === employeeId);

      if (!currentEmployee) {
        return {
          success: false,
          message: "Akun karyawan tidak ditemukan.",
        };
      }

      if (isProtectedEmployee(currentEmployee)) {
        return {
          success: false,
          message: "PIN akun owner dikunci dan tidak bisa direset.",
        };
      }

      const nextEmployee: EmployeeItem = {
        ...currentEmployee,
        pinCode: "123456",
      };

      setEmployees((prev) =>
        prev.map((employee) => (employee.id === employeeId ? nextEmployee : employee))
      );

      return {
        success: true,
        employee: nextEmployee,
      };
    },
    [employees]
  );

  const value = useMemo<AuthContextValue>(() => {
    return {
      employees,
      session,
      isLoading,
      login,
      logout,
      saveEmployee,
      toggleEmployeeStatus,
      resetEmployeePin,
      canAccessDashboard: session ? canRoleAccessDashboard(session.role) : false,
    };
  }, [
    employees,
    isLoading,
    login,
    logout,
    resetEmployeePin,
    saveEmployee,
    session,
    toggleEmployeeStatus,
  ]);

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
