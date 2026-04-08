"use client";

/**
 * @description A fallback page component for 404 errors.
 * Shared across monorepo apps.
 */
import { useEffect } from "react";
import { useAppLocation } from "../contexts/RouterContext";
import { Link } from "../atoms/Link";

const NotFound = () => {
  const location = useAppLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-2xl text-slate-600 dark:text-slate-400 mb-8">Oops! Page not found</p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
