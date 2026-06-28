/**
 * MovieList Component
 * Displays a grid of movie cards with:
 * - Movie posters
 * - Titles
 * - Release years
 * - Loading skeleton state
 * - Click handling for movie selection
 */

import { useMoviesContext } from "../context/MovieProvider";
import { Movie } from "./Movie";
import { SkeletonMovie } from "./Skeleton";

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>

      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/
export function MovieList() {
  const { movies, isLoading } = useMoviesContext();

  if (isLoading) {
    return (
      <ul className="list list-movies">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonMovie key={i} />
        ))}
      </ul>
    );
  }

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}
