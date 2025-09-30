import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { OnboardingFormValues } from "../schema";

export function NameStep() {
  const { control } = useFormContext<OnboardingFormValues>();

  return (
    <section className="pt-9 pb-12 px-4">
      <h3 className="text-center font-accent text-3xl text-zinc-800 dark:text-zinc-100 mb-10">
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
                className="w-5/6 mx-auto rounded-lg"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </section>
  );
}
