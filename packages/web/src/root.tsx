import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import { useMemo } from "react";
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

import "./globals.css";

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

const deploymentUrl = import.meta.env.DEV
  ? "http://localhost:5173"
  : import.meta.env.VITE_DEPLOYMENT_URL;

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1] as {
    handle: { bodyClasses: string };
  };

  const ogImage = `${deploymentUrl}/og-image.jpg`;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <Meta />
        <title>Arcana - AI Insights For Productivity</title>

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Make sense of your work." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={deploymentUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Explore data from your productivity tools with AI."
        />
        <meta property="og:site_name" content="Arcana" />
        <meta
          property="og:description"
          content="Chat with your productivity tools like Asana. Effortlessly extract charts, highlights, and overviews to make smarter, faster business decisions."
        />

        {/* Twitter Card */}
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@chatwitharcana" />
        <meta
          name="twitter:title"
          content="Arcana - Make sense of your work."
        />
        <meta
          name="twitter:description"
          content="Chat with your productivity tools like Asana. Effortlessly extract charts, highlights, and overviews to make smarter, faster business decisions."
        />
        <meta
          name="twitter:image:alt"
          content="Explore data from your productivity tools with AI."
        />
        <Links />
      </head>
      <body className={currentRoute.handle?.bodyClasses}>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}

export default function Root() {
  const { convex, queryClient } = useMemo(() => {
    const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
    const convexQueryClient = new ConvexQueryClient(convex);
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          queryKeyHashFn: convexQueryClient.hashFn(),
          queryFn: convexQueryClient.queryFn(),
        },
      },
    });
    convexQueryClient.connect(queryClient);
    return { convex, queryClient };
  }, []);

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
