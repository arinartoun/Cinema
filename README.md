# usePopcorn

usePopcorn is a React movie discovery and watchlist application. Users can search for movies, inspect movie details, rate titles, maintain a watched list, and view summary statistics. Optional accounts add server-backed watchlists, comments, and profile settings.

## Features

- Search by movie title (requests begin after 3 characters)
- Movie details including poster, release date, runtime, genre, plot, cast, director, and IMDb rating
- Personal 1–10 ratings and watched-movie statistics
- Guest watchlist persisted in browser `localStorage`
- Account registration and login with a server-backed watchlist
- Add and delete movie comments while signed in
- Editable profile, avatar, password, theme, and language preferences
- English and Persian interfaces with automatic LTR/RTL direction
- Persistent light and dark themes
- Responsive layout and loading skeletons

## Tech stack

- React 18
- React DOM 18
- Create React App / React Scripts 5
- React Context for movie, authentication, language, and theme state
- Custom hooks for API requests, keyboard handling, and local storage
- Plain CSS

## Requirements

- Node.js 16 or newer
- npm
- Network access to the configured API server

## Getting started

```bash
npm install
npm start
```

The development server opens at [http://localhost:3000](http://localhost:3000).

No `.env` file or API key is currently required. The API base URL is hard-coded as `http://185.231.113.70/api` in the source.

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the development server |
| `npm test` | Start the Jest test runner in watch mode |
| `npm run build` | Create an optimized production build in `build/` |
| `npm run eject` | Eject Create React App configuration (irreversible) |

There are currently no project test files, although React Testing Library dependencies are installed.

## How it works

### Movie search

`useMovies` sends a search request when the query contains at least three characters. Selecting a result loads its full details. Pressing `Escape` closes the details panel.

### Guest and account data

- Guests store watched movies under the `watched` local-storage key.
- Signed-in users load their profile and watchlist from the backend.
- The JWT access token is stored under `accessToken` in `localStorage`.
- Theme and language choices are stored under `theme` and `language`.

### API endpoints

The frontend currently calls these endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/search/?s={query}` | Search for movies |
| `GET` | `/search/?i={imdbId}` | Load movie details and comments |
| `POST` | `/register/` | Create an account |
| `POST` | `/login/` | Sign in and obtain an access token |
| `GET` | `/profile/` | Load the signed-in user's profile |
| `PUT` | `/profile/` | Update profile and preferences |
| `POST` | `/watchlist/add/` | Add a rated movie to the account watchlist |
| `POST` | `/watchlist/remove/` | Remove a movie from the account watchlist |
| `POST` | `/comment/add/` | Add a movie comment and rating |
| `DELETE` | `/comment/remove/{commentId}/` | Delete the current user's comment |

Authenticated requests send the token as `Authorization: Bearer <token>`.

## Project structure

```text
public/                 Static assets, avatars, and HTML template
src/
├── app versions/       Earlier standalone iterations kept for reference
├── components/         Movie, auth, profile, controls, and feedback UI
├── context/            Auth, movie, language, and theme providers
├── custom hooks/       Movie fetching, local storage, and keyboard hooks
├── page components/    Main layout containers and navigation
├── translations/       English and Persian translation dictionaries
├── App.js               Application composition and main view switching
├── index.css            Global, theme, profile, and responsive styles
└── index.js             React entry point and provider setup
```

The active application is `src/App.js`. Files in `src/app versions/` are historical versions and are not imported by the entry point.

## Production build

```bash
npm run build
```

Deploy the generated `build/` directory with any static hosting service.

> **Deployment note:** the configured API uses plain HTTP. Browsers normally block HTTP API requests when the frontend is served over HTTPS. For an HTTPS deployment, expose the backend over HTTPS and move the API base URL into an environment variable before building.

## Current limitations

- The API URL is duplicated across several source files instead of being centrally configured.
- Authentication depends on the external backend being online and reachable.
- Access tokens are stored in `localStorage`.
- No automated tests are currently included.
- `npm run eject` should only be used if direct control of the build configuration is required.
