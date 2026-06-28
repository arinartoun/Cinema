import { useState, useEffect } from "react";
import { useLocalStorageState } from "./custom hooks/useLocalStorageState";
import { useMovies } from "./custom hooks/useMovies";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { NavBar } from "./page components/NavBar";
import { Search } from "./components/Search";
import { NumResults } from "./components/NumResults";
import { Main } from "./page components/Main";
import { Box } from "./page components/Box";
import { MovieList } from "./components/MovieList";
import { MovieDetails } from "./components/MovieDetails";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMoviesList } from "./components/WatchedMoviesList";
import { useMoviesContext } from "./context/MovieProvider";
import { LanguageProvider, useLanguage } from "./context/LanguageProvider";
import { LanguageSwitch } from "./components/LanguageSwitch";
import { AuthProvider, useAuth } from "./context/AuthProvider";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./context/ThemeProvider";
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "f84fc31d";

function AppContent() {
  const { selectedId, setSelectedId } = useMoviesContext();
  const { watched, setWatched } = useMoviesContext();
  const { isLoading, error } = useMoviesContext();
  const { showLogin, isLoggedIn, showProfile } = useAuth();
  const { translations } = useLanguage();

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search />
        <NumResults />
      </NavBar>

      <Main>
        {showLogin ? (
          <Box>
            <Login />
          </Box>
        ) : isLoggedIn && showProfile ? (
          <Box big={true}>
            <Profile />
          </Box>
        ) : (
          <>
            <Box>
              {/* {isLoading && <Loader />} */}
              {!error && <MovieList />}
              {/* {!isLoading && !error && <MovieList />} */}
              {error && <ErrorMessage />}
            </Box>

            <Box>
              {selectedId ? (
                <MovieDetails
                  selectedId={selectedId}
                  onCloseMovie={() => setSelectedId(null)}
                  onAddWatched={handleAddWatched}
                  watched={watched}
                />
              ) : (
                <>
                  <WatchedSummary />
                  <WatchedMoviesList />
                </>
              )}
            </Box>
          </>
        )}
      </Main>
      <LanguageSwitch />
      <ThemeToggle />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
