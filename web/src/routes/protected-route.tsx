import { Navigate, Outlet } from "react-router-dom";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorState from "../components/error-state";
import Loader from "../components/loader";
import { useAuth } from "../contexts/auth-provider";

export const ProtectedRoute = ({ roles }: { roles?: string[] }) => {
  const { user } = useAuth();

  // Check if the user is authenticated
  if (!user) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // Check if the user has the required role to access the route
  if (roles && !roles.includes(user.role)) {
    // If not, redirect to the login page
    return <Navigate to="/" />;
  }

  // If authenticated, render the child routes
  return (
    <ErrorBoundary
      fallback={<ErrorState text="An error occurred in the application." />}
    >
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
};
