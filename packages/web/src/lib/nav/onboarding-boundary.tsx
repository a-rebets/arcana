import { api } from "@convex/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

type OnboardingBoundaryProps = {
  require: "onboarded" | "not-onboarded";
  redirectTo?: string;
  fallback?: React.ReactNode;
};

/**
 * OnboardingBoundary - Guards routes based on onboarding status
 * ASSUMES user is already authenticated (use after AuthBoundary)
 */
export default function OnboardingBoundary({
  require,
  redirectTo,
  fallback = null,
}: OnboardingBoundaryProps) {
  const navigate = useNavigate();
  const user = useQuery(api.core.accounts.getUser);

  useEffect(() => {
    if (user === undefined) return;

    // Require onboarding to be completed
    if (require === "onboarded" && !user?.onboardingCompletedTime) {
      navigate(redirectTo || "/onboarding", {
        replace: true,
      });
    }
    // Require onboarding to NOT be completed (redirect if already done)
    if (require === "not-onboarded" && user?.onboardingCompletedTime) {
      navigate(redirectTo || "/", { replace: true });
    }
  }, [user, require, redirectTo, navigate]);

  if (user == null) return fallback;

  if (
    (require === "onboarded" && !user.onboardingCompletedTime) ||
    (require === "not-onboarded" && user.onboardingCompletedTime)
  ) {
    return null;
  }

  return <Outlet />;
}
