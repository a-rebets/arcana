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
  const auth = useConvexAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoading) return;

    if (require === "authenticated" && !auth.isAuthenticated) {
      navigate(redirectTo || "/welcome", {
        replace: true,
      });
    }

    if (require === "unauthenticated" && auth.isAuthenticated) {
      navigate(redirectTo || "/", { replace: true });
    }
  }, [auth.isLoading, auth.isAuthenticated, require, redirectTo, navigate]);

  if (auth.isLoading) return fallback;

  if (
    (require === "authenticated" && !auth.isAuthenticated) ||
    (require === "unauthenticated" && auth.isAuthenticated)
  ) {
    return null;
  }

  return <Outlet />;
}
