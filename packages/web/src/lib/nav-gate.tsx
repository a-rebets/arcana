import { api } from "@convex/api";
import { useConvexAuth, useQuery } from "convex/react";
import { Navigate, Outlet, useLocation } from "react-router";

type GatePolicy =
	| "redirectIfAuthed"
	| "requireAuth"
	| "requireOnboardingCompleted"
	| "redirectIfOnboarded";

type GateProps = {
	policy: GatePolicy;
};

export function Gate({ policy }: GateProps) {
	const auth = useConvexAuth();
	const location = useLocation();
	const user = useQuery(api.accounts.getUser);

	if (auth.isLoading) return null;

	switch (policy) {
		case "redirectIfAuthed": {
			return auth.isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
		}
		case "requireAuth": {
			if (!auth.isAuthenticated) {
				return <Navigate to="/welcome" replace state={{ from: location }} />;
			}
			return <Outlet />;
		}
		case "requireOnboardingCompleted": {
			if (user === undefined) return null;
			if (!user?.onboardingCompletedTime) {
				return <Navigate to="/onboarding" replace state={{ from: location }} />;
			}
			return <Outlet />;
		}
		case "redirectIfOnboarded": {
			if (user === undefined) return null;
			if (user?.onboardingCompletedTime) {
				const state = location.state as { from?: { pathname?: string } } | null;
				return <Navigate to={state?.from?.pathname ?? "/"} replace />;
			}
			return <Outlet />;
		}
		default:
			return <Outlet />;
	}
}
