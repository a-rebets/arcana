import { useMeasure } from "@react-hookz/web";
import type { ComponentProps } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { GradientBackground } from "@/components/ui/gradient-background";
import { TransitionPanel } from "@/components/ui/transition-panel";
import { cn } from "@/lib/utils";
import type { OnboardingFormValues } from "./schema";
import { AccountStep } from "./steps/account";
import { ColorStep } from "./steps/color";
import { NameStep } from "./steps/name";

const cardVariants: ComponentProps<typeof TransitionPanel>["variants"] = {
  enter: ({ w, h }) => ({
    x: w,
    opacity: 0,
    height: h > 0 ? h : "auto",
    position: "initial" as const,
  }),
  center: ({ h }) => ({
    zIndex: 1,
    x: 0,
    opacity: 1,
    height: h > 0 ? h : "auto",
  }),
  exit: ({ w }) => ({
    zIndex: 0,
    x: -w,
    opacity: 0,
    position: "absolute" as const,
    top: 0,
    width: "100%",
  }),
};

export function OnboardingCard({
  activeIndex,
  loading,
}: {
  activeIndex: number;
  loading?: boolean;
}) {
  const { control } = useFormContext<OnboardingFormValues>();
  const gradient = useWatch({
    control,
    name: "gradient",
  });

  const [bounds, ref] = useMeasure<HTMLDivElement>();
  const contentHeight = bounds?.height ?? 200;
  const contentWidth = bounds?.width ?? 500;

  const isLastStep = activeIndex === 2;

  return (
    <div className="relative">
      <GradientBackground gradient={gradient} active={isLastStep} />
      <div
        className={cn(
          "relative z-10 overflow-hidden rounded-2xl border bg-card",
          isLastStep && "border-none",
        )}
      >
        <TransitionPanel
          activeIndex={activeIndex}
          variants={cardVariants}
          custom={{ w: contentWidth, h: contentHeight }}
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
        <div className="flex justify-center px-0 md:px-4">
          {!isLastStep && (
            <Button
              className="w-5/6 rounded-xl md:mb-12 mb-10 h-12"
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
