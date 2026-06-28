/**
 * Logo Component
 * Displays application logo:
 * - Brand identity
 * - Responsive sizing
 * - Click handling
 * - Clean design
 */

import { useLanguage } from "../context/LanguageProvider";

export function Logo() {
  const { translations } = useLanguage();
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>{translations.logo}</h1>
    </div>
  );
}
