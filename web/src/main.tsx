import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import '../i18n.ts'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="min-h-screen font-sans antialiased bg-background">
      <App />
    </div>
  </React.StrictMode>
);
