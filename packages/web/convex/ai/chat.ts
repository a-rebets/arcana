import type { UIMessage } from "@convex-dev/agent";
import { consumeStream, NoSuchToolError } from "ai";
import { asanaTools } from "asana-tools";
import { internal } from "../_generated/api";
import { httpAction } from "../_generated/server";
import { arcanaAgent } from "../ai/agent";
import { artifactsTools } from "../artifacts";
import { requireUserId } from "../helpers";

type PostMessageRequest = {
  threadId: string;
  message?: UIMessage;
  webSearch: boolean;
};

export const postMessage = httpAction(async (ctx, request) => {
  const parsedRequest: PostMessageRequest = await request.json();
  const { threadId, message, webSearch } = parsedRequest;

  const messagePart = message?.parts?.[0];
  if (messagePart && (message.role !== "user" || messagePart.type !== "text")) {
    return new Response("Invalid message", { status: 400 });
  }

  const userId = await requireUserId(ctx);

  const connection = await ctx.runQuery(
    internal.asana.oauth.protected.getConnection,
    { userId },
  );

  const result = await arcanaAgent.streamText(
    { ...ctx, asanaToken: connection?.accessToken },
    { threadId },
    {
      prompt: messagePart?.text,
      tools: {
        ...asanaTools,
        ...artifactsTools,
      },
      providerOptions: {
        openrouter: {
          plugins: webSearch
            ? [
                {
                  id: "web",
                  engine: "exa",
                },
              ]
            : [],
        },
      },
    },
    {
      saveStreamDeltas: { returnImmediately: true, throttleMs: 1500 },
    },
  );

  return result.toUIMessageStreamResponse({
    consumeSseStream: async ({ stream }) => {
      await consumeStream({ stream });
    },
    onError: (error) => {
      if (NoSuchToolError.isInstance(error)) {
        return "The model tried to call a unknown tool.";
      }
      if (error instanceof Error) {
        return error.message;
      }
      return String(error);
    },
    sendSources: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Vary: "origin",
    },
  });
});
