import React, { createContext, useContext } from "react";
import useSettings from "../hooks/useSettings";

const SettingContext = createContext(undefined);

export function SettingProvider({ children }) {
    const { settings, loading } = useSettings();

    return (
        <SettingContext.Provider value={{ settings, loading }}>
            {children}
        </SettingContext.Provider>
    );
}

// ✅ keep this as a function, not a hook name conflict
export function useSetting(key, defaultValue = null) {
    const context = useContext(SettingContext);

    if (!context) {
        throw new Error("useSetting must be used inside <SettingProvider>");
    }

    return context.settings[key] ?? defaultValue;
}
