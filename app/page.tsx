"use client";

// ! IMPORTS
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import ThemeToggle from "./components/shared/ThemeToggle";
import { Loader2 } from "lucide-react";

// ! MAIN LOGIN COMPONENT
export default function LoginPage() {
  // ! STATE MANAGEMENT
  // Form input states
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  // UI states
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ! HOOKS
  const router = useRouter();
  const { login } = useAuth();

  // ! LOGIN HANDLER
  // Handles form submission and authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ! SPECIAL ADMIN LOGIN
      // Hardcoded admin credentials for testing
      if (userId === "admin") {
        if (password === "admin") {
          router.push("/manager");
          return;
        } else if (password === "admin123") {
          router.push("/employee");
          return;
        }
      }

      // ! REGULAR USER LOGIN
      // Authenticate regular users
      const user = await login(userId, password);

      // ! ROLE-BASED ROUTING
      // Redirect based on user role
      if (user) {
        if (user.role === "manager") {
          router.push("/manager");
        } else {
          router.push("/employee");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ! COMPONENT RENDER
  return (
    // ! MAIN CONTAINER
    // Full-screen container with gradient background
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* ! THEME TOGGLE
          Fixed position in top-right corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* ! LOGIN CARD
          Main login form container */}
      <div className="w-full max-w-md px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* ! HEADER SECTION
              Logo and welcome text */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              {/* ! LOGO ICON
                  Circular background with user icon */}
              <div className="w-20 h-20 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to EMS
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to access your dashboard
            </p>
          </div>

          {/* ! LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* ! USER ID INPUT */}
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Employee ID
                </label>
                <input
                  id="userId"
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 dark:placeholder-gray-400
                    focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                    text-gray-900 dark:text-white"
                  placeholder="Enter your ID"
                />
              </div>

              {/* ! PASSWORD INPUT */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 dark:placeholder-gray-400
                    focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                    text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Use your Employee ID as your password
                </p>
              </div>
            </div>

            {/* ! ERROR MESSAGE
                Displayed when authentication fails */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-md text-sm text-center">
                {error}
              </div>
            )}

            {/* ! SUBMIT BUTTON
                Shows loading state when authenticating */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                transition-colors duration-200
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ! FOOTER
          Simple footer text */}
      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Employee Management System
      </p>
    </div>
  );
}
