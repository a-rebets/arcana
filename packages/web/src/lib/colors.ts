import z from "zod";

const gradient_colors = {
	red: ["from-red-300", "to-red-300"],
	orange: ["from-orange-300", "to-orange-300"],
	amber: ["from-amber-300", "to-amber-300"],
	yellow: ["from-yellow-300", "to-yellow-300"],
	lime: ["from-lime-300", "to-lime-300"],
	green: ["from-green-300", "to-green-300"],
	emerald: ["from-emerald-300", "to-emerald-300"],
	teal: ["from-teal-300", "to-teal-300"],
	cyan: ["from-cyan-300", "to-cyan-300"],
	sky: ["from-sky-300", "to-sky-300"],
	blue: ["from-blue-300", "to-blue-300"],
	indigo: ["from-indigo-300", "to-indigo-300"],
	violet: ["from-violet-300", "to-violet-300"],
	purple: ["from-purple-300", "to-purple-300"],
	fuchsia: ["from-fuchsia-300", "to-fuchsia-300"],
	pink: ["from-pink-300", "to-pink-300"],
	rose: ["from-rose-300", "to-rose-300"],
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
