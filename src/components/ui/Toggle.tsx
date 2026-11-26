"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

interface ToggleProps {
  /** Clase CSS que se togglea (ej: "dark") */
  className: string;
  /** Texto alternativo cuando está en modo claro */
  labelLight?: string;
  /** Texto alternativo cuando está en modo oscuro */
  labelDark?: string;
}

export function Toggle({ className, labelLight = "Modo oscuro", labelDark = "Modo claro" }: ToggleProps) {
  // Verificar preferencia guardada o sistema operativa
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme-mode");
    if (saved) return saved === "dark";
    return false;
  });

  // Aplicar clase al html raíz
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme-mode", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={() => setIsDark(!isDark)}
        className="rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-light"
        aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <span className="text-xs text-brand-hint select-none">
        {isDark ? labelDark : labelLight}
      </span>
    </div>
  );
}