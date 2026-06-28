import React, { createContext, useContext, useState } from "react";
import { useLocalStorageState } from "../custom hooks/useLocalStorageState";
import { useMovies } from "../custom hooks/useMovies";
const MovieContext = createContext();
function MovieProvider({ children }) {
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { error, movies, isLoading } = useMovies(query);

  return (
    <MovieContext.Provider
      value={{
        movies,
        watched,
        query,
        selectedId,
        isLoading,
        error,

        setWatched,
        setQuery,
        setSelectedId,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

function useMoviesContext() {
  const context = useContext(MovieContext);
  return context;
}
export { MovieProvider, useMoviesContext };
