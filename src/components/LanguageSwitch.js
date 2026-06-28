/**
 * LanguageSwitch Component
 * Manages language selection:
 * - Language toggle
 * - Language persistence
 * - Context integration
 * - Clean UI
 */

import { useLanguage } from "../context/LanguageProvider";

export function LanguageSwitch() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className="language-switch"
      onClick={toggleLanguage}
      title={language === "fa" ? "Switch to English" : "تغییر به فارسی"}
    >
      {language === "fa" ? "EN" : "فا"}
    </button>
  );
}
