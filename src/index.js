import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MovieProvider } from "./context/MovieProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MovieProvider>
      <App />
      {/* <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
      />
      <StarRating size={24} color="red" className="test" defaultRating={2} />
      
      <Test /> */}
    </MovieProvider>
  </React.StrictMode>
);
