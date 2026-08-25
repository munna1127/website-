"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type UITheme = "cyber" | "matrix" | "crimson";

interface ThemeContextType {
  theme: UITheme;
  setTheme: (theme: UITheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "cyber",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<UITheme>("cyber");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_theme") as UITheme;
    if (saved && ["cyber", "matrix", "crimson"].includes(saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const setTheme = (newTheme: UITheme) => {
    setThemeState(newTheme);
    localStorage.setItem("portfolio_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useUITheme = () => useContext(ThemeContext);
