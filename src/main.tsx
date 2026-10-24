import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { GlobalStyle } from "./styles/globalStyle.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <Toaster />
    <App />
  </StrictMode>,
);
