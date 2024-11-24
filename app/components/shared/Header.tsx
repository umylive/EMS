"use client";

// ! IMPORTS
// Custom hook for authentication functionality
import { useAuth } from "@/app/hooks/useAuth";
// React hooks for component lifecycle and state management
import { useEffect, useState } from "react";
// Theme toggle component for dark/light mode switching
import ThemeToggle from "./ThemeToggle";

// ! PROPS INTERFACE
// Defines the expected props for the Header component
type HeaderProps = {
  title: string;
};

// ! MAIN COMPONENT
// Header component that displays the page title, user info, time, theme toggle, and logout button
export default function Header({ title }: HeaderProps) {
  // ! HOOKS
  // Destructure auth functionality and user data from useAuth hook
  const { logout, user } = useAuth();
  // State for storing the current time
  const [currentTime, setCurrentTime] = useState("");

  // ! TIME UPDATE EFFECT
  // Sets up an interval to update the time display every second
  useEffect(() => {
    // Function to format and update the current time
    const updateTime = () => {
      const time = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Riyadh", // Saudi Arabia timezone
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(time);
    };

    // Initialize time immediately
    updateTime();
    // Set up interval to update time every second
    const interval = setInterval(updateTime, 1000);
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once on mount

  // ! COMPONENT RENDER
  return (
    // ! HEADER CONTAINER
    // Main header with responsive background and shadow
    <header className="bg-white dark:bg-gray-800 shadow">
      {/* ! CONTENT WRAPPER */}
      {/* Responsive container with max width and padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* ! FLEX CONTAINER */}
        {/* Arranges items in a row with space between */}
        <div className="flex justify-between items-center">
          {/* ! LEFT SECTION */}
          {/* Contains title and user welcome message */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome, {user?.name}
            </p>
          </div>

          {/* ! RIGHT SECTION */}
          {/* Contains time display, theme toggle, and logout button */}
          <div className="flex items-center space-x-4">
            {/* ! TIME DISPLAY */}
            {/* Shows current time in Saudi Arabia */}
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Saudi Arabia Time:</span>
              <span className="ml-2">{currentTime}</span>
            </div>

            {/* ! THEME TOGGLE */}
            {/* Component for switching between light/dark modes */}
            <ThemeToggle />

            {/* ! LOGOUT BUTTON */}
            {/* Triggers logout function with hover effect */}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
