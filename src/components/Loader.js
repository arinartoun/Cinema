/**
 * Loader Component
 * Displays loading state:
 * - Spinning animation
 * - Customizable size
 * - Clean design
 * - Reusable component
 */

import { useLanguage } from "../context/LanguageProvider";

export function Loader() {
  const { translations } = useLanguage();
  return <p className="loader">{translations.loading}</p>;
}
