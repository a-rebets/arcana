export class AsanaApiError extends Error {
  readonly status: number;
  readonly requestId?: string;
  readonly retryAfterMs?: number;
  readonly details?: unknown;

  constructor(
    message: string,
    opts: {
      status: number;
      requestId?: string;
      retryAfterMs?: number;
      details?: unknown;
    },
  ) {
    super(message);
    this.name = "AsanaApiError";
    this.status = opts.status;
    this.requestId = opts.requestId;
    this.retryAfterMs = opts.retryAfterMs;
    this.details = opts.details;
  }

  static fromResponse(response: Response, errorBody: unknown): AsanaApiError {
    const status = response.status;
    const requestId = response.headers.get("x-request-id") ?? undefined;
    const retryAfter = response.headers.get("retry-after");
    const retryAfterMs = retryAfter ? parseRetryAfter(retryAfter) : undefined;

    let message = `Asana API error ${status}`;
    try {
      const body = errorBody as { errors?: Array<{ message?: string }> };
      const first = body?.errors?.[0];
      if (typeof first?.message === "string") {
        message = first.message;
      }
    } catch {}

    return new AsanaApiError(message, {
      status,
      requestId,
      retryAfterMs,
      details: errorBody,
    });
  }
}

function parseRetryAfter(value: string): number | undefined {
  const seconds = Number(value);
  if (!Number.isNaN(seconds)) return Math.max(0, Math.floor(seconds * 1000));
  return undefined;
}

export function unwrap<T>(result: {
  data?: T;
  error?: unknown;
  response: Response;
}): T {
  if (result.error !== undefined && result.error !== null) {
    throw AsanaApiError.fromResponse(result.response, result.error);
  }
  return result.data as T;
}
