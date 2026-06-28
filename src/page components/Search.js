import { useMoviesContext } from "../context/MovieProvider";
import { useAuth } from "../context/AuthProvider";
import { useLanguage } from "../context/LanguageProvider";

export function Search() {
  const { query, setQuery } = useMoviesContext();
  const { isLoggedIn, showProfile, showLogin } = useAuth();
  const { translations } = useLanguage();

  const isSearchEnabled = isLoggedIn && !showProfile && !showLogin;

  return (
    <input
      className="search"
      type="text"
      placeholder={translations.searchMovies}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      disabled={!isSearchEnabled}
    />
  );
}
