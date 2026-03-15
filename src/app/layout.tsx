import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AuthProvider } from "@/hooks/use-auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sisi Kopi POS",
  description: "Aplikasi kasir cafe Sisi Kopi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F7F4F1] text-stone-900 antialiased">
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
