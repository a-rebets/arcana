import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { Gate } from "./lib/nav-gate";
import MainPage from "./pages/main/index";
import NotFoundPage from "./pages/not-found/index";
import OnboardingPage from "./pages/onboarding";
import WelcomePage from "./pages/welcome/index";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryKeyHashFn: convexQueryClient.hashFn(),
			queryFn: convexQueryClient.queryFn(),
		},
	},
});
convexQueryClient.connect(queryClient);

const elem = document.getElementById("root");
if (!elem) {
	throw new Error("Root element not found");
}

createRoot(elem).render(
	<StrictMode>
		<ConvexAuthProvider client={convex}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider
					storageKey="arcana-theme"
					enableSystem={false}
					attribute="class"
				>
					<App />
				</ThemeProvider>
			</QueryClientProvider>
		</ConvexAuthProvider>
	</StrictMode>,
);

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Gate policy="redirectIfAuthed" />}>
					<Route path="/welcome" element={<WelcomePage />} />
				</Route>
				<Route element={<Gate policy="requireAuth" />}>
					<Route element={<Gate policy="requireOnboardingCompleted" />}>
						<Route path="/" element={<MainPage />} />
					</Route>
					<Route element={<Gate policy="redirectIfOnboarded" />}>
						<Route path="/onboarding" element={<OnboardingPage />} />
					</Route>
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
			<Toaster richColors position="bottom-right" />
		</BrowserRouter>
	);
}
