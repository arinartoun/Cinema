/**
 * WatchedMoviesList Component
 * Displays and manages watched movies:
 * - List of watched movies
 * - Movie removal functionality
 * - Rating display
 * - Loading states
 * - Empty state handling
 */

import { WatchedMovie } from "./WatchedMovie";
import { useMoviesContext } from "../context/MovieProvider";
import { useLanguage } from "../context/LanguageProvider";
import { useAuth } from "../context/AuthProvider";
import { useState, useEffect } from "react";
import { SkeletonWatchedMovie } from "./Skeleton";

export function WatchedMoviesList() {
  const { watched, setWatched } = useMoviesContext();
  const {
    isLoggedIn,
    watchedMovies,
    addToWatched,
    accessToken,
    fetchUserProfile,
    isLoading,
    setIsLoading,
  } = useAuth();
  const { translations } = useLanguage();
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   // Simulate loading state
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  async function handleDeleteWatched(id) {
    if (isLoggedIn) {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://185.231.113.70/api/watchlist/remove/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.current}`,
            },
            body: JSON.stringify({
              imdb_id: id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove movie from watchlist");
        }

        // Fetch updated user profile to get the latest watchlist
        await fetchUserProfile();
      } catch (err) {
        console.error("Error removing movie from watchlist:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }
  }

  if (isLoading) {
    return (
      <ul className="list list-watched">
        {Array.from({ length: 3 }, (_, i) => (
          <li key={i}>
            <SkeletonWatchedMovie />
          </li>
        ))}
      </ul>
    );
  }

  const moviesToDisplay = isLoggedIn ? watchedMovies : watched;

  return (
    <ul className="list list-watched">
      {error && <div className="error">{error}</div>}
      {moviesToDisplay.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID || movie.imdb_id}
          onDeleteWatched={handleDeleteWatched}
        />
      ))}
    </ul>
  );
}
