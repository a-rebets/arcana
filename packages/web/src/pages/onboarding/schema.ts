import z from "zod";
import { GradientSchema } from "@/lib/colors";

export const onboardingFormSchema = z.object({
  name: z.string().min(1).max(20),
  gradient: GradientSchema,
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
