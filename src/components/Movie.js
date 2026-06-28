/**
 * Movie Component
 * Displays individual movie card:
 * - Movie poster with fallback
 * - Title and year
 * - Click handling
 * - Error state handling
 * - Responsive design
 */

import { useMoviesContext } from "../context/MovieProvider";
import { useState, useEffect } from "react";
export function Movie({ movie }) {
  const { setSelectedId } = useMoviesContext();
  const [error, setError] = useState(false);
  useEffect(() => {
    setError(false);
  }, [movie.poster]);
  return (
    <li onClick={() => setSelectedId(movie.imdb_id)}>
      <img
        onError={() => setError(true)}
        src={error ? "movie.svg" : movie.poster}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.year}</span>
        </p>
      </div>
    </li>
  );
}
