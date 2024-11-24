// ! LOADING COMPONENT
// Displays a full-screen loading spinner with text
export default function Loading() {
  return (
    // ! MAIN CONTAINER
    // Full-screen container with gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      {/* ! LOADING CONTENT WRAPPER
          Centers the spinner and text vertically with spacing */}
      <div className="flex flex-col items-center space-y-4">
        {/* ! SPINNER
            Animated loading spinner using border and animation */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>

        {/* ! LOADING TEXT
            Text display below the spinner */}
        <p className="text-primary-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
