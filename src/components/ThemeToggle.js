/**
 * ThemeToggle Component
 * Manages application theme switching:
 * - Toggle between light/dark themes
 * - Theme persistence
 * - Smooth transitions
 * - Accessible toggle button
 */

import { useTheme } from "../context/ThemeProvider";
import { useLanguage } from "../context/LanguageProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { translations } = useLanguage();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={translations.theme}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
