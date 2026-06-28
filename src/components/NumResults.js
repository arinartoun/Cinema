/**
 * NumResults Component
 * Displays search results count:
 * - Dynamic result count
 * - Internationalization support
 * - Context integration
 * - Clean formatting
 */

import { useMoviesContext } from "../context/MovieProvider";
import { useLanguage } from "../context/LanguageProvider";

export function NumResults() {
  const { movies } = useMoviesContext();
  const { translations } = useLanguage();

  return (
    <p className="num-results">
      {translations.numResults.replace("{count}", movies.length)}
    </p>
  );
}
