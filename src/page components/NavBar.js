import { useLanguage } from "../context/LanguageProvider";
import { useAuth } from "../context/AuthProvider";

export function NavBar({ children }) {
  const { translations } = useLanguage();
  const { toggleLogin, isLoggedIn, user } = useAuth();

  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">
          <img src="logo.svg" alt="logo" />
        </span>
        <h1>{translations.appName}</h1>
      </div>
      {children}
      <button
        className={`btn-profile ${isLoggedIn ? "logged-in" : ""}`}
        onClick={toggleLogin}
        title={isLoggedIn ? user.user.username : translations.login}
      >
        <span role="img">
          <img
            src={`${
              isLoggedIn ? "avatar" + user.avatar_id : "profile-icon"
            }.svg`}
            alt="logo"
          />
        </span>
      </button>
    </nav>
  );
}
