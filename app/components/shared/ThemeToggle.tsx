"use client";

// ! IMPORTS
// React hooks for state management and side effects
import { useState, useEffect } from "react";
// Icons for light/dark mode from Lucide icon library
import { Moon, Sun } from "lucide-react";

// ! MAIN COMPONENT
// ThemeToggle component for switching between light and dark themes
export default function ThemeToggle() {
  // ! STATE
  // Controls whether the dark theme is active
  const [isDark, setIsDark] = useState(false);

  // ! INITIAL THEME EFFECT
  // Runs once on component mount to set the initial theme
  useEffect(() => {
    // Get theme from localStorage
    const theme = localStorage.getItem("theme");
    // Update state based on stored theme
    setIsDark(theme === "dark");
    // If theme is dark, add dark class to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []); // Empty dependency array means this effect runs once on mount

  // ! THEME TOGGLE HANDLER
  // Handles switching between light and dark themes
  const toggleTheme = () => {
    // Toggle dark state
    setIsDark(!isDark);

    if (isDark) {
      // Switch to light theme
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      // Switch to dark theme
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  // ! COMPONENT RENDER
  return (
    // ! TOGGLE BUTTON
    // Button with appropriate ARIA label and styling
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {/* ! CONDITIONAL ICON RENDER */}
      {/* Shows Sun icon for dark mode, Moon icon for light mode */}
      {isDark ? (
        // Sun icon with yellow color for dark mode
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        // Moon icon with gray color for light mode
        <Moon className="h-5 w-5 text-gray-700" />
      )}
    </button>
  );
}
