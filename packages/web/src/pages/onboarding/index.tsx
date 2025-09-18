import "./index.css";

import { api } from "@convex/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { getRandomGradient } from "@/lib/colors";
import { OnboardingCard } from "./card";
import { type OnboardingFormValues, onboardingFormSchema } from "./schema";

function Page() {
	const [activeIndex, setActiveIndex] = useState(0);
	const { mutate: updateUserInfo, isPending } = useMutation({
		mutationFn: useConvexMutation(api.accounts.updateUserInfo),
	});

	const form = useForm<OnboardingFormValues>({
		resolver: zodResolver(onboardingFormSchema),
		defaultValues: {
			name: "",
			gradient: getRandomGradient(),
		},
	});

	const onSubmit = (_data: OnboardingFormValues) => {
		activeIndex === 2 ? null : setActiveIndex(activeIndex + 1);
		if (_data.name && _data.gradient) {
			updateUserInfo({
				profileColors: _data.gradient,
				name: _data.name,
			});
		}
	};

	return (
		<main className="min-h-screen w-full flex items-center justify-center onboarding-layout">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<OnboardingCard activeIndex={activeIndex} loading={isPending} />
				</form>
			</Form>
		</main>
	);
}

export default Page;
