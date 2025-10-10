import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

type AuthBoundaryProps = {
  require: "authenticated" | "unauthenticated";
  redirectTo?: string;
  fallback?: React.ReactNode;
};

/**
 * AuthBoundary - Guards routes based on authentication status only
 * Does NOT query user data, safe for unauthenticated routes
 */
export default function AuthBoundary({
  require,
  redirectTo,
  fallback = null,
}: AuthBoundaryProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (require === "authenticated" && !isAuthenticated) {
      navigate(redirectTo || "/welcome", {
        replace: true,
      });
    }

    if (require === "unauthenticated" && isAuthenticated) {
      navigate(redirectTo || "/", { replace: true });
    }
  }, [isLoading, isAuthenticated, require, redirectTo, navigate]);

  if (isLoading) return fallback;

  if (
    (require === "authenticated" && !isAuthenticated) ||
    (require === "unauthenticated" && isAuthenticated)
  ) {
    return null;
  }

  return <Outlet />;
}
