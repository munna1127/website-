"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "Entropy", href: "/tools/entropy" },
    { name: "Recon", href: "/tools/recon" },
    { name: "WAF", href: "/tools/waf" },
    { name: "Subnet", href: "/tools/subnet" },
    { name: "Hash", href: "/tools/hash" },
    { name: "Encoder", href: "/tools/encoder" },
    { name: "Status", href: "/status", isStatus: true },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="border-b border-slate-800/80 sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2 shrink-0">
          <span>🚀</span>
          <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent whitespace-nowrap">
            Aryan Tomar
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-2 py-1 rounded-md text-xs font-medium transition ${
                link.isStatus
                  ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-900"
              }`}
            >
              {link.isStatus && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>}
              {link.name}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="ml-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition shadow-md shadow-indigo-600/20"
          >
            Dashboard
          </Link>
        </nav>

        {/* Mobile View */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-sm"
          >
            Dashboard
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                link.isStatus
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent"
              }`}
            >
              {link.isStatus && <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>}
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
