import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Toggle } from "./ui/toggle";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<div>
			<Toggle
				variant="outline"
				className="group data-[state=on]:hover:bg-muted text-foreground data-[state=on]:text-foreground data-[state=on]:hover:text-foreground size-8 rounded-full border-border shadow-none data-[state=on]:bg-transparent"
				pressed={theme === "dark"}
				onPressedChange={() =>
					setTheme((prev) => (prev === "dark" ? "light" : "dark"))
				}
				aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
			>
				<MoonIcon
					size={16}
					className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
					aria-hidden="true"
				/>
				<SunIcon
					size={16}
					className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
					aria-hidden="true"
				/>
			</Toggle>
		</div>
	);
}
