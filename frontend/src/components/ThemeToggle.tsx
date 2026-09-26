import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const storageKey = "resolve-ai-theme";

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(storageKey);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

interface ThemeToggleProps {
  className?: string;
}

function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isLight = theme === "light";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(storageKey, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  }

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle-${isLight ? "on" : "off"} ${className}`.trim()}
      onClick={toggleTheme}
      aria-pressed={isLight}
      aria-label={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
      title={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
    >
      {isLight ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default ThemeToggle;
