import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "react-router";
import type { Route } from "./+types/root";
import { Toaster } from "./components/ui/sonner";
import { cn } from "./lib/utils";

import "./globals.css";

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

export const links: Route.LinksFunction = () => [
  {
    rel: "icon",
    href: "/favicon-16x16.png",
    sizes: "16x16",
    type: "image/png",
  },
  {
    rel: "icon",
    href: "/favicon-32x32.png",
    sizes: "32x32",
    type: "image/png",
  },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  { rel: "icon", href: "/favicon.ico" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1] as {
    handle: { bodyClasses: string };
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Arcana</title>
        <Meta />
        <Links />
      </head>
      <body
        className={cn(
          " bg-background text-foreground",
          currentRoute.handle?.bodyClasses ?? "",
        )}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <ConvexAuthProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          storageKey="arcana-theme"
          enableSystem={false}
          attribute="class"
        >
          <Outlet />
        </ThemeProvider>
      </QueryClientProvider>
    </ConvexAuthProvider>
  );
}
