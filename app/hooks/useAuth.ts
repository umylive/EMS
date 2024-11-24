// ! IMPORTS
// React hooks for state and side effects
import { useState, useEffect } from "react";
// Next.js router for navigation after auth actions
import { useRouter } from "next/navigation";
// Supabase client and User type for database interactions
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/supabase";

// ! CUSTOM AUTH HOOK
// Provides authentication functionality including user state, login, and logout
export function useAuth() {
  // ! STATE MANAGEMENT
  // Stores the current user's data
  const [user, setUser] = useState<User | null>(null);
  // Tracks loading state during auth operations
  const [loading, setLoading] = useState(true);
  // Next.js router instance for navigation
  const router = useRouter();

  // ! INITIAL AUTH CHECK
  // Runs once on component mount to check for existing auth
  useEffect(() => {
    // Check for user data in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // If found, parse and set user state
      setUser(JSON.parse(storedUser));
    }
    // Mark loading as complete
    setLoading(false);
  }, []); // Empty dependency array means this runs once on mount

  // ! LOGIN FUNCTION
  // Handles user authentication with username/password
  const login = async (username: string, password: string) => {
    try {
      // ! DATABASE QUERY
      // Query Supabase for user with matching ID
      const { data, error } = await supabase
        .from("users")
        .select("*") // Select all user fields
        .eq("id", username) // Match ID with username
        .single(); // Expect single result

      // ! ERROR HANDLING
      // Check if user exists
      if (error || !data) {
        throw new Error("User not found");
      }

      // ! PASSWORD VALIDATION
      // Simple check where password should match ID
      if (username !== password) {
        throw new Error("Invalid password");
      }

      // ! USER SESSION SETUP
      // Store user data in state and localStorage
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      // ! ERROR LOGGING
      // Log and rethrow any errors for handling by caller
      console.error("Login error:", error);
      throw error;
    }
  };

  // ! LOGOUT FUNCTION
  // Handles user logout and cleanup
  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("user");
    // Clear user state
    setUser(null);
    // Redirect to home page
    router.push("/");
  };

  // ! HOOK RETURN
  // Return authentication state and functions
  return {
    user, // Current user data
    loading, // Loading state
    login, // Login function
    logout, // Logout function
  };
}
