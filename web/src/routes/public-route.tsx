import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/auth-provider";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorState from "../components/error-state";
import Loader from "../components/loader";

export const PublicRoute = () => {
  const { backendTokens } = useAuth();

  if (backendTokens) {
    return <Navigate to="/home" />;
  }

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
