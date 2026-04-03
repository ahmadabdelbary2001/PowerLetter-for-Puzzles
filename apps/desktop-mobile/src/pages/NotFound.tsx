// src/pages/NotFound.tsx
/**
 * @description A fallback page component that is displayed when a user navigates to a route
 * that does not exist in the application. It provides a clear "404" error message
 * and a link to return to the homepage for a better user experience.
 */
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * The NotFound component renders a simple 404 error page.
 * It also logs the non-existent path to the console for debugging purposes.
 *
 * @returns {JSX.Element} The rendered 404 "Page not found" view.
 */
const NotFound = () => {
  // Hook to get information about the current URL
  const location = useLocation();

  /**
   * An effect that runs once when the component mounts.
   * It logs an error to the console with the path that the user tried to access,
   * which can be helpful for identifying broken links or routing issues.
   */
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        {/* A link to guide the user back to the safety of the homepage */}
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
