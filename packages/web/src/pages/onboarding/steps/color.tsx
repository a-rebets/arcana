import { ShuffleIcon } from "@phosphor-icons/react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { getGradientClasses, getRandomGradient } from "@/lib/colors";
import { cn } from "@/lib/utils";
import type { OnboardingFormValues } from "../schema";

export function ColorStep() {
  const { setValue, watch } = useFormContext<OnboardingFormValues>();
  const gradient = watch("gradient");
  const name = watch("name");

  const handleShuffleColors = () => {
    setValue("gradient", getRandomGradient());
  };

  return (
    <section className="pt-9 pb-4 px-4 flex flex-col items-center gap-10">
      <div className="rounded-lg p-1 shadow w-5/6 h-24">
        <div
          className={cn(
            "rounded-md flex items-center justify-center h-full bg-linear-to-r",
            getGradientClasses(gradient),
          )}
        >
          <span className="font-accent text-3xl truncate">
            {name || "Your Name"}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-[calc(5/6*100%-2px)] rounded-lg"
        hoverScale={1}
        onClick={handleShuffleColors}
        type="button"
      >
        <ShuffleIcon className="size-4" /> Change Color
      </Button>
    </section>
  );
}
