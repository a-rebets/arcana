/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: shiki */
import { CheckIcon, CopyIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { cn } from "@/lib/utils";

type CodeBlockContextType = {
	code: string;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
	code: "",
});

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
	code: string;
	language: string;
	showLineNumbers?: boolean;
	children?: ReactNode;
};

export const CodeBlock = ({
	code,
	language,
	showLineNumbers = false,
	className,
	children,
	...props
}: CodeBlockProps) => {
	const [htmlLight, setHtmlLight] = useState<string>("");
	const [htmlDark, setHtmlDark] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		async function highlightCode() {
			try {
				setIsLoading(true);

				// Generate HTML for both light and dark themes
				const [lightHtml, darkHtml] = await Promise.all([
					codeToHtml(code, {
						lang: language,
						theme: "github-light",
						transformers: showLineNumbers
							? [
									{
										name: "line-numbers",
										pre(node) {
											this.addClassToHast(node, "line-numbers");
										},
									},
								]
							: [],
					}),
					codeToHtml(code, {
						lang: language,
						theme: "github-dark",
						transformers: showLineNumbers
							? [
									{
										name: "line-numbers",
										pre(node) {
											this.addClassToHast(node, "line-numbers");
										},
									},
								]
							: [],
					}),
				]);

				if (!cancelled) {
					setHtmlLight(lightHtml);
					setHtmlDark(darkHtml);
					setIsLoading(false);
				}
			} catch (_) {
				if (!cancelled) {
					// Fallback to plain text
					const fallback = `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
					setHtmlLight(fallback);
					setHtmlDark(fallback);
					setIsLoading(false);
				}
			}
		}

		highlightCode();

		return () => {
			cancelled = true;
		};
	}, [code, language, showLineNumbers]);

	return (
		<CodeBlockContext.Provider value={{ code }}>
			<div
				className={cn(
					"relative w-full overflow-hidden rounded-md border bg-background text-foreground",
					className,
				)}
				{...props}
			>
				<div className="relative">
					{isLoading ? (
						<div className="p-4">
							<div className="h-6 bg-muted animate-pulse rounded" />
						</div>
					) : (
						<>
							<div
								className="overflow-hidden dark:hidden [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-background [&_pre]:text-foreground [&_code]:text-sm [&_code]:font-mono"
								dangerouslySetInnerHTML={{ __html: htmlLight }}
							/>
							<div
								className="hidden overflow-hidden dark:block [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-background [&_pre]:text-foreground [&_code]:text-sm [&_code]:font-mono"
								dangerouslySetInnerHTML={{ __html: htmlDark }}
							/>
						</>
					)}
					{children && (
						<div className="absolute top-2 right-2 flex items-center gap-2">
							{children}
						</div>
					)}
				</div>
			</div>
		</CodeBlockContext.Provider>
	);
};

function escapeHtml(unsafe: string): string {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
	onCopy?: () => void;
	onError?: (error: Error) => void;
	timeout?: number;
};

export const CodeBlockCopyButton = ({
	onCopy,
	onError,
	timeout = 2000,
	children,
	className,
	...props
}: CodeBlockCopyButtonProps) => {
	const [isCopied, setIsCopied] = useState(false);
	const { code } = useContext(CodeBlockContext);

	const copyToClipboard = async () => {
		if (typeof window === "undefined" || !navigator.clipboard.writeText) {
			onError?.(new Error("Clipboard API not available"));
			return;
		}

		try {
			await navigator.clipboard.writeText(code);
			setIsCopied(true);
			onCopy?.();
			setTimeout(() => setIsCopied(false), timeout);
		} catch (error) {
			onError?.(error as Error);
		}
	};

	const Icon = isCopied ? CheckIcon : CopyIcon;

	return (
		<Button
			className={cn("shrink-0", className)}
			onClick={copyToClipboard}
			size="icon"
			variant="ghost"
			{...props}
		>
			{children ?? <Icon size={14} />}
		</Button>
	);
};
