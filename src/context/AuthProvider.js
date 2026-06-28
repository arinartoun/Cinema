import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { useLocalStorageState } from "../custom hooks/useLocalStorageState";
import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const { setLanguage } = useLanguage();
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const accessToken = useRef(localStorage.getItem("accessToken"));
  const { setTheme } = useTheme();
  // Demo account credentials
  const demoAccount = {
    email: "demo@example.com",
    password: "demo123",
    name: "Demo User",
    avatar: "👤",
  };

  const fetchUserProfile = async () => {
    if (!accessToken.current) return;
    setIsLoading(true);

    try {
      const response = await fetch("http://185.231.113.70/api/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.current}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setUser((prev) => data);
      setWatchedMovies(data.watchlist || []);
      setWatchlist(data.watchlist || []);
      // setLanguage(data.language || "en");
      // setTheme(data.theme || "dark");
      setIsLoggedIn(true);
      return data;
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err.message);
      // If there's an error fetching the profile, clear the auth state
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user profile on initial load if access token exists
  useEffect(() => {
    if (accessToken.current) {
      fetchUserProfile();
    }
  }, []);

  const register = async (username, email, password, confirmPassword) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch("http://185.231.113.70/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();
      console.log("Register response:", data);

      if (response.ok) {
        // After successful registration, log the user in
        await login(username, password);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://185.231.113.70/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      accessToken.current = data.access;
      localStorage.setItem("accessToken", data.access);

      // Fetch user profile after successful login
      const user = await fetchUserProfile();

      setLanguage(user?.language || "en");
      setTheme(user?.theme || "dark");
      setShowLogin(false);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setShowProfile(false);
    setUser(null);
    setWatchedMovies([]);
    setWatchlist([]);
    accessToken.current = null;
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const toggleLogin = () => {
    if (isLoggedIn) {
      setShowProfile(!showProfile);
    } else {
      setShowLogin(!showLogin);
    }
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    setShowLogin(false);
  };

  const addToWatched = (movie) => {
    setWatchedMovies((prev) => [...prev, movie]);
  };

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => [...prev, movie]);
  };

  const updateProfile = async (profileData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://185.231.113.70/api/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.current}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to update profile");
      }

      // Fetch updated profile data
      await fetchUserProfile();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        showLogin,
        showProfile,
        user,
        error,
        watchedMovies,
        watchlist,
        register,
        setError,
        login,
        logout,
        toggleLogin,
        toggleProfile,
        addToWatched,
        addToWatchlist,

        isLoading,
        setIsLoading,
        updateProfile,
        fetchUserProfile,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
