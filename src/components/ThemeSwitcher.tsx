"use client";

import { useState, useRef, useEffect } from "react";
import { useUITheme, UITheme } from "@/context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useUITheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeOptions: {
    id: UITheme;
    name: string;
    subtitle: string;
    badge: string;
    colorClasses: string;
    borderGlow: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "cyber",
      name: "Cyber SOC",
      subtitle: "Indigo / Violet Orbital",
      badge: "#6366F1",
      colorClasses: "hover:border-indigo-500/50 hover:bg-indigo-950/20 text-indigo-400",
      borderGlow: "border-indigo-500 bg-indigo-500/10",
      icon: (
        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "matrix",
      name: "Matrix CRT",
      subtitle: "Phosphor Emerald Terminal",
      badge: "#10B981",
      colorClasses: "hover:border-emerald-500/50 hover:bg-emerald-950/20 text-emerald-400",
      borderGlow: "border-emerald-500 bg-emerald-500/10",
      icon: (
        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "crimson",
      name: "Crimson Ops",
      subtitle: "Black-Ops Tactical Red",
      badge: "#F43F5E",
      colorClasses: "hover:border-rose-500/50 hover:bg-rose-950/20 text-rose-400",
      borderGlow: "border-rose-500 bg-rose-500/10",
      icon: (
        <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  const currentThemeObj = themeOptions.find((t) => t.id === theme) || themeOptions[0];

  return (
    <div ref={containerRef} className="fixed bottom-5 right-5 z-50 font-sans">
      
      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-64 p-3 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="px-2 py-1 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              ⚡ Interface Engine
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="space-y-1.5">
            {themeOptions.map((opt) => {
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                    isSelected
                      ? `${opt.borderGlow} font-bold shadow-lg`
                      : `bg-slate-900/50 border-slate-800/80 ${opt.colorClasses}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                      {opt.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{opt.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{opt.subtitle}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-xs font-mono font-bold text-white">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Single Futuristic Floating Orb Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Cyber Theme Switcher"
        className={`group relative flex items-center justify-center h-12 w-12 rounded-full bg-slate-950/90 border border-slate-700/80 shadow-[0_0_25px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? "ring-2 ring-indigo-500 border-indigo-400" : "hover:border-slate-500"
        }`}
      >
        {/* Animated Background Ring */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-rose-500 opacity-30 blur group-hover:opacity-75 transition duration-500"></span>

        {/* Inner Reactor Icon */}
        <div className="relative flex items-center justify-center">
          <svg
            className={`w-6 h-6 transition-transform duration-500 ${
              isOpen ? "rotate-180 scale-110 text-white" : "group-hover:rotate-45"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            {/* Cyber HUD Gear/Reactor Vector */}
            <circle cx="12" cy="12" r="3" strokeWidth="2" stroke="currentColor" className="text-indigo-400" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.05-6.95l-1.414 1.414M6.464 17.536l-1.414 1.414m0-13.899l1.414 1.414m11.072 11.072l1.414 1.414"
              className="text-slate-300"
            />
          </svg>

          {/* Active Accent Dot */}
          <span
            className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full ring-2 ring-slate-950"
            style={{ backgroundColor: currentThemeObj.badge }}
          ></span>
        </div>
      </button>

    </div>
  );
}
