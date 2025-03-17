import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./scss/vendors/_custom.scss";
import "./scss/vendors/_theme.scss";
import "./scss/vendors/_variables.scss";
import "./scss/vendors/ads.scss";
import "./scss/vendors/simplebar.scss";
import "./scss/vendors/examples.scss";
import "./scss/vendors/style.scss";
import "./scss/styletheme.scss";
import "./scss/vendors/media.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
