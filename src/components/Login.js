/**
 * Login Component
 * Handles user authentication including:
 * - User login form
 * - Registration form
 * - Form validation
 * - Error handling
 * - Remember me functionality
 */

import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useLanguage } from "../context/LanguageProvider";
import { Loader } from "./Loader";

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login, register, error, setError, isLoading } = useAuth();
  const { translations } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Guard clauses for registration validation
    if (isLogin) {
      await login(username, password);
    } else {
      if (username.length < 4) {
        setError(translations.usernameLengthError);
        return;
      }
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        setError(translations.usernameFormatError);
        return;
      }

      if (password.length < 8) {
        setError(translations.passwordLengthError);
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setError(translations.passwordUppercaseError);
        return;
      }
      if (!/[0-9]/.test(password)) {
        setError(translations.passwordNumberError);
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setError(translations.passwordSymbolError);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(translations.emailFormatError);
        return;
      }

      if (password !== confirmPassword) {
        setError(translations.passwordMatchError);
        return;
      }

      await register(username, email, password, confirmPassword);
    }
  };

  return (
    <div className={`login ${isLoading ? "loading" : ""}`}>
      <h2>{isLogin ? translations.login : translations.register}</h2>
      {/* {isLoading && <Loader />} */}
      <div className={`${error ? "error" : ""}`}>
        {error && isLogin ? translations.loginError : error}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={translations.username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {!isLogin && (
          <input
            type="email"
            placeholder={translations.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        <input
          type="password"
          placeholder={translations.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <input
            type="password"
            placeholder={translations.confirmPassword}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}
        <button type="submit">
          {isLogin ? translations.login : translations.register}
        </button>
      </form>
      <button
        className="btn-switch"
        onClick={() => {
          setIsLogin(!isLogin);
          setError(null);
        }}
      >
        {isLogin ? translations.switchToRegister : translations.switchToLogin}
      </button>
    </div>
  );
}
