import createClient, { type Middleware } from "openapi-fetch";
import type { components, paths } from "../lib/api";
import { AsanaApiError } from "./errors";

export function createOpenAPIClient(options?: {
  baseUrl?: string;
  token?: string;
}) {
  const baseUrl = options?.baseUrl ?? "https://app.asana.com/api/1.0";
  let accessToken: string | undefined = options?.token;

  const authMiddleware: Middleware = {
    async onRequest({ request }) {
      if (accessToken) {
        request.headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return request;
    },
  };

  const client = createClient<paths>({ baseUrl });
  client.use(authMiddleware);

  const errorMiddleware: Middleware = {
    async onResponse({ response }) {
      if (!response.ok) {
        let body: unknown;
        try {
          body = await response.clone().json();
        } catch {
          try {
            body = await response.clone().text();
          } catch {}
        }
        throw AsanaApiError.fromResponse(response, body);
      }
      return response;
    },
  };
  client.use(errorMiddleware);

  return {
    client,
    setToken: (token: string | undefined) => {
      accessToken = token;
    },
    getToken: () => accessToken,
  };
}

export type AsanaPaths = paths;
export type AsanaComponents = components;
export type AsanaApiClient = ReturnType<typeof createClient<paths>>;
