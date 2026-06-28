/**
 * WatchedSummary Component
 * Displays statistics for watched movies:
 * - Average ratings
 * - Total movies watched
 * - Average runtime
 * - Loading states
 * - Summary calculations
 */

import { useMoviesContext } from "../context/MovieProvider";
import { useLanguage } from "../context/LanguageProvider";
import { useAuth } from "../context/AuthProvider";
import { average } from "../App";
import { useState, useEffect } from "react";
import { SkeletonWatchedSummary } from "./Skeleton";

export function WatchedSummary() {
  const { watched } = useMoviesContext();
  const { isLoggedIn, watchedMovies, isLoading } = useAuth();
  const { translations } = useLanguage();
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   // Simulate loading state
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  if (isLoading) {
    return <SkeletonWatchedSummary />;
  }

  const moviesToCalculate = isLoggedIn ? watchedMovies : watched;

  const avgImdbRating = average(
    moviesToCalculate.map(
      (movie) => movie?.imdbRating || movie?.imdb_rating || 0
    )
  );
  const avgUserRating = average(
    moviesToCalculate.map(
      (movie) => movie?.userRating || movie?.user_rating || 0
    )
  );
  const avgRuntime = average(
    moviesToCalculate.map((movie) => parseInt(movie.runtime) || 0)
  );

  return (
    <div className="summary">
      <h2>{translations.watchedMovies}</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>
            {moviesToCalculate.length} {translations.movie}
          </span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>
            {avgRuntime.toFixed(0)} {translations.minutes}
          </span>
        </p>
      </div>
    </div>
  );
}
