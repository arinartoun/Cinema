/**
 * Profile Component
 * Manages user profile information including:
 * - Profile information display and editing
 * - Avatar management
 * - User preferences
 * - Account statistics
 * - Watch history
 */

import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useLanguage } from "../context/LanguageProvider";
import { MovieList } from "./MovieList";
import { average } from "../App";

export function Profile() {
  const {
    user: data,
    watchedMovies,
    watchlist,
    logout,
    updateProfile,
    isLoading,
    error,
    setError,
  } = useAuth();
  const user = data.user;
  const { translations } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    preferences: {
      theme: data.theme,
      language: data.language,
      // notifications: true,
      // autoPlayTrailers: false,
    },
  });
  const [bio, setBio] = useState(data?.bio || "");
  const [selectedAvatar, setSelectedAvatar] = useState(
    data.avatar_id ? "avatar" + data.avatar_id : "avatar1"
  );
  // const [error, setError] = useState(null);
  const watchedMoviesCount = watchedMovies.length;
  const avgImdbRating = average(
    watchedMovies.map((movie) => movie?.imdb_rating || 0)
  );

  const avgRuntime = average(
    watchedMovies.map((movie) => parseInt(movie.runtime) || 0)
  );

  // const userComments = [
  //   {
  //     id: 1,
  //     movieTitle: "Inception",
  //     rating: 4.5,
  //     comment: "Mind-bending plot with amazing visuals!",
  //     date: "2024-03-15",
  //   },
  //   {
  //     id: 2,
  //     movieTitle: "The Dark Knight",
  //     rating: 5,
  //     comment: "Heath Ledger's performance was outstanding.",
  //     date: "2024-03-10",
  //   },
  //   {
  //     id: 3,
  //     movieTitle: "Interstellar",
  //     rating: 4,
  //     comment: "Beautiful cinematography and emotional story.",
  //     date: "2024-03-05",
  //   },
  // ];
  const commentsArr = data.comments.map((obj) =>
    obj.comments.map((comment) => {
      return { ...comment, title: obj.movie.title };
    })
  );
  const userComments = commentsArr.flat(2).slice(0, 3);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name, value, type, checked);
    if (type === "select-one") {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const profileData = {
        id: user.id,
        user: {
          id: user.id,
          username: formData.username,
          email: user.email,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
        },
        bio: bio,
        avatar_id: parseInt(selectedAvatar.replace("avatar", "")),
        theme: formData.preferences.theme,
        language: formData.preferences.language,
      };

      // Only include password fields if they are filled
      if (formData.currentPassword) {
        profileData.old_password = formData.currentPassword;
        profileData.new_password = formData.newPassword;
        profileData.confirm_password = formData.confirmPassword;
      }

      await updateProfile(profileData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = () => {
    // Here you would typically update the user's bio in your backend
    setIsEditing(false);
  };

  return (
    <div className={`profile-container ${isLoading ? "loading" : ""}`}>
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={
              isEditing
                ? `/${selectedAvatar}.svg`
                : `/avatar${data.avatar_id}.svg`
            }
            alt={user?.username}
          />
        </div>
        <div className="profile-info">
          <h2>{user?.username}</h2>
          <p className="profile-email">{user?.email}</p>
          {isEditing ? (
            <textarea
              className="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={translations.writeBio}
              autoComplete="off"
              maxLength={100}
              minLength={10}
              cols={30}
              rows={3}
              resize="none"
            />
          ) : (
            <p className={`profile-bio ${!bio ? "empty" : ""}`}>
              {data.bio || translations.noBio}
            </p>
          )}
        </div>
        <div className="profile-actions">
          {isEditing ? (
            <>
              {/* <button className="btn-save" onClick={handleSave}>
                {translations.saveChanges}
              </button> */}
              <button
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                {translations.cancel}
              </button>
            </>
          ) : (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              {translations.editProfile}
            </button>
          )}
          <button className="btn-logout" onClick={logout}>
            {translations.logout}
          </button>
        </div>
      </div>

      {isEditing ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>{translations.avatar}</h3>
            <div className="avatar-grid">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`avatar-option ${
                    selectedAvatar === `avatar${i + 1}` ? "selected" : ""
                  }`}
                  onClick={() => handleAvatarSelect(`avatar${i + 1}`)}
                >
                  <img src={`/avatar${i + 1}.svg`} alt={`Avatar ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>{translations.accountSettings}</h3>
            <div className="form-group">
              <label>{translations.username}</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>{translations.changePassword}</h3>
            <div className="form-group">
              <label>{translations.currentPassword}</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>{translations.newPassword}</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>{translations.confirmPassword}</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>{translations.preferences}</h3>
            <div className="preferences-group">
              {/* <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.preferences.notifications}
                    onChange={handleInputChange}
                  />
                  {translations.enableNotifications}
                </label>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    name="autoPlayTrailers"
                    checked={formData.preferences.autoPlayTrailers}
                    onChange={handleInputChange}
                  />
                  {translations.autoPlayTrailers}
                </label>
              </div> */}
              <div className="preference-item">
                <label>{translations.theme}</label>
                <select
                  name="theme"
                  value={formData.preferences.theme}
                  onChange={handleInputChange}
                >
                  <option value="dark">{translations.dark}</option>
                  <option value="light">{translations.light}</option>
                </select>
              </div>
              <div className="preference-item">
                <label>{translations.language}</label>
                <select
                  name="language"
                  value={formData.preferences.language}
                  onChange={handleInputChange}
                >
                  <option value="en">English</option>
                  <option value="fa">فارسی</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-save">
            {translations.saveChanges}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <>
          <div className="profile-stats">
            <h3>{translations.accountStats}</h3>
            <div className="stats-grid">
              <div className="stat">
                <span>🎬</span>
                <p>{translations.moviesWatched}</p>
                <p className="stat-value">{watchedMoviesCount}</p>
              </div>
              <div className="stat">
                <span>📝</span>
                <p>{translations.watchlist}</p>
                <p className="stat-value">0</p>
              </div>
              <div className="stat">
                <span>⭐️</span>
                <p>{translations.avgRating}</p>
                <p className="stat-value">{avgImdbRating.toFixed(1)}</p>
              </div>
              <div className="stat">
                <span>⏱️</span>
                <p>{translations.totalWatchTime}</p>
                <p className="stat-value">{avgRuntime.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="profile-comments">
            <h3>{translations.yourComments}</h3>
            <div className="comments-list">
              {userComments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <h4>{comment.title}</h4>
                    <div className="comment-rating">
                      <span>⭐️</span>
                      <span>{comment.rating}</span>
                    </div>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <p className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
