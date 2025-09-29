import type { UIMessage } from "@convex-dev/agent";
import { consumeStream } from "ai";
import { internal } from "../_generated/api";
import { httpAction } from "../_generated/server";
import { arcanaAgent } from "../ai/agent";

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

  const connection = await ctx.runQuery(
    internal.asana.oauth.protected.getConnection,
    {},
  );

  const result = await arcanaAgent.streamText(
    ctx,
    { threadId },
    {
      prompt: messagePart?.text,
      experimental_context: {
        asanaToken: connection?.accessToken,
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
    sendSources: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Vary: "origin",
    },
  });
});
