import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { OnboardingFormValues } from "../schema";

export function NameStep() {
  const { control } = useFormContext<OnboardingFormValues>();

  return (
    <section className="pt-6 pb-10 md:pt-9 md:pb-12 px-0 md:px-4">
      <h3 className="text-center font-accent md:text-3xl text-[1.7rem] mb-10">
        What should we call you?
      </h3>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="Enter your name"
                className="w-5/6 mx-auto rounded-xl h-10"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </section>
  );
}
