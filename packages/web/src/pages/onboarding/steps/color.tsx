import { ShuffleIcon } from "@phosphor-icons/react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { getGradientClasses, getRandomGradient } from "@/lib/colors";
import { cn } from "@/lib/utils";
import type { OnboardingFormValues } from "../schema";

export function ColorStep() {
  const { setValue, control } = useFormContext<OnboardingFormValues>();
  const gradient = useWatch({
    control,
    name: "gradient",
  });
  const name = useWatch({
    control,
    name: "name",
  });

  return (
    <section className="pt-6 pb-4 md:pt-9 px-0 md:px-4 flex flex-col items-center">
      <div className="rounded-xl p-1 shadow-md w-5/6 h-24 mb-6 md:mb-10">
        <div
          className={cn(
            "rounded-lg flex items-center justify-center h-full bg-linear-to-r",
            getGradientClasses(gradient),
          )}
        >
          <span className="font-accent text-3xl md:text-3xl text-[1.7rem] truncate">
            {name || "Your Name"}
          </span>
        </div>
      </div>
      <Button
        size="lg"
        variant="outline"
        className="w-[calc(5/6*100%-2px)] rounded-xl"
        hoverScale={1}
        onClick={() => {
          setValue("gradient", getRandomGradient());
        }}
        type="button"
      >
        <ShuffleIcon className="size-4" /> Change Color
      </Button>
    </section>
  );
}
