"use client";

import { useUITheme, UITheme } from "@/context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useUITheme();

  const themes: { id: UITheme; label: string; icon: string; border: string; activeBg: string }[] = [
    { id: "cyber", label: "Cyber SOC", icon: "🌌", border: "border-indigo-500", activeBg: "bg-indigo-600/30 text-indigo-300" },
    { id: "matrix", label: "Matrix CRT", icon: "🟢", border: "border-emerald-500", activeBg: "bg-emerald-600/30 text-emerald-300" },
    { id: "crimson", label: "Crimson Red", icon: "🔴", border: "border-rose-500", activeBg: "bg-rose-600/30 text-rose-300" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1.5 rounded-full bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-md">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
            theme === t.id
              ? `${t.activeBg} border ${t.border} font-bold shadow-sm`
              : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
          }`}
        >
          <span>{t.icon}</span>
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
