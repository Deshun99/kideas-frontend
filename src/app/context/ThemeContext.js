"use client"
import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggle = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Define theme colors based on the mode
  const themeColors = {
    dark: {
      backgroundColor: "#00191c", // Dark background color
      textColor: "#696969", // White text color
      accentColor: "#082948", // Accent color for dark theme
    },
    light: {
      backgroundColor: "#fefbf6", // Light background color
      textColor: "#333333", // Dark text color
      accentColor: "#007acc", // Accent color for light theme
    },
  };

  // Get the current theme colors based on the mode
  const currentThemeColors = themeColors[mode];

  return (
    <ThemeContext.Provider value={{ toggle, mode }}>
      <div
        className="theme"
        style={{
          backgroundColor: currentThemeColors.backgroundColor,
          color: currentThemeColors.textColor,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};