import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import { SettingProvider } from "./components/SettingContext";

ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
        <SettingProvider>
            <App />
        </SettingProvider>
    </React.StrictMode>
);
