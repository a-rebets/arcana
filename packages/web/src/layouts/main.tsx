import OnboardingBoundary from "@/lib/nav/onboarding-boundary";

export default function MainLayout() {
  return (
    <main className="h-dvh grid grid-rows-[auto_1fr] grid-cols-1">
      <OnboardingBoundary require="onboarded" redirectTo="/onboarding" />
    </main>
  );
}
