/**
 * MovieDetails Component
 * Displays comprehensive information about a selected movie including:
 * - Movie poster, title, and release date
 * - Plot summary and cast information
 * - Rating functionality
 * - Add to watchlist option
 * - User comments and ratings
 */

import { useState, useRef, useEffect } from "react";
import { KEY } from "../App";
import { Loader } from "./Loader";
import StarRating from "./StarRating";
import { useKey } from "../custom hooks/useKey";
import { useMoviesContext } from "../context/MovieProvider";
import { useLanguage } from "../context/LanguageProvider";
import { useAuth } from "../context/AuthProvider";
import { SkeletonMovieDetails } from "./Skeleton";

export function MovieDetails() {
  const { selectedId, watched, setSelectedId, setWatched } = useMoviesContext();
  const { translations } = useLanguage();
  const {
    isLoggedIn,
    watchedMovies,
    addToWatched,
    user,
    accessToken,
    fetchUserProfile,
  } = useAuth();

  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(false);
  const [commentError, setCommentError] = useState(null);

  function handleCloseMovie() {
    setSelectedId(null);
  }

  async function handleAddWatched(movie) {
    if (isLoggedIn) {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://185.231.113.70/api/watchlist/add/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.current}`,
            },
            body: JSON.stringify({
              imdb_id: movie.imdbID,
              user_rating: movie.userRating,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add movie to watchlist");
        }

        // Fetch updated user profile to get the latest watchlist
        await fetchUserProfile();
      } catch (err) {
        console.error("Error adding movie to watchlist:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setWatched((watched) => [...watched, movie]);
    }
  }

  function handleDeleteWatched(id) {
    if (isLoggedIn) {
      // TODO: Implement API call to remove movie from user's watched list
      console.log("Remove movie from user's watched list:", id);
    } else {
      setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }
  }

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  const moviesToCheck = isLoggedIn ? watchedMovies : watched;
  const isWatched = moviesToCheck
    .map((movie) => movie.imdbID || movie.imdb_id)
    .includes(selectedId);
  const watchedUserRating = moviesToCheck.find(
    (movie) => movie.imdbID || movie.imdb_id === selectedId
  )?.userRating;

  // const {
  //   Title: title,
  //   Year: year,
  //   Poster: poster,
  //   Runtime: runtime,
  //   imdbRating,
  //   Plot: plot,
  //   Released: released,
  //   Actors: actors,
  //   Director: director,
  //   Genre: genre,
  // } = movie;
  const {
    title,
    year,
    poster,
    runtime,
    imdb_rating: imdbRating,
    plot,
    released,
    actors,
    director,
    genre,
  } = movie;

  const isTop = imdbRating > 8;
  // console.log(isTop);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    handleAddWatched(newWatchedMovie);
    handleCloseMovie();
  }

  useKey("Escape", handleCloseMovie);

  async function getMovieDetails() {
    setError(false);
    setIsLoading(true);
    const res = await fetch(
      // `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      `http://185.231.113.70/api/search/?i=${selectedId}`
    );
    const data = await res.json();
    setMovie(data);
    setComments(data.comments.slice(data.comments.length - 3));
    setIsLoading(false);
  }
  useEffect(
    function () {
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  const handleAddComment = async (e) => {
    const controller = new AbortController();
    e.preventDefault();
    if (!comment.trim() || !isLoggedIn) return;
    if (comment.length < 5) {
      setCommentError(translations.commentError.tooShort);
      return;
    }
    if (userRating < 0 || userRating > 10) {
      setCommentError(translations.commentError.invalidRating);
      return;
    }
    if (comment.length > 100) {
      setCommentError(translations.commentError.tooLong);
      return;
    }

    setCommentError(null);
    // setIsLoading(true);
    try {
      const response = await fetch("http://185.231.113.70/api/comment/add/", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.current}`,
        },
        body: JSON.stringify({
          imdb_id: selectedId,
          text: comment,
          rating: userRating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      // const newComment = {
      //   id: Date.now(),
      //   text: comment,
      //   user: user.username,
      //   timestamp: new Date().toISOString(),
      //   rating: userRating,
      // };

      // setComments((prev) => [...prev, newComment]);
      await getMovieDetails();
      fetchUserProfile();

      setComment("");
      setUserRating("");
    } catch (err) {
      console.error("Error adding comment:", err);
      setCommentError(translations.commentError.serverError);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://185.231.113.70/api/comment/remove/${commentId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken.current}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove comment");
      }

      // const newComment = {
      //   id: Date.now(),
      //   text: comment,
      //   user: user.username,
      //   timestamp: new Date().toISOString(),
      //   rating: userRating,
      // };

      // setComments((prev) => [...prev, newComment]);
      await new Promise((r) => setTimeout(r, 100));
      getMovieDetails();
      fetchUserProfile();

      setComment("");
      setUserRating("");
    } catch (err) {
      console.error("Error adding comment:", err);
      setCommentError(translations.commentError.serverError);
    } finally {
      // setIsLoading(false);
    }
  };

  const CommentsList = ({ comments, onDeleteComment, currentUser }) => {
    return (
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment">
            <div className="comment-avatar">
              <img
                src={`/avatar${user?.avatar_id || 1}.svg`}
                alt={`${comment.user.username}'s avatar`}
              />
            </div>
            <div className="comment-content">
              <div className="comment-header">
                <div className="comment-user">{comment.user.username}</div>
                <div className="comment-rating">
                  <span>⭐</span>
                  <span>{comment.rating}/10</span>
                </div>
              </div>
              <p className="comment-text">{comment.text}</p>
              <div className="comment-footer">
                <span className="comment-time">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
                {currentUser && currentUser.user.id === comment.user.id && (
                  <button
                    className="btn-delete-comment"
                    onClick={() => onDeleteComment(comment.id)}
                  >
                    {translations.delete}
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  if (isLoading) {
    return <SkeletonMovieDetails />;
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>
              &larr;
            </button>
            <img
              onError={() => setError(true)}
              src={error ? "movie.svg" : poster}
              alt={`Poster of ${movie} movie`}
            />
            <div className="details-overview">
              <h2>
                {translations.title}: {title}
              </h2>
              <p>
                {translations.runtime}: &bull; {runtime}
                <br />
                {translations.releaseDate}:{released}
              </p>
              <p>
                {translations.genre}: {genre}
              </p>
              <p>
                {translations.imdbRating}:<span>⭐️</span>
                {imdbRating}
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      {translations.addToWatched}
                    </button>
                  )}
                </>
              ) : (
                <p>
                  {translations.youRatedWithMovie}
                  <span>⭐️</span>
                  {watchedUserRating}
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>

          <div className="comments-section">
            <h3>{translations.comments}</h3>
            {!isLoggedIn && (
              <div className="login-prompt">
                <p>{translations.loginToComment}</p>
              </div>
            )}
            <div className={`comment-form ${!isLoggedIn ? "blurred" : ""}`}>
              <textarea
                placeholder={translations.writeComment}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={!isLoggedIn}
              />
              <div className="comment-actions">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder={translations.rating}
                  value={userRating}
                  onChange={(e) => setUserRating(Number(e.target.value))}
                  disabled={!isLoggedIn}
                />
                <button
                  type="submit"
                  className="btn-comment"
                  disabled={!isLoggedIn}
                  onClick={handleAddComment}
                >
                  {translations.postComment}
                </button>
              </div>
            </div>
            {commentError && <div className="error">{commentError}</div>}

            <CommentsList
              comments={comments}
              onDeleteComment={handleDeleteComment}
              currentUser={user}
            />
          </div>
        </>
      )}
    </div>
  );
}
