import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://website-beta-rose-83.vercel.app"),
  title: "Aryan Tomar | Security Researcher & Systems Automation",
  description: "Systems programming, protocol research, and automated defense tools built natively in mobile POSIX subsystems.",
  openGraph: {
    title: "Aryan Tomar | Security Researcher & Systems Automation",
    description: "Systems programming, protocol research, and automated defense tools.",
    url: "https://website-beta-rose-83.vercel.app",
    siteName: "Aryan Tomar Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aryan Tomar | Security Researcher",
    description: "Systems programming, protocol research, and automated defense tools.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
