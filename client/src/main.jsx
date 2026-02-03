import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WsProvider } from "./state/ws.jsx";
import App from "./App.jsx";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <WsProvider>
      <App />
    </WsProvider>
  </BrowserRouter>
);
