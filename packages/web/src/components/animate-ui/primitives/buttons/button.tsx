import { type HTMLMotionProps, motion } from "motion/react";
import type { ComponentProps } from "react";
import {
	Slot,
	type WithAsChild,
} from "@/components/animate-ui/primitives/animate/slot";

type ButtonProps = Omit<
	WithAsChild<
		{
			hoverScale?: number;
			tapScale?: number;
		} & HTMLMotionProps<"button">
	>,
	"children"
> & {
	children?: ComponentProps<"button">["children"];
};

function Button({
	hoverScale = 1.05,
	tapScale = 0.95,
	asChild = false,
	...props
}: ButtonProps) {
	const Component = asChild ? Slot : motion.button;

	return (
		<Component
			whileTap={{ scale: tapScale }}
			whileHover={{ scale: hoverScale }}
			{...props}
		/>
	);
}

export { Button, type ButtonProps };
