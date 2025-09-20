import { api } from "@convex/api";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { errorToast } from "@/components/ui/toasts";

export function useAsanaRefresh() {
	const [ready, setReady] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const refresh = useAction(api.asana.oauth.actions.refreshTokens);

	useEffect(() => {
		let cancelled = false;
		async function run() {
			try {
				await refresh({});
				if (!cancelled) setReady(true);
			} catch (e) {
				if (!cancelled) {
					const msg = (e as Error).message ?? "Failed to refresh Asana tokens";
					setError(msg);
					errorToast(msg);
					setReady(true);
				}
			}
		}
		run();
		return () => {
			cancelled = true;
		};
	}, [refresh]);

	return { ready, error } as const;
}
