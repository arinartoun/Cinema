/**
 * ErrorMessage Component
 * Displays error messages:
 * - User-friendly error display
 * - Retry functionality
 * - Internationalization support
 * - Clean error handling
 */

import { useLanguage } from "../context/LanguageProvider";

export function ErrorMessage() {
  const { translations } = useLanguage();
  return (
    <p className="error">
      <span>⛔️</span> {translations.error}
    </p>
  );
}
