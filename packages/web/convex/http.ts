import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { handleCallback } from "./asana/oauth/http";
import { auth } from "./auth";
import { postMessage } from "./chat";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
	path: "/api/chat",
	method: "OPTIONS",
	handler: httpAction(async (_, request) => {
		const headers = request.headers;
		if (
			headers.get("Origin") !== null &&
			headers.get("Access-Control-Request-Method") !== null &&
			headers.get("Access-Control-Request-Headers") !== null
		) {
			return new Response(null, {
				headers: new Headers({
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "POST",
					"Access-Control-Allow-Headers": "Content-Type, Authorization",
					"Access-Control-Max-Age": "86400",
				}),
			});
		} else {
			return new Response();
		}
	}),
});

http.route({
	path: "/api/chat",
	method: "POST",
	handler: postMessage,
});

http.route({ path: "/oauth/callback", method: "GET", handler: handleCallback });

export default http;
