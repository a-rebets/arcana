import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "../lib/api";
import { AsanaApiError } from "./errors";

export type AsanaOpenAPIPaths = paths;

export type OpenAPIClient = ReturnType<typeof createClient<AsanaOpenAPIPaths>>;

export type CreateClientOptions = {
  baseUrl?: string;
  token?: string;
};

export type AsanaHttpClient = {
  client: OpenAPIClient;
  setToken: (token: string | undefined) => void;
  getToken: () => string | undefined;
};

export function createOpenAPIClient(
  options?: CreateClientOptions,
): AsanaHttpClient {
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

  const client = createClient<AsanaOpenAPIPaths>({ baseUrl });
  client.use(authMiddleware);

  // Error middleware: convert non-2xx into AsanaApiError uniformly
  const errorMiddleware: Middleware = {
    async onResponse({ response }) {
      if (!response.ok) {
        let body: unknown;
        try {
          body = await response.clone().json();
        } catch {
          // fallback to text
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
    setToken: (token) => {
      accessToken = token;
    },
    getToken: () => accessToken,
  } as const;
}
