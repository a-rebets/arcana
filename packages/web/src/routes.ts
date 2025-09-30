import { layout, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  layout("layouts/nav/public.tsx", [
    route("/welcome", "pages/welcome/index.tsx"),
  ]),
  layout("layouts/nav/protected.tsx", [
    layout("layouts/nav/onboarded.tsx", [
      route("/", "pages/main/index.tsx"),
      route("/chat/:threadId", "pages/main/index.tsx", { id: "chat" }),
    ]),

    layout("layouts/nav/not-onboarded.tsx", [
      route("/onboarding", "pages/onboarding/index.tsx"),
    ]),
  ]),
  route("*", "pages/not-found.tsx"),
] satisfies RouteConfig;
