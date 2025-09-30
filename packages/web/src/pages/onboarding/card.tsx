import { useMeasure } from "@react-hookz/web";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { GradientBackground } from "@/components/ui/gradient-background";
import { TransitionPanel } from "@/components/ui/transition-panel";
import type { OnboardingFormValues } from "./schema";
import { AccountStep } from "./steps/account";
import { ColorStep } from "./steps/color";
import { NameStep } from "./steps/name";

export function OnboardingCard({
  activeIndex,
  loading,
}: {
  activeIndex: number;
  loading?: boolean;
}) {
  const [bounds, ref] = useMeasure<HTMLDivElement>();
  const { watch } = useFormContext<OnboardingFormValues>();
  const gradient = watch("gradient");

  const contentHeight = bounds?.height ?? 200;
  const contentWidth = bounds?.width ?? 500;

  const isLastStep = activeIndex === 2;

  const cardVariants = {
    enter: {
      x: contentWidth,
      opacity: 0,
      height: contentHeight > 0 ? contentHeight : "auto",
      position: "initial",
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      height: contentHeight > 0 ? contentHeight : "auto",
    },
    exit: {
      zIndex: 0,
      x: -contentWidth,
      opacity: 0,
      position: "absolute",
      top: 0,
      width: "100%",
    },
  };

  return (
    <div className="relative">
      <GradientBackground gradient={gradient} active={isLastStep} />
      <div className="relative z-10 w-lg overflow-hidden rounded-xl border border-zinc-950/10 bg-white dark:bg-zinc-700">
        <TransitionPanel
          activeIndex={activeIndex}
          variants={cardVariants}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          {[NameStep, ColorStep, AccountStep].map((Step) => (
            <div ref={ref} key={Step.name}>
              <Step />
            </div>
          ))}
        </TransitionPanel>
        <div className="flex justify-center px-4">
          {!isLastStep && (
            <Button
              className="w-5/6 rounded-lg mb-12"
              size="lg"
              hoverScale={1.01}
              type="submit"
              disabled={loading}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
