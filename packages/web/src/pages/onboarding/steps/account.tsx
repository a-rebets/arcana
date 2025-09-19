import { api } from "@convex/api";
import { useToggle } from "@react-hookz/web";
import { useAction } from "convex/react";
import { useEffect } from "react";
import asana from "@/assets/asana.svg";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { EyeLoader } from "@/components/ui/loaders";
import { errorToast, successToast } from "@/components/ui/toasts";

export function AccountStep() {
	const [isLoading, toggleLoading] = useToggle(false);
	const startAsanaAuth = useAction(api.asana.oauth.actions.startAsanaAuth);

	const handleConnectAsana = async () => {
		try {
			toggleLoading(true);
			const authUrl = await startAsanaAuth({});
			window.open(authUrl, "asana-oauth");
		} catch (error) {
			console.error("Failed to start Asana auth:", error);
			toggleLoading(false);
		}
	};

	useEffect(() => {
		function onAsanaOAuthMessage(event: MessageEvent) {
			const apiUrl = import.meta.env.VITE_CONVEX_API_URL;
			const allowedOrigin = new URL(apiUrl).origin;
			if (event.origin !== allowedOrigin) return;

			const data = event.data as {
				type?: string;
				success?: boolean;
				message?: string;
			};

			if (data?.type !== "asana_oauth") return;

			toggleLoading(false);
			if (data.success) {
				successToast("Asana connected");
			} else {
				errorToast(`Asana connection failed: ${data.message}`);
			}
		}

		window.addEventListener("message", onAsanaOAuthMessage);
		return () => window.removeEventListener("message", onAsanaOAuthMessage);
	}, [toggleLoading]);

	return (
		<section className="pt-9 pb-12 px-4 flex flex-col items-center gap-10">
			<h3 className="text-center font-accent text-3xl text-zinc-800 dark:text-zinc-100">
				Connect your projects
			</h3>
			<Button
				size="lg"
				variant="outline"
				className="w-5/6 rounded-lg h-fit py-2"
				hoverScale={1.01}
				onClick={handleConnectAsana}
				disabled={isLoading}
			>
				{isLoading ? (
					<EyeLoader />
				) : (
					<div className="inline-flex flex-col items-center">
						<span className="text-xl">Authenticate</span>
						<div className="flex items-center gap-1 text-muted-foreground">
							<span>with</span>
							<img
								src={asana}
								alt="Asana Logo"
								className="w-16"
								draggable={false}
							/>
						</div>
					</div>
				)}
			</Button>
		</section>
	);
}
