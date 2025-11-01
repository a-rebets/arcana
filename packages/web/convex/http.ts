import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { postMessage } from "./ai/chat";
import { handleCallback } from "./asana/oauth/http";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/api/chat",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      headers: new Headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, User-Agent",
      }),
    });
  }),
});

http.route({
  path: "/api/chat",
  method: "POST",
  handler: postMessage,
});

http.route({ path: "/oauth/callback", method: "GET", handler: handleCallback });

export default http;
