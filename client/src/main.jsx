import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WsProvider } from "./state/ws.jsx";
import { LanguageProvider } from "./context/LanguageContext";
import App from "./App.jsx";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LanguageProvider>
      <WsProvider>
        <App />
      </WsProvider>
    </LanguageProvider>
  </BrowserRouter>
);
