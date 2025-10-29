import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
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
  const { data: userData } = useQuery(
    convexQuery(api.core.accounts.getUser, {}),
  );

  useEffect(() => {
    if (userData === undefined) return;

    // Require onboarding to be completed
    if (require === "onboarded" && !userData?.onboardingCompletedTime) {
      navigate(redirectTo || "/onboarding", {
        replace: true,
      });
    }
    // Require onboarding to NOT be completed (redirect if already done)
    if (require === "not-onboarded" && userData?.onboardingCompletedTime) {
      navigate(redirectTo || "/", { replace: true });
    }
  }, [userData, require, redirectTo, navigate]);

  if (userData == null) return fallback;

  if (
    (require === "onboarded" && !userData.onboardingCompletedTime) ||
    (require === "not-onboarded" && userData.onboardingCompletedTime)
  ) {
    return null;
  }

  return <Outlet />;
}
