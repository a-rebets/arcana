import OnboardingBoundary from "@/lib/nav/onboarding-boundary";

export default function NotOnboardedLayout() {
  return <OnboardingBoundary require="not-onboarded" redirectTo="/" />;
}
