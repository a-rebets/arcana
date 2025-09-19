import z from "zod";

const gradient_colors = {
	red: ["from-red-300 dark:from-red-500", "to-red-300 dark:to-red-500"],
	orange: [
		"from-orange-300 dark:from-orange-500",
		"to-orange-300 dark:to-orange-500",
	],
	amber: [
		"from-amber-300 dark:from-amber-500",
		"to-amber-300 dark:to-amber-500",
	],
	yellow: [
		"from-yellow-300 dark:from-yellow-500",
		"to-yellow-300 dark:to-yellow-500",
	],
	lime: ["from-lime-300 dark:from-lime-500", "to-lime-300 dark:to-lime-500"],
	green: [
		"from-green-300 dark:from-green-500",
		"to-green-300 dark:to-green-500",
	],
	emerald: [
		"from-emerald-300 dark:from-emerald-500",
		"to-emerald-300 dark:to-emerald-500",
	],
	teal: ["from-teal-300 dark:from-teal-500", "to-teal-300 dark:to-teal-500"],
	cyan: ["from-cyan-300 dark:from-cyan-500", "to-cyan-300 dark:to-cyan-500"],
	sky: ["from-sky-300 dark:from-sky-500", "to-sky-300 dark:to-sky-500"],
	blue: ["from-blue-300 dark:from-blue-500", "to-blue-300 dark:to-blue-500"],
	indigo: [
		"from-indigo-300 dark:from-indigo-500",
		"to-indigo-300 dark:to-indigo-500",
	],
	violet: [
		"from-violet-300 dark:from-violet-500",
		"to-violet-300 dark:to-violet-500",
	],
	purple: [
		"from-purple-300 dark:from-purple-500",
		"to-purple-300 dark:to-purple-500",
	],
	fuchsia: [
		"from-fuchsia-300 dark:from-fuchsia-500",
		"to-fuchsia-300 dark:to-fuchsia-500",
	],
	pink: ["from-pink-300 dark:from-pink-500", "to-pink-300 dark:to-pink-500"],
	rose: ["from-rose-300 dark:from-rose-500", "to-rose-300 dark:to-rose-500"],
} as const;

type GradientColor = keyof typeof gradient_colors;

const GradientColorEnum = z.enum(
	Object.keys(gradient_colors) as GradientColor[],
);

const GradientSchema = z
	.tuple([GradientColorEnum, GradientColorEnum])
	.refine(([a, b]) => a !== b, {
		message: "Gradient colors must be different",
	});

type Gradient = z.infer<typeof GradientSchema>;

function getRandomGradient(): Gradient {
	const colorKeys = Object.keys(gradient_colors);
	const randomColorKey = () =>
		colorKeys[Math.floor(Math.random() * colorKeys.length)];
	const fromKey = randomColorKey();
	let toKey = randomColorKey();

	while (toKey === fromKey) {
		toKey = randomColorKey();
	}

	return [fromKey as GradientColor, toKey as GradientColor];
}

function getGradientClasses(gradient: Gradient): string {
	const [from, to] = gradient;
	return `${gradient_colors[from][0]} ${gradient_colors[to][1]}`;
}

export { GradientSchema, getRandomGradient, getGradientClasses, type Gradient };
