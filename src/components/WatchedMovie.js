/**
 * WatchedMovie Component
 * Displays individual watched movie information:
 * - Movie poster and title
 * - IMDb and user ratings
 * - Runtime information
 * - Delete functionality
 * - Internationalization support
 */

import { useLanguage } from "../context/LanguageProvider";

export function WatchedMovie({ movie, onDeleteWatched }) {
  const { translations } = useLanguage();
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie?.imdbRating || movie.imdb_rating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie?.userRating || movie.user_rating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>
            {parseInt(movie.runtime) || 0} {translations.minutes}
          </span>
        </p>

        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID || movie.imdb_id)}
        >
          X
        </button>
      </div>
    </li>
  );
}
