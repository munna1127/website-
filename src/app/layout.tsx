import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export const metadata: Metadata = {
  metadataBase: new URL("https://website-beta-rose-83.vercel.app"),
  title: "Aryan Tomar | Security Researcher & Systems Automation",
  description: "Systems programming, protocol research, and automated defense tools built natively in mobile POSIX subsystems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <ThemeProvider>
          {children}
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
