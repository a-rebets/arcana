import OnboardingBoundary from "@/lib/nav/onboarding-boundary";

export default function OnboardedLayout() {
  return <OnboardingBoundary require="onboarded" redirectTo="/onboarding" />;
}
